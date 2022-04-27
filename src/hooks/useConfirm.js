import { useState, useContext } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import { ConfirmContext } from '../context/ConfirmContextProvider';

export default function useConfirm({ contentIsDirty }) {
  const [needsCleanup, setNeedsCleanup] = useState(false);
  const [confirm, setConfirm] = useContext(ConfirmContext);

  useDeepCompareEffect(() => () => {
    if (confirm.cancel && needsCleanup) {
      confirm.cancel();
    }
  }, [confirm, needsCleanup]);

  const isConfirmed = (prompt) => {
    setNeedsCleanup(true);

    if (contentIsDirty) {
      const promise = new Promise((resolve, reject) => {
        setConfirm({
          prompt,
          isOpen: true,
          proceed: resolve,
          cancel: reject,
        });
      });

      return promise.then(
        () => {
          setConfirm({ ...confirm, isOpen: false });
          return true;
        },
        () => {
          setConfirm({ ...confirm, isOpen: false });
          return false;
        }
      );
    } else {
      return true;
    }
  };

  return {
    ...confirm,
    isConfirmed,
  };
};
