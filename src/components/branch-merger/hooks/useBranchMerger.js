import { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import { 
  defaultStatus, 
  DEFAULT_AUTO_CHECK_INTERVAL 
} from '../constants'
import { branchOperations } from '../branchOperations'
import { createQueuedOperation } from '../utils/queuedOperation'
import { withRetry } from '../utils/withRetry'
import { useSnackbar } from '../../../contexts/SnackbarContext'

/**
 * Hook for managing git branch operations between user branch and default/master branch.
 * Handles merging, updating, and checking status of branches with rate limiting and retries.
 * 
 * @param {Object} params
 * @param {string} params.server - Server URL
 * @param {string} params.owner - Repository owner
 * @param {string} params.repo - Repository name
 * @param {string} params.userBranch - User branch name
 * @param {string} params.tokenid - Authentication token
 * @param {Object} [options]
 * @param {boolean} [options.autoCheck=false] - Enable automatic status checking
 * @param {number} [options.autoCheckInterval=30000] - Interval for auto checking in ms
 */
export function useBranchMerger({ 
  server, 
  owner, 
  repo, 
  userBranch, 
  tokenid 
}, {
  autoCheck = false,
  autoCheckInterval = DEFAULT_AUTO_CHECK_INTERVAL
} = {}) {
  const snackbar = useSnackbar();
  const [mergeStatus, setMergeStatus] = useState(defaultStatus);
  const [updateStatus, setUpdateStatus] = useState(defaultStatus);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingMerge, setLoadingMerge] = useState(false);
  const [isAutoChecking, setIsAutoChecking] = useState(autoCheck);

  // Store interval ID for cleanup
  const autoCheckIntervalId = useRef(null);

  const params = useMemo(() => ({ 
    server, owner, repo, userBranch, tokenid 
  }), [server, owner, repo, userBranch, tokenid]);

  // Create queue for rate-limited operations
  const queuedOperation = useMemo(() => createQueuedOperation(), []);

  // Validate all required parameters are present
  const validateParams = useCallback(() => {
    const missingParams = Object.entries(params)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingParams.length > 0) {
      return { 
        ...defaultStatus, 
        error: true, 
        message: `Missing required parameters: ${missingParams.join(', ')}` 
      };
    }
  }, [params]);

  // Check if branch has any changes
  const checkBranchHasChanges = useCallback(async () => {
    try {
      // First get the PR ID for this branch
      const prsResponse = await fetch(
        `${server}/api/v1/repos/${owner}/${repo}/pulls?state=open&sort=updated&order=desc`,
        { 
          headers: { 
            'Authorization': `token ${tokenid}`,
            'Accept': 'application/json'
          } 
        }
      );

      if (!prsResponse.ok) {
        console.error('Failed to fetch PRs:', prsResponse.status);
        return false;
      }

      const prs = await prsResponse.json();
      const pr = prs.find(p => p.head.ref === userBranch);

      if (!pr) {
        console.log('No open PR found for branch:', userBranch);
        return false;
      }

      // Get the list of changed files in the PR
      const filesResponse = await fetch(
        `${server}/api/v1/repos/${owner}/${repo}/pulls/${pr.number}/files`,
        { 
          headers: { 
            'Authorization': `token ${tokenid}`,
            'Accept': 'application/json'
          } 
        }
      );

      if (!filesResponse.ok) {
        console.error('Failed to fetch PR files:', filesResponse.status);
        return false;
      }

      const files = await filesResponse.json();
      
      // Check if there are any files with changes
      return files && files.length > 0 && 
             files.some(file => file.changes > 0);
    } catch (error) {
      console.error('Error checking branch changes:', error);
      return false;
    }
  }, [server, owner, repo, userBranch, tokenid]);

  // Create operations with consistent error handling and loading states
  const checkUpdateStatus = useCallback(
    async (additionalParams = {}) => {
      const validationError = validateParams();
      if (validationError) return validationError;

      setLoadingUpdate(true);
      try {
        const result = await withRetry(() => 
          queuedOperation(() => branchOperations.checkPullFromDefault({ ...params, ...additionalParams }))
        );
        setUpdateStatus(result);
        return result;
      } catch (error) {
        const errorStatus = { 
          ...defaultStatus, 
          error: true, 
          message: error.message 
        };
        setUpdateStatus(errorStatus);
        return errorStatus;
      } finally {
        setLoadingUpdate(false);
      }
    },
    [params, queuedOperation, validateParams]
  );

  const updateUserBranch = useCallback(
    async (additionalParams = {}) => {
      const validationError = validateParams();
      if (validationError) {
        snackbar.error(validationError.message);
        return validationError;
      }

      setLoadingUpdate(true);
      try {
        const result = await withRetry(() => 
          queuedOperation(() => branchOperations.pullFromDefault({ ...params, ...additionalParams }))
        );
        setUpdateStatus(result);
        
        if (!result.error) {
          snackbar.success('Successfully updated branch from default');
        } else {
          snackbar.error(result.message);
        }
        
        return result;
      } catch (error) {
        const errorStatus = { 
          ...defaultStatus, 
          error: true, 
          message: error.message 
        };
        setUpdateStatus(errorStatus);
        snackbar.error(error.message);
        return errorStatus;
      } finally {
        setLoadingUpdate(false);
      }
    },
    [params, queuedOperation, validateParams, snackbar]
  );

  const checkMergeStatus = useCallback(
    async (additionalParams = {}) => {
      const validationError = validateParams();
      if (validationError) return validationError;

      setLoadingMerge(true);
      try {
        // First check if branch has any changes
        const hasChanges = await checkBranchHasChanges();
        console.log('hasChanges', hasChanges);
        if (!hasChanges) {
          const errorStatus = {
            ...defaultStatus,
            error: true,
            message: 'Cannot merge: Branch has no changes from the default branch'
          };
          setMergeStatus(errorStatus);
          return errorStatus;
        }

        // If there are changes, proceed with the normal merge status check
        const result = await withRetry(() => 
          queuedOperation(() => branchOperations.checkPushToDefault({ ...params, ...additionalParams }))
        );
        setMergeStatus(result);
        return result;
      } catch (error) {
        const errorStatus = { 
          ...defaultStatus, 
          error: true, 
          message: error.message 
        };
        setMergeStatus(errorStatus);
        return errorStatus;
      } finally {
        setLoadingMerge(false);
      }
    },
    [params, queuedOperation, validateParams, checkBranchHasChanges]
  );

  const mergeMasterBranch = useCallback(
    async (prDescription) => {
      const validationError = validateParams();
      if (validationError) {
        snackbar.error(validationError.message);
        return validationError;
      }

      // Check if branch has any changes before attempting merge
      const hasChanges = await checkBranchHasChanges();
      if (!hasChanges) {
        const errorStatus = {
          ...defaultStatus,
          error: true,
          message: 'Cannot merge: Branch has no changes from the default branch'
        };
        setMergeStatus(errorStatus);
        snackbar.error(errorStatus.message);
        return errorStatus;
      }

      setLoadingMerge(true);
      try {
        const result = await withRetry(() => 
          queuedOperation(() => branchOperations.pushToDefault({ ...params, prDescription }))
        );
        setMergeStatus(result);
        
        if (!result.error) {
          snackbar.success('Successfully merged changes to default branch');
        } else {
          snackbar.error(result.message);
        }
        
        return result;
      } catch (error) {
        const errorStatus = { 
          ...defaultStatus, 
          error: true, 
          message: error.message 
        };
        setMergeStatus(errorStatus);
        snackbar.error(error.message);
        return errorStatus;
      } finally {
        setLoadingMerge(false);
      }
    },
    [params, queuedOperation, validateParams, checkBranchHasChanges, snackbar]
  );

  /**
   * Start automatic status checking at specified interval
   */
  const startAutoCheck = useCallback(() => {
    if (autoCheckIntervalId.current) return; // Already running

    setIsAutoChecking(true);
    checkUpdateStatus(); // Initial check
    autoCheckIntervalId.current = setInterval(checkUpdateStatus, autoCheckInterval);
  }, [checkUpdateStatus, autoCheckInterval]);

  /**
   * Stop automatic status checking
   */
  const stopAutoCheck = useCallback(() => {
    if (autoCheckIntervalId.current) {
      clearInterval(autoCheckIntervalId.current);
      autoCheckIntervalId.current = null;
    }
    setIsAutoChecking(false);
  }, []);

  // Handle auto-check initialization and cleanup
  useEffect(() => {
    if (autoCheck) {
      startAutoCheck();
    }

    return () => {
      if (autoCheckIntervalId.current) {
        clearInterval(autoCheckIntervalId.current);
      }
    };
  }, [autoCheck, startAutoCheck]);

  // Handle changes to autoCheckInterval
  useEffect(() => {
    if (isAutoChecking) {
      stopAutoCheck();
      startAutoCheck();
    }
  }, [autoCheckInterval, isAutoChecking, startAutoCheck, stopAutoCheck]);

  // Initial status check
  useEffect(() => {
    checkMergeStatus();
    if (!autoCheck) {
      checkUpdateStatus(); // Only check if not auto-checking
    }
  }, [checkMergeStatus, checkUpdateStatus, autoCheck]);

  return {
    state: {
      mergeStatus,
      updateStatus,
      loadingUpdate,
      loadingMerge,
      isAutoChecking
    },
    actions: {
      checkUpdateStatus,
      checkMergeStatus,
      updateUserBranch,
      mergeMasterBranch,
      startAutoCheck,
      stopAutoCheck
    }
  };
}

export default useBranchMerger;
