#!/usr/bin/env python3
import argparse
import json
import sys

def simple_categorize(text):
	t = (text or '').lower()
	tags = []
	category = 'Other'
	score = 0.5
	if any(k in t for k in ['wifi','network','internet']):
		category = 'Technology'
		tags = ['network','connectivity']
		score = 0.9
	elif any(k in t for k in ['hostel','room','mess','maintenance']):
		category = 'Hostel'
		tags = ['facility','maintenance']
		score = 0.85
	elif any(k in t for k in ['grade','grading','exam','marks']):
		category = 'Academic'
		tags = ['grading','academic']
		score = 0.88
	else:
		tags = ['general']
	return { 'category': category, 'tags': tags, 'score': score }

def main():
	parser = argparse.ArgumentParser()
	parser.add_argument('--text', type=str, default='')
	args = parser.parse_args()
	res = simple_categorize(args.text)
	sys.stdout.write(json.dumps(res))

if __name__ == '__main__':
	main()
