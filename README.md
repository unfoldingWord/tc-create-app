[![Netlify Status](https://api.netlify.com/api/v1/badges/b1463957-7c2f-4297-b5f0-afb4f985a2fc/deploy-status)](https://app.netlify.com/sites/tc-create-app/deploys)
[![Custom badge](https://img.shields.io/endpoint?color=%2374b9ff&url=https%3A%2F%2Fraw.githubusercontent.com%2FunfoldingWord%2Ftc-create-app%2Fmaster%2Fcoverage%2Fshields.json)]()
![Coveralls github](https://img.shields.io/coveralls/github/unfoldingWord/tc-create-app?label=Unit%20Tests)
![ ](https://github.com/unfoldingWord/tc-create-app/workflows/Install%2C%20Build%20%26%20Run%20Cypress/badge.svg?branch=master)

https://create.translationcore.com

# Development and Deployment Process

## Changes completed: 
- Github: `develop` branch created and made default on `tc-create-app` repo.
- Netlify branch deploys enabled for `develop` branch: https://develop--tc-create-app.netlify.com

## Workflow: 
- PRs will automatically be created against `develop` branch from here.
- PRs will build and deploy on Netlify for previews.
- Merges to `develop` branch will build and deploy here: https://develop--tc-create-app.netlify.com
- QA and others can verify `develop` before merging to `master`.
- When `master` is updated, production will be deployed: https://tc-create-app.netlify.com

## Using a feature branch in an RCL

**WARNING** I was never able to get this work. I would always get the compile failure below. I have retained this info for future reference.
```
Failed to compile.

./src/components/translatable/QuoteSelector.js
Module not found: Can't resolve 'scripture-resources-rcl' in 'C:\Users\mando\Projects\unfoldingWord\license-info-issue-122\src\components\translatable'
```

This command allows you to use a feature branch of an RCL.

First, remove the dependency from `package.json`.

Second, run:
```
yarn add unfoldingword/scripture-resources-rcl#feature-cn-license-info 
```

Also rans:
```
$ yarn add file:C:/Users/mando/Projects/unfoldingWord/scripture-resources-rcl
```

Some links for future reference:
- See [here](https://medium.com/@jonchurch/use-github-branch-as-dependency-in-package-json-5eb609c81f1a)
for some details.
- Another link [here](https://martinwolf.org/2018/04/github-branch-as-dependency-package-json/)
- https://stackoverflow.com/questions/43411864/how-to-install-package-from-github-repo-in-yarn
- lots of yarn details [here](https://classic.yarnpkg.com/en/docs/cli/add#toc-adding-dependencies)

After all of the above and several attempts:
1. the `yarn.lock` file looks right.
2. the `./node_modules/scripture-resources-rcl` directory looks right.

However, the module still cannot be resolved.