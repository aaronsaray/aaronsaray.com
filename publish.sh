#!/usr/bin/env bash
if [ -z "$1" ]; then
	echo "please choose an article from _drafts"
	exit
fi

if [ ! -f $1 ]; then
	echo "$1 not found"
	exit
fi

datePart=$(date +"%Y-%m-%d") 
fileName=$(basename $1)

newFile="_posts/${datePart}-${fileName}"

mv $1 $newFile

echo "${newFile} created from $1"



