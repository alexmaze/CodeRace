#!/bin/bash

# params $1 prefix

mkdir log

BUILD_TIME=$( { time $( go build -o app . 2> log/build.log ); } 2>&1 )
RUN_TIME=$( { time $(./app 2>&1 > log/run.log); } 2>&1 )

echo "BUILD_TIME: "$BUILD_TIME > log/time.log
echo "RUN_TIME: "$RUN_TIME >> log/time.log
