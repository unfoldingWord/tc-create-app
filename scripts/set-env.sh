#!/bin/sh
NODE_ENV=development
REACT_APP_BUILD_NUMBER=$(cat public/build_number)
export NODE_ENV=$NODE_ENV
export REACT_APP_BUILD_NUMBER=$REACT_APP_BUILD_NUMBER