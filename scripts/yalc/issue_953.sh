#!/bin/sh

if [ "$PROJDIR" != "tc-create-app" ]
then
  echo "Script must be run from ./tc-create-app"
  echo "found $PROJDIR"
  exit
fi

cd ../datatable-translatable
git pull
git switch feature-cn-788-impl-tsv-parser
yalc remove --all
yarn
yalc publish

cd ../tc-create-app
git pull
git checkout feature-cn-953-add-sn-sq
yalc remove --all
yarn
yalc link datatable-translatable
yarn start

