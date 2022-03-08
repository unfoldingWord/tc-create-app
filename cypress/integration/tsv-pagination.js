/// <reference types="cypress" />

describe('pagination', function () {
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
    cy.contains('Translation Notes').click();
  });
  it('Select Language', function () {
    /** Select language */
    cy.get('.language-select-dropdown').click();
    cy.focused().type('english{enter}');
  });
  it('Select File', function () {
    /** Select file */
    cy.contains('en_tn_57-TIT.tsv').should('be.be.visible').click();
  });
  it('pagination', function () {
    /**select pagination */
    cy.get('[data-testid=pagination-rows]').click();
    cy.contains('50').should('be.be.visible').click();
  });
  it('pagination next', function () {
    /**select next button */
    cy.get('[data-testid="pagination-next"]').click();
    cy.get('[data-testid="pagination-next"]').click();
    cy.contains('As for those believers who are slaves,');
  });
});