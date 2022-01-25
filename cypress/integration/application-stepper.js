/// <reference types="cypress" />

describe('Application Stepper', function () {
  before(() => {
    cy.visit('/');
  });
  it('Select Login', function () {
    /** Login */
    cy.get('[data-test=submit-button]').should('have.text', 'Login');
    cy.get('[data-test=username-input] input').type(Cypress.env('TEST_USERNAME'));
    cy.get('[data-test=password-input] input').type(Cypress.env('TEST_PASSWORD'));
    cy.get('[data-test=submit-button]').click();
  });
  it('Select Organization', function () {
    /** Select organization */
    cy.wait(1000);
    cy.contains('unfoldingWord').click();
  });
  it('Select Resource', function () {
    /** Select resource */
    cy.wait(1000);
    cy.contains('Translation Academy').click();
  });
  it('Select Language', function () {
    /** Select language */
    cy.get('.language-select-dropdown').click();
    cy.focused().type('english{enter}');
  });
  it('Select File', function () {
    /** Select file */
    cy.contains('checking/').should('be.be.visible').click();
    cy.contains('acceptable/').should('be.be.visible').click();
    cy.contains('01.md').should('be.be.visible').click();
  });
  it('Look for String in .MD file', function () {
    /** Testing file selection*/
    cy.contains('Translation in an Acceptable Style', { timeout: 10000 });
  });
});