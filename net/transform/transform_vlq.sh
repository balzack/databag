#!/bin/sh
ffmpeg -i $1 -y -f mp4 -map_metadata -1 -vf scale=320:-2 -c:v libx264 -crf 32 -preset veryfast -c:a aac $2

