#!/bin/bash
nice -n 5 convert -strip $1 -coalesce -auto-orient -resize '192x192' $2
