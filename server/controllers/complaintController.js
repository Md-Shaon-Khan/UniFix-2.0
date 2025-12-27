const { Complaint, User, TimelineEvent, Notification, sequelize } = require('../models');

// 1. List All Complaints
exports.list = async (req, res) => {
  try {
    const complaints = await Complaint.findAll({
      include: [
        { 
          model: User, 
          as: 'student', 
          attributes: ['id', 'name', 'avatar', 'credibility_score'] // Only send safe public info
        }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(complaints);
  } catch (err) {
    console.error("List Error:", err);
    res.status(500).json({ error: 'Server error fetching complaints' });
  }
};

// 2. Create Complaint
exports.create = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction
  try {
    const { title, description, category, priority, isAnonymous, location } = req.body;
    const userId = req.user.id;

    // A. Create the Complaint
    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      is_anonymous: isAnonymous,
      location,
      user_id: userId,
      status: 'Submitted'
    }, { transaction: t });

    // B. Create Timeline Event
    await TimelineEvent.create({
      complaint_id: complaint.id,
      user_id: userId,
      type: 'submission',
      message: 'Complaint submitted successfully'
    }, { transaction: t });

    // C. Notify Authorities (Mock Logic: Notify all admins)
    // In a real app, you'd filter users by role='authority'
    // For now, we assume frontend handles the socket event broadcast
    
    await t.commit(); // Save everything
    res.status(201).json(complaint);

  } catch (err) {
    await t.rollback(); // Undo if fail
    console.error("Create Error:", err);
    res.status(500).json({ error: 'Server error creating complaint' });
  }
};

// 3. Get Single Complaint Details
exports.get = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByPk(id, {
      include: [
        { 
          model: User, 
          as: 'student', 
          attributes: ['id', 'name', 'avatar', 'department', 'credibility_score'] 
        },
        {
          model: TimelineEvent,
          as: 'timeline',
          include: [{ model: User, attributes: ['name', 'role'] }],
          order: [['created_at', 'ASC']]
        }
      ]
    });

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    res.json(complaint);

  } catch (err) {
    console.error("Get Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 4. Vote on Complaint
exports.vote = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findByPk(id);
    
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    // Increment votes
    complaint.votes = (complaint.votes || 0) + 1;
    await complaint.save();

    // Optional: Log who voted to prevent double voting (requires a Votes table)
    
    res.json(complaint);
  } catch (err) {
    console.error("Vote Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 5. Update Status (Authority Only)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const complaint = await Complaint.findByPk(id);
    if (!complaint) return res.status(404).json({ error: 'Not found' });

    complaint.status = status;
    await complaint.save();

    // Log to Timeline
    await TimelineEvent.create({
      complaint_id: id,
      user_id: req.user.id,
      type: 'status_change',
      message: `Status updated to ${status}`
    });

    // Create Notification for the Student
    await Notification.create({
      user_id: complaint.user_id,
      message: `Your complaint "${complaint.title}" is now ${status}`,
      is_read: false
    });

    res.json(complaint);
  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({ error: 'Server error' });
  }
};