#!/bin/bash

# params $1 prefix

BUILD_TIME=$( { time $(go build -o app ./src 2>&1 > log/build_$1.log); } 2>&1 )
RUN_TIME=$( { time $(./app 2>&1 > log/run_$1.log); } 2>&1 )

echo "BUILD_TIME: "$BUILD_TIME > log/time_$1.log
echo "RUN_TIME: "$RUN_TIME >> log/time_$1.log
