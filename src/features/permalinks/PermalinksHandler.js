import React, { useContext, useCallback } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare';
import { useNavigation,PermalinksConfig } from '@gwdevs/permalinks-hooks';
import { AppContext } from '../../App.context';
import { useLocation } from '@gwdevs/permalinks-hooks'
import routes from './routes.json';
import {getStateKeys} from './helpers'

export default function PermalinksHandler({ children }) {
  const { state } = useContext(AppContext);
  const { push } = useNavigation();
  const location = useLocation();
  console.log({location});

  const getFormattedLink = useCallback((state) => {
    const search = window.location.search;
    const keys = getStateKeys(state);
    const entry = 'project';
    const org = keys?.organization;
    const lang = keys?.language;
    const repo = keys?.resource;
    const filepath = keys?.filepath;

    const path = [org, lang, repo, filepath].filter(Boolean).join('/');
    if (!!path) {
      const permalink = entry + '/' + path;
      return search ? permalink + search : permalink;
    }
  }, []);

  useDeepCompareEffect(() => {
    push(getFormattedLink(state),state);
  }, [getFormattedLink, state]);

  return (
    <PermalinksConfig routes={routes}>{children}</PermalinksConfig>
  )
}
