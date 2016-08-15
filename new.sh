#!/usr/bin/env bash

ABSOLUTE_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
templateFile="$ABSOLUTE_PATH/blog-template.md"
newFile="$ABSOLUTE_PATH/_drafts/new-file.md"

cp $templateFile $newFile

open $newFile