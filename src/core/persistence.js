import localforage from 'localforage';
import appPackage from '../../package.json';

const stateStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: `${appPackage.name}-state-store`,
});

export const loadState = async (key) => {
  let value;

  try {
    const valueString = await stateStore.getItem(key);
    value = JSON.parse(valueString);
  } catch {
    // value = null;
  }
  return value;
};

export const saveState = async (key, value) => {
  let response;

  if (value === null || value === undefined) {
    response = await stateStore.removeItem(key);
  } else {
    response = await stateStore.removeItem(key);
  }
  return response;
};

export const loadAuthentication = async () => {
  let _authentication = await loadState('authentication');
  if (
    _authentication &&
    !(_authentication.user && _authentication.user.username)
  )
    _authentication = null;
  return _authentication;
};

export const saveAuthentication = async (authentication) => {
  saveState('authentication', authentication);
};
