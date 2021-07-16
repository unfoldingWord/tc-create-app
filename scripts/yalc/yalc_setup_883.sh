#!/bin/sh

BRANCH="zach-883-exit-prompt"
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

echo ________________________________
echo Working on markdown-translatable
echo
cd ../markdown-translatable
git switch master
git pull 
git switch $BRANCH
git pull
yarn install
yalc publish

echo _________________________________
echo Working on datatable-translatable
echo
cd ../datatable-translatable
git switch master
git pull 
git switch $BRANCH
git pull
yalc remove --all
yalc link markdown-translatable
yarn install
yalc publish

echo ______________________________
echo Working on gitea-react-toolkit
echo
cd ../gitea-react-toolkit
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
git switch develop
git pull 
git switch $BRANCH
git pull
yalc remove --all
yalc link markdown-translatable
yalc link datatable-translatable
yalc link gitea-react-toolkit
yarn install
yarn start
