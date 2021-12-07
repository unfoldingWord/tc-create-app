import { useEffect } from 'react';

export default function useBeforeunload({
  prompt,
  isConfirmed,
  contentIsDirty = false,
}) {
  console.log({ contentIsDirty });
  useEffect(() => {
    const handleBeforeunload = (event) => {
      event.preventDefault();

      // const confirm = await isConfirmed(prompt);
      // if (confirm) {
      //   event.preventDefault();
      // }

      // Chrome requires `returnValue` to be set.
      // if (event.defaultPrevented) {
      //   event.returnValue = '';
      // }

      // if (typeof returnValue === 'string') {
      //   event.returnValue = 'promptText';
      //   return 'promptText';
      // }
    };

    if (contentIsDirty) {
      window.addEventListener('beforeunload', () => handleBeforeunload());
    }

    return () => {
      window.removeEventListener('beforeunload', (e) => handleBeforeunload(e));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentIsDirty]);
}

