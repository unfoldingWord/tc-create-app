#!/bin/sh

BRANCH="feature-cn-788-impl-tsv-parser"
CURDIR=`pwd`
PROJDIR=`basename $CURDIR`

if [ "$PROJDIR" != "tc-create-app" ]
then
  echo "Script must be run from ./tc-create-app"
  echo "found $PROJDIR"
  exit
fi

echo Assumptions:
echo All project folders are at same level
echo All branch names for each project folder are the same 

echo _________________________________
echo Working on datatable-translatable
echo
cd ../datatable-translatable
git checkout master
git pull 
git checkout $BRANCH
yalc remove --all
git pull
yarn install
yalc publish


echo ________________________
echo Working on tc-create-app
echo
cd ../tc-create-app
echo First, remove any existing yalc links
yalc remove --all
git checkout develop
git pull 

yalc link datatable-translatable
yarn install
yarn start
