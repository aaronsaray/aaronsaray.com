#!/usr/bin/env bash

if [ ! -f $1 ]; then
	echo "$1 not found"
	exit
fi

datePart=$(date +"%Y-%m-%d") 
fileName=$(basename $1)

newFile="_posts/${datePart}-${fileName}"

mv $1 $newFile

echo "${newFile} created from $1"



