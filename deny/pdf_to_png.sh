#!/bin/bash
cd /var/www/grant_management_tool/allow/presa
find . -maxdepth 1 -name "$2*.png" -type f -exec rm -f {} \;
pdftoppm /var/www/grant_management_tool/deny/files/$1 -rx 144 -ry 144 $2 -png
find . -maxdepth 1 -name "$2*.png" -printf '.' | wc -m
