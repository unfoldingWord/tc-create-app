[![Netlify Status](https://api.netlify.com/api/v1/badges/b1463957-7c2f-4297-b5f0-afb4f985a2fc/deploy-status)](https://app.netlify.com/sites/tc-create-app/deploys)
[![Custom badge](https://img.shields.io/endpoint?color=%2374b9ff&url=https%3A%2F%2Fraw.githubusercontent.com%2FunfoldingWord%2Ftc-create-app%2Fmaster%2Fcoverage%2Fshields.json)]()
![Coveralls github](https://img.shields.io/coveralls/github/unfoldingWord/tc-create-app?label=Unit%20Tests)
![ ](https://github.com/unfoldingWord/tc-create-app/workflows/Install%2C%20Build%20%26%20Run%20Cypress/badge.svg?branch=master)

## Purpose:

tC Create is a web-based application (https://create.translationcore.com) that enables users to translate and edit unfoldingWord’s Gateway Language resources. This tool will greatly expedite the production of the resources needed to further unfoldingWord’s Gateway Language Strategy.

## Usage:

tC Create allows users to translate from unfoldingWord’s English Translation Notes, Translation Words, Translation Questions, Translation Academy and Open Bible Stories. Once the resources are translated and checked in tC Create, they can be used in unfoldingWord’s translationCore tool to check Bible translations.

## ![|624x184](https://lh5.googleusercontent.com/-AeATTog0tOcS9Fv1b0SEjPpIJvrKZpguWhMTTUtUyDgnaa0seG7nqBfQYlXXpK7yTh9uUKD_AHrypekRYbzpj7F7xE-L9aE7Liyj7rqD22-gLerjMmm4aJnNBxoIFmQXXu--dUX) Features:

- Supports unfoldingWord’s markdown (.md) and tab-separated values (.tsv) files
- Parallel view of the text allows for comparison to the original file
- Text can be edited in smaller portions or in larger blocks
- Directly reads and writes to the Door43 Content Service
- Branched workflow protects the master files from unauthorized changes

## Learn More:

[translationCore Create: How to video](https://drive.google.com/file/d/12cpPTgEnQULFMhefLoPN9Skzm3Kcl9Nj/view?usp=sharing)

tC Create is built using [React Component Libraries](https://forum.door43.org/t/component-libraries/396). These libraries ([listed here](https://forum.door43.org/t/component-list/468)) can be used for other applications and we hope that others will contribute libraries to this effort.

## Developer Notes

[Details on how the auto-increment build number works](https://git.door43.org/cecil.new/journals/src/branch/master/tc-create-app%23586.md)