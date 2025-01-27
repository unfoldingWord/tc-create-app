import { createContext, useContext } from 'react';

export const BranchMergerContext = createContext(null);

/**
 * Hook to use branch merger context.
 * Throws if used outside of BranchMergerProvider.
 */
export function useBranchMergerContext() {
  const context = useContext(BranchMergerContext);
  if (!context) {
    throw new Error('useBranchMergerContext must be used within a BranchMergerProvider');
  }
  return context;
} 