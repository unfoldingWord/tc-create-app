const storage = {};

function getItem(key) {
  return new Promise(resolve => {
    resolve(storage[key]);
  });
}

function removeItem(key) {
  return setItem(key, null);
}

function setItem(key, data) {
  return new Promise(resolve => {
    storage[key] = data;
    resolve();
  });
}

function createInstance() {
  return {
    getItem,
    setItem,
    removeItem,
  };
}

module.exports = { createInstance };