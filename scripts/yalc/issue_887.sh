#!/bin/sh

BRANCH="feature-cn-887-dynamic-language-fetch"
CURDIR=`pwd`
PROJDIR=`basename $CURDIR`

if [ "$PROJDIR" != "tc-create-app" ]
then
  echo "Script must be run from ./tc-create-app"
  exit
fi

echo Assumptions:
echo All project folders are at same level
echo All branch names for each project folder are the same 

echo ________________________
echo Working on tc-create-app
echo
echo First, remove any existing yalc links
yalc remove --all
git switch develop
git pull 
git switch $BRANCH
yarn install
yarn start
