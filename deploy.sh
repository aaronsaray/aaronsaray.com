#!/usr/bin/env bash
rsync -rz _site/ aaronsaray:/vagrant/sites/aaronsaray.com/_site && terminal-notifier -title "Rsync Complete" -message "The blog has been sync'd successfully"

