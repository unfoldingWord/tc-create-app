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
  if (value) {
    const valueString = JSON.stringify(value);
    response = await stateStore.setItem(key, valueString);
  } else {
    response = await stateStore.removeItem(key);
  }
  return response;
};