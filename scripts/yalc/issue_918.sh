#!/bin/sh

BRANCH="zach-867-autoSave-WIP"
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

cd ../markdown-translatable
git switch master
git pull 
git switch $BRANCH
git pull
yarn install
yalc publish

cd ../datatable-translatable
git switch master
git pull 
git switch $BRANCH
git pull
yarn install
yalc publish

cd ../gitea-react-toolkit
git switch master
git pull 
git switch $BRANCH
git pull
yarn install
yalc publish

cd ../scripture-resources-rcl
git switch master
git pull 
git switch $BRANCH
git pull
yarn install
yalc publish

cd ../tc-create-app
git switch develop
git pull 
git switch $BRANCH
git pull
yalc remove --all
yalc link markdown-translatable
yalc link datatable-translatable
yalc link gitea-react-toolkit
yalc link scripture-resources-rcl
yarn install
yarn start
