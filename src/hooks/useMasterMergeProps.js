import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../App.context';
import { BranchMergerContext } from '../components/branch-merger/context/BranchMergerProvider';

export function useMasterMergeProps({isLoading: _isLoading = false} = {}) {
  const [isLoading, setIsLoading] = useState(_isLoading);
  const [open, setOpen] = useState(false);
  
  const {
    state: { mergeStatus, loadingMerge }, actions: { mergeMasterBranch, checkMergeStatus }
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
    setOpen(false);
  }, [targetFileHook.state])

  const { load: loadTargetFile } = targetFileHook.actions || {};
  const { content: targetContent } = targetFileHook.state || {};

  useEffect(() => {
    checkMergeStatus()
  }, [targetContent,checkMergeStatus])

  const pending = mergeStatus.mergeNeeded || mergeStatus.conflict
  const blocked = mergeStatus.conflict || contentIsDirty;

  const onClick = () => {
    setOpen(true);
  }

  const onCancel = () => {
    setOpen(false);
  }

  const onSubmit = (description) => {
    console.log({ description });
    setIsLoading(true);
    mergeMasterBranch(description).then((response) => {
      if (response.success && response.message === "") {
        loadTargetFile()
      }
      else {
        setIsLoading(false)
        setOpen(false);
      };
    })
  }
  return {
    isLoading: (isLoading | loadingMerge),
    onClick,
    onSubmit,
    onCancel,
    open,
    pending,
    blocked,
    loadingProps
  }
}
