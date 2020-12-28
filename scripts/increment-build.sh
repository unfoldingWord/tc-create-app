#!/bin/sh
build_number_dir=public/build_number
build_number=`cat "$build_number_dir"`
build_number=$((build_number + 1))
echo "$build_number" > "$build_number_dir"