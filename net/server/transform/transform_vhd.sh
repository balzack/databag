#!/bin/bash
ffmpeg -i $1 -y -f mp4 -map_metadata -1 -vf scale=720:-2 -c:v libx264 -crf 23 -preset veryfast -c:a aac $2
