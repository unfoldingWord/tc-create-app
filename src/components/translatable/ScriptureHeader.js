import React, {useState} from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ParallelScripture, ResourcesContext } from 'scripture-resources-rcl';
import { ScriptureCard } from 'single-scripture-rcl'
import { useDeepCompareMemo } from 'use-deep-compare';
import { getMuiTheme } from './muiTheme';

export default function ScriptureHeader({
  quote,
  onQuote,
  occurrence: _occurrence,
  reference,
  buttons,
  open,
}) {
  const { state } = React.useContext(ResourcesContext);
  const { resources, books } = state;
const userName = 'test-user'

function useUserLocalStorage(userName, key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    return refreshFromLocalStorage();
  })

  function getUserKey(username, baseKey) {
    const key_ = username ? `${username}_${baseKey}` : baseKey // get user key
    return key_
  }

  function refreshFromLocalStorage() {
    const key_ = getUserKey(userName, key)
    try {
      // Get from local storage by key
      const item = localStorage.getItem(key_)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(`useLocalStorage(${key_}) - init error:'`, error)
      return initialValue
    }
  }

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    const key_ = getUserKey(userName, key)

    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      let valueJSON = JSON.stringify(valueToStore)
      localStorage.setItem(key_, valueJSON)
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(`useLocalStorage.setValue(${key_}) - error:'`, error)
    }
  }

  return [storedValue, setValue, refreshFromLocalStorage]
}
  /** wrapper that applies current username */
  function useUserLocalStorage_(key, initialValue) {
    return useUserLocalStorage(userName, key, initialValue)
  }

  reference.projectId= 'tit';

      console.log(resources);
  console.log(books);
  const __occurrence = (_occurrence === '\\-1') ? -1 : _occurrence;
  const occurrence = Number(__occurrence);
   const cardProps = {
     title: 'Literal Translation',
     type: 'scripture_card',
     id: 'scripture_card_Literal_Translation',
     cardNum: -1,
     resource: {
    owner: "unfoldingWord",
    originalLanguageOwner: "unfoldingWord",
    languageId: "en",
    resourceId: 'TARGET_LITERAL'
  },
     appRef: 'master',
     getLanguage: () => ({ direction: 'ltr'}),
     isNT: () => true,
     // resource:resources[0],
     resourceStatus: {},
     server: "https://git.door43.org",
     direction: 'ltr',
     useUserLocalStorage:useUserLocalStorage_,

   };

  const component = useDeepCompareMemo(() => {
    return resources.map((resource) => {
      cardProps.resource.languageId = resource.languageId;
      cardProps.cardNum++;
      return <ScriptureCard
          open={open}
          reference={reference}
          quote={quote}
          onQuote={onQuote}
          occurrence={occurrence}
          height='250px'
          buttons={buttons}
          {...cardProps}
      />
    });

  }, [quote, occurrence, reference, open, buttons, onQuote]);

  return (
    <MuiThemeProvider theme={getMuiTheme}>
      {component}
    </MuiThemeProvider>
  );
};
