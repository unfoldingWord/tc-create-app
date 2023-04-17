import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App.context';
import { BranchMergerContext } from '../components/branch-merger/context/BranchMergerProvider';

export function useMasterMergeProps({isLoading: _isLoading = false} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading);
  const {
    state: { mergeStatus, loadingMerge }, actions: { mergeMasterBranch }
  } = useContext(BranchMergerContext);

  const {
    state: { contentIsDirty },
    giteaReactToolkit: {
      targetFileHook,
    },
  } = useContext(AppContext);

  console.log({mergeStatus})

  const loadingProps = { color: loadingMerge ? "primary" : "secondary" };

  useEffect(() => {
    setIsLoading(false);
  }, [targetFileHook.state])

  const { load: loadTargetFile } = targetFileHook.actions || {};

  const pending = mergeStatus.mergeNeeded || mergeStatus.conflict
  const blocked = mergeStatus.conflict || contentIsDirty;

  const onClick = () => {
    setIsLoading(true);
    mergeMasterBranch().then((response) => {
      if (response.success && response.message === "") loadTargetFile()
      else setIsLoading(false);
    })
  }
  return { isLoading: (isLoading | loadingMerge),onClick,pending,blocked,loadingProps }
}
