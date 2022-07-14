describe('Preview', function () {
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
  it('Edit Save', function () {
    /**Edit save process */
    cy.wait(5000);
    cy.get('[data-test=id_header-front-intro-m2jl_SupportReference_content]').type('Hello');
    cy.wait(1000);
    cy.get('[data-testid=Search-iconButton]').click();
    cy.get('[aria-label="Save"]').click();
    cy.log('');
    cy.wait(1000);
  });
});