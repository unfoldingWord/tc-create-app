[![Netlify Status](https://api.netlify.com/api/v1/badges/b1463957-7c2f-4297-b5f0-afb4f985a2fc/deploy-status)](https://app.netlify.com/sites/glts/deploys)
[![Custom badge](https://img.shields.io/endpoint?color=%2374b9ff&url=https%3A%2F%2Fraw.githubusercontent.com%2FunfoldingWord%2Fgateway-language-translation-suite%2Fmaster%2Fcoverage%2Fshields.json)]()
![Coveralls github](https://img.shields.io/coveralls/github/unfoldingWord/gateway-language-translation-suite?label=Unit%20Tests)
![ ](https://github.com/unfoldingWord/gateway-language-translation-suite/workflows/Install%2C%20Build%20%26%20Run%20Cypress/badge.svg?branch=master)

![GLTS Logo](./public/glts_logo.png)
[Logo](https://www.onlinewebfonts.com/icon/474664) is licensed by CC BY 3.0


# Development and Deployment Process

## Changes completed: 
- Github: `develop` branch created and made default on `gateway-language-translation-suite` repo.
- Netlify branch deploys enabled for `develop` branch: https://develop--glts.netlify.com

## Workflow: 
- PRs will automatically be created against `develop` branch from here.
- PRs will build and deploy on Netlify for previews.
- Merges to `develop` branch will build and deploy here: https://develop--glts.netlify.com
- QA and others can verify `develop` before merging to `master`.
- When `master` is updated, production will be deployed: https://glts.netlify.com
