#!/bin/bash

# extended latin characters, includes all latin characters and umlauts, as well as basic math symbols
UNICODE_RANGE="U+20-7F,U+A0-FF,©"

cd ./src/_fonts

# do the subsetting magic
glyphhanger --whitelist=$UNICODE_RANGE --subset="*.ttf" --format=woff2,woff

# create the dist folder
mkdir -p dist

# move all subset files into the folder
mv *?-*?-subset* ../assets/fonts/