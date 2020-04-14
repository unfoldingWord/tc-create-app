# Workflow for Managing Changes to RCLs used by an App

## Problem: 

Needed changes are identified for an app, but the changes must be done to a dependency used by the app. In this case, the dependency is an RCL.

## Solution: 

1. clone the RCL repository
1. create a feature branch that matches the one used for app (if any: it may be that no changes are needed other than a rebuild to include new version of RCL)
1. make changes to RCL
1. make changes to Styleguidest (config, markdown, etc.)
1. verify results with Styleguidest
1. update cypress tests (if needed)
1. commit and push changes
1. request merge
1. when merge is approved/completed, then request that RCL be (re) published to NPM 
1. once in NPM, get the new version number for RCL 
1. update app package.json for RCL 
1. do yarn install to refresh packages (node modules)
1. test app 
1. if not ok, start over at step 3.
1. cleanup the feature branch in the RCL (needed?)