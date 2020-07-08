import localforage from 'localforage';
import appPackage from '../../package.json';

const stateStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: `${appPackage.name}-state-store`,
});

export const loadState = async (key) => {
  let value = await stateStore.getItem(key);
  return value;
};

export const saveState = async (key, value) => {
  let response;

  if ( value === null || value === undefined ) {
    response = await stateStore.removeItem(key);
  } else {
    response = await stateStore.setItem(key, value);
  }
  return response;
};


export const loadAuthentication = async () => {
  return loadState('authentication');
};

export const saveAuthentication = async (authentication) => {
  saveState('authentication', authentication)
};
