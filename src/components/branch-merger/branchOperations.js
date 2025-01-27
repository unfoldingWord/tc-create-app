import {
  mergeDefaultIntoUserBranch,
  checkMergeDefaultIntoUserBranch,
  checkMergeUserIntoDefaultBranch,
  mergeUserIntoDefaultBranch
} from "dcs-branch-merger"

/**
 * Defines operations for syncing between default/master branch and user branch.
 * 
 * Operations:
 * - pullFromDefault: Pull changes FROM default/master branch INTO user branch
 * - checkPullFromDefault: Check if user branch needs updates from default/master
 * - pushToDefault: Push changes FROM user branch TO default/master
 * - checkPushToDefault: Check if user branch can be merged into default/master
 */
export const branchOperations = {
  pullFromDefault: mergeDefaultIntoUserBranch,
  checkPullFromDefault: checkMergeDefaultIntoUserBranch,
  pushToDefault: mergeUserIntoDefaultBranch,
  checkPushToDefault: checkMergeUserIntoDefaultBranch,
} 