import React, {useContext, useEffect} from 'react'
import { useNavigation,PermalinksConfig } from '@gwdevs/permalinks-hooks';
import { AppContext } from '../../App.context';
import useFormattedLink from './useFormattedLink';
import routes from './routes.json';


export default function PermalinksHandler({ children }) {
  const { state, actions } = useContext(AppContext);
  
  console.log({ actions });
  // const onPopState = (event) => {
  //   const {state:eventState} = event;

  //   if (!state || !actions) return;

  //   actions.setFilepath(eventState.filepath);
  //   actions.setOrganization(eventState.organization);
  //   actions.setSourceRepository(eventState.sourceRepository);
  //   actions.setResourceLinks(eventState.resourceLinks);
  //   actions.setLanguage(eventState.language);
  // };
  
  // useEffect(() => {
  //   window.addEventListener('popstate', onPopState);
  //   return () => {
  //     window.removeEventListener('popstate', onPopState);
  //   }
  // }, []);
  
  const formattedLink = useFormattedLink(state);
  const { push } = useNavigation();

  useEffect(() => {
      push(formattedLink, state);
  }, [formattedLink, push, state]);

  return (
    <PermalinksConfig routes={routes}>{children}</PermalinksConfig>
  )
}
