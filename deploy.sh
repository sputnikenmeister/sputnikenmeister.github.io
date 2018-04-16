#!/bin/sh
grunt && git add . && git commit --amend -m '---' && git push
