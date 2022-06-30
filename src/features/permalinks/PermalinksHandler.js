import React, { useContext, useCallback, useEffect } from 'react'
import { useDeepCompareEffect, useDeepCompareCallback } from 'use-deep-compare';
import { useNavigation,PermalinksConfig } from '@gwdevs/permalinks-hooks';
import { AppContext } from '../../App.context';
import routes from './routes.json';
import {getStateKeys} from './helpers'

export default function PermalinksHandler({ children }) {
  const { state, actions } = useContext(AppContext);

  const { setState } = actions;

  const setHistoryState = useDeepCompareCallback(() => window.history.state || window.history.replaceState(state, null) || state, [state]);

  const restoreState = useCallback(() => {
    console.log("restoring state from history");
    const historyState = setHistoryState();
    setState(historyState);
  }, [setState,setHistoryState]);

  useEffect(() => {
    window.addEventListener('popstate', restoreState);
    return () => {
      window.removeEventListener('popstate', restoreState);
    }
  },[restoreState])

  const { push } = useNavigation();

  const getFormattedLink = useCallback((state) => {
    const search = window.location.search;
    const keys = getStateKeys(state);
    const entry = 'project';
    const org = keys?.organization;
    const repo = keys?.resource;
    const lang = keys?.language;
    const filepath = keys?.filepath;

    const path = [org, repo, lang, filepath].filter(Boolean).join('/');
    if (!!path) {
      const permalink = entry + '/' + path;
      return search ? permalink + search : permalink;
    }
  }, []);

  useDeepCompareEffect(() => {
    if (!window.history.state) setHistoryState();
    push(getFormattedLink(state),state);
  }, [getFormattedLink, state, setHistoryState]);

  return (
    <PermalinksConfig routes={routes}>{children}</PermalinksConfig>
  )
}
