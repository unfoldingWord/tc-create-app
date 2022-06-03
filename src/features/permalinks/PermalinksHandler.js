import React, { useContext } from 'react'
import { useDeepCompareEffect } from 'use-deep-compare';
import { useNavigation,PermalinksConfig } from '@gwdevs/permalinks-hooks';
import { AppContext } from '../../App.context';
import useFormattedLink from './useFormattedLink';
import routes from './routes.json';


export default function PermalinksHandler({ children }) {
  const { state } = useContext(AppContext);

  const formattedLink = useFormattedLink(state);
  const { push } = useNavigation();

  useDeepCompareEffect(() => {
      push(formattedLink, state);
  }, [formattedLink, push, state]);

  return (
    <PermalinksConfig routes={routes}>{children}</PermalinksConfig>
  )
}
