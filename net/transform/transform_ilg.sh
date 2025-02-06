#!/bin/sh
nice -n 5 convert -strip $1 -coalesce -auto-orient -resize '1024x1024>' $2

