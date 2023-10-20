---
name: Release issue template
about: Steps to follow for Release process
title: ''
labels: ''
assignees: ''

---

**Feature: Original Scripture text on the right most position in scripture pane.
#### Prepare Staging 
- [ ] PR to remove RC from the version number
  - start in new branch (e.g., `zpp-remove-rc-1.6`); 
  - edit `package.json` for version (e.g., v*.*); commit; publish
  - `git tag` (e.g., v*.*);    `git push --tags`
  - create PR from `remove...` branch --> `develop`;  connect this PR to the "RELEASE" issue
  - merge this PR (even if you merge it yourself, please use PR and do not commit directly to the develop branch)
- [ ]  Release Branch:
  - pull latest develop changes
  - create new branch: release branch for version*.* from develop
  - publish release branch to github
- [ ] Create staging Netlify link (PROD Data)
  - create new PR from `v*.*` --> `STAGE`; connect to the release issue
  - walk through happy path on deploy preview
  - merge 
  - Monitor build: wait 20 minutes?  https://stage--tc-create-app.netlify.app/
    Verify version & build number are updated.
    (If the DEPLOY PREVIEW encountered NO errors, then STAGE should build fine.)
#### QA Release and Staged 
  - [ ]  Ping QA that release branch for version *.* is ready for testing  
  - [ ] Release notes are drafted
  - [ ] QA approves release notes
  - [ ] QA gives go-ahead to release to production
#### Release and Publish
  - [ ] PR from release branch for version *.* to Master
    - create new PR from `STAGE` --> `master`; connect to the release issue
    - walk through happy path on deploy preview
    - merge 
    - Monitor build: wait 20 minutes?  
       - https://app.netlify.com/sites/tc-create-app/deploys/
       - https://create.translationcore.com/
       - Verify version & build number are updated.
          (If the DEPLOY PREVIEW encountered NO errors, then PROD should build fine.)
  - [ ] Ping QA that production release is released
  - [ ] Final Go ahead  from QA to notify the users of the new release
  - [ ] tag release on Github v*.*
  - [ ] publish release note
  - [ ] Announce on forum.door43.org https://forum.door43.org/t/tc-create-1-x-release-notes/661
