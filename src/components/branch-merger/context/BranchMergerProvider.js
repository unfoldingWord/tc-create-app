import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { BranchMergerContext } from './BranchMergerContext';
import useBranchMerger from '../hooks/useBranchMerger';
import { DEFAULT_AUTO_CHECK_INTERVAL } from '../constants';

/**
 * Provider component for branch merger functionality.
 * Provides branch operations and status through context.
 */
export function BranchMergerProvider({
  children,
  server,
  owner,
  repo,
  userBranch,
  tokenid,
  autoCheck = false,
  autoCheckInterval = DEFAULT_AUTO_CHECK_INTERVAL
}) {
  const branchMerger = useBranchMerger(
    { server, owner, repo, userBranch, tokenid },
    { autoCheck, autoCheckInterval }
  );

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => branchMerger, [branchMerger]);

  return (
    <BranchMergerContext.Provider value={contextValue}>
      {children}
    </BranchMergerContext.Provider>
  );
}

BranchMergerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  server: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  repo: PropTypes.string.isRequired,
  userBranch: PropTypes.string.isRequired,
  tokenid: PropTypes.string.isRequired,
  autoCheck: PropTypes.bool,
  autoCheckInterval: PropTypes.number
};

export default BranchMergerProvider;
