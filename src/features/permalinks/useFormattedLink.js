import { useState, useEffect } from 'react';
import useStateKeys from './useStateKeys';
import { useLocation } from '@gwdevs/permalinks-hooks';

export default function useFormattedLink({ filepath, organization, sourceRepository, language }) {
  const { keys } = useStateKeys({ filepath, organization, sourceRepository, language }); 
  const [formattedLink, setFormattedLink] = useState();
  const { search } = useLocation();

  useEffect(() => {
    const entry = 'project';
    const org = keys?.organization;
    const lang = keys?.language;
    const repo = keys?.resource;
    const filepath = keys?.filepath;

    const path = [org, lang, repo, filepath].filter(Boolean).join('/');
    if (!!path) {
      setFormattedLink(entry + '/' + path + search);
    }
  }, [keys,search]);
  
  return formattedLink;
}
