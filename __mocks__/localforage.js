const storage = {};

function getItem(key) {
  return new Promise(resolve => {
    resolve(storage[key]);
  });
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
  };
}

module.exports = { createInstance };