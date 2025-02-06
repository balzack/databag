#!/bin/sh
#ffmpeg -i $1 -y -f mp4 -map_metadata -1 -c:v copy -c:a copy $2
#ffmpeg -f mp4 -i color=c=black:s=1280x720:r=5 -i $1 -crf 0 -c:a copy -shortest $2
ffmpeg -i $1 -y -f mp3 -map_metadata -1 -c:a copy $2
