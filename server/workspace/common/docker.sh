#!/bin/bash

docker run \
  -v $(pwd):/data golang:1.13.5 \
  /bin/bash -c 'cd /data && ls && ./build_and_run.sh'
