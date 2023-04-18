import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App.context';
import { BranchMergerContext } from '../components/branch-merger/context/BranchMergerProvider';

export function useContentUpdateProps({isLoading: _isLoading = false} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading);
  const {
    state: { updateStatus, loadingUpdate }, actions: { updateUserBranch, checkUpdateStatus }
  } = useContext(BranchMergerContext);

  const {
    state: { contentIsDirty },
    giteaReactToolkit: {
      targetFileHook,
    },
  } = useContext(AppContext);

  const loadingProps = { color: loadingUpdate ? "primary" : "secondary" };

  useEffect(() => {
    setIsLoading(false);
  }, [targetFileHook.state])

  const { load: loadTargetFile } = targetFileHook.actions || {};
  const { content: targetContent } = targetFileHook.state || {};

  useEffect(() => {
    checkUpdateStatus()
  }, [targetContent,checkUpdateStatus])

  const pending = updateStatus.mergeNeeded || updateStatus.conflict
  const blocked = updateStatus.conflict || contentIsDirty;

  const onClick = () => {
    setIsLoading(true);
    updateUserBranch().then((response) => {
      if (response.success && response.message === "") loadTargetFile()
      else setIsLoading(false);
    })
  }

  return { isLoading: (isLoading | loadingUpdate),onClick,pending,blocked,loadingProps }
}
