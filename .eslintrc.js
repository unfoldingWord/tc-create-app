module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "@unfoldingword"
  ],
  "plugins": [
    "react",
    "cypress",
    "chai-friendly"
  ],
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "cypress/globals": true
  }
}