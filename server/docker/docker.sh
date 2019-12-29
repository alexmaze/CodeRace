#!/bin/bash

docker run golang:1.13.5 \
    -v ./:/data \
    ./buildAndRun.sh
