#!/bin/bash
set -e
TMPFILE=$(mktemp /tmp/databag-XXXXX)
ffmpeg -ss 0 -i $1 -y -vframes 1 -q:v 2 $TMPFILE.jpg 
convert -strip $TMPFILE.jpg -auto-orient -resize '640x640>' $2
