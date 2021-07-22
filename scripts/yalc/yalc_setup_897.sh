#!/bin/sh

BRANCH="feature-cn-897-add-row-below-deleted-rows"
CURDIR=`pwd`
DIRNAME=`dirname $CURDIR`
PROJDIR=`basename $DIRNAME`

if [ "$PROJDIR" != "tc-create-app" ]
then
  echo "Script must be run from ./tc-create-app/scripts"
  exit
fi
cd ..
echo Assumptions:
echo All project folders are at same level
echo All branch names for each project folder are the same 

echo _________________________________
echo Working on datatable-translatable
echo
cd ../datatable-translatable
git switch master
git pull 
git switch $BRANCH
git pull
yarn install
yalc publish


echo ________________________
echo Working on tc-create-app
echo
cd ../tc-create-app
echo First, remove any existing yalc links
yalc remove --all
git switch develop
git pull 

yalc link datatable-translatable
yarn install
yarn start
