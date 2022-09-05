#!/bin/bash
nice -n 5 convert -strip $1 -auto-orient -resize '1024x1024>' $2

