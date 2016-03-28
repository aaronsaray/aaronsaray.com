#!/usr/bin/env bash
jekyll build && terminal-notifier -title "Blog Built" -message "Jekyll has built the blog successfully"
git add *
git commit -a -m "Building blog"
git push
terminal-notifier -title "Commit Done" -message "Committed and pushed source to GitHub"

