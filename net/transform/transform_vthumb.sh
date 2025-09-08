#!/bin/sh
set -e
TMPFILE=$(mktemp)
ffmpeg -ss $3 -i $1 -y -vframes 1 -q:v 2 $TMPFILE.jpg 
convert -strip $TMPFILE.jpg -auto-orient -resize '320x320>' $2
