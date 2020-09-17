
Cypress.Commands.add(
  'deleteIndexDB',
  () =>
    new Cypress.Promise(resolve => {
      var request = indexedDB.deleteDatabase('tc-create-app-state-store');

      request.onerror = function (event) {
        resolve();
      };

      request.onsuccess = function (event) {
        resolve();
      };
    })
);