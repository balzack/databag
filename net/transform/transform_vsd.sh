#!/bin/sh
ffmpeg -i $1 -y -f mp4 -map_metadata -1 -vf scale=640:-2 -vcodec libx265 -crf 32 -preset veryfast -tag:v hvc1 -acodec mp3 $2
