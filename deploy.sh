#!/bin/sh
git pull && grunt && git add . && git commit --amend -m '---' && git push
