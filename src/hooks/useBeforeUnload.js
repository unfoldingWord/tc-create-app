import React, { useEffect } from 'react';

export default function useBeforeunload ({ contentIsDirty, handleClickOpen }) {
    useEffect(() => {
        const handleBeforeunload = (event) => {
          event.preventDefault()
          handleClickOpen()
        }
    
        if (!contentIsDirty) {
          window.addEventListener('beforeunload', handleBeforeunload)
        }
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeunload)
        }
      }, [contentIsDirty])
}
 
