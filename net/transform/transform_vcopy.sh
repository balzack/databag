#!/bin/sh
ffmpeg -i $1 -y -f mp4 -map_metadata -1 -c:v copy -c:a copy $2

