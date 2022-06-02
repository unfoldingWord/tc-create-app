// /// <reference types="cypress" />

// describe('Preview', function () {
//   before(() => {
//     cy.visit('/');
//   });
//   it('Select Login', function () {
//     /** Login */
//     cy.get('[data-test=submit-button]').should('have.text', 'Login');
//     cy.get('[data-test=username-input] input').type(Cypress.env('TEST_USERNAME'));
//     cy.get('[data-test=password-input] input').type(Cypress.env('TEST_PASSWORD'));
//     cy.get('[data-test=submit-button]').click();
//   });
//   it('Select Organization', function () {
//     /** Select organization */
//     cy.wait(1000);
//     cy.contains('unfoldingWord').click();
//   });
//   it('Select Resource', function () {
//     /** Select resource */
//     cy.wait(1000);
//     cy.contains('Translation Notes').click();
//   });
//   it('Select Language', function () {
//     /** Select language */
//     cy.get('.language-select-dropdown').click();
//     cy.focused().type('english{enter}');
//   });
//   it('Select File', function () {
//     /** Select file */
//     cy.contains('en_tn_57-TIT.tsv').should('be.be.visible').click();
//   });
//   it('preview', function () {
//     /**logout process */
//     // cy.get('#translatableComponent > div > div.MuiToolbar-root-110.MuiToolbar-regular-112.MUIDataTableToolbar-root-95.MuiToolbar-gutters-111 > div.MUIDataTableToolbar-actions-99 > button:nth-child(5)').click();
//     // cy.contains('# Introduction to Titus');
//     // cy.get('#MUIDataTableBodyRow-0 > td:nth-child(2) > div > div > div > div.makeStyles-translation-254 > div:nth-child(1) > div.MuiGrid-root-266.MuiGrid-item-268.MuiGrid-grid-xs-6-306 > div > pre > code').type('Hello');
//     // cy.get('#translatableComponent > div > div.MuiToolbar-root-110.MuiToolbar-regular-112.MUIDataTableToolbar-root-95.MuiToolbar-gutters-111 > div.MUIDataTableToolbar-actions-99 > div > button').click();
//     cy.get('#MUIDataTableBodyRow-0 > td:nth-child(2) > div > div > div > div.makeStyles-translation-254 > div:nth-child(1) > div.MuiGrid-root-266.MuiGrid-item-268.MuiGrid-grid-xs-6-306 > div > div > p').type('Hello');
//     cy.wait(1000);
//     // cy.get('#translatableComponent > div > div.MuiToolbar-root-110.MuiToolbar-regular-112.MUIDataTableToolbar-root-95.MuiToolbar-gutters-111 > div.MUIDataTableToolbar-actions-99 > div > button').click();
//     cy.get('[aria-label="Save"]').click();
//     // cy.get('#translatableComponent > div > div.MuiToolbar-root-110.MuiToolbar-regular-112.MUIDataTableToolbar-root-95.MuiToolbar-gutters-111 > div.MUIDataTableToolbar-actions-99 > div > button > span.MuiIconButton-label-162 > svg').click();
//     cy.wait(1000);
//   });
// });