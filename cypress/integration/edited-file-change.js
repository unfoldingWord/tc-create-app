// /// <reference types="cypress" />

// describe('MenuButton', function () {
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
//     cy.wait(4000);
//     cy.contains('en_tn_57-TIT.tsv').should('be.be.visible').click();
//     cy.contains('Introduction to Titus');
//     cy.wait(4000);
//     cy.get('[data-test="id_header-front-intro-m2jl_SupportReference"]').type('Hello');
//     cy.get('[aria-label="Save"]').click();
//     cy.wait(2000);
//     // #MUIDataTableBodyRow - 0 > td: nth - child(2) > div > div > div > div.makeStyles - translation - 253 > div: nth - child(1) > div.MuiGrid - root - 269.MuiGrid - item - 271.MuiGrid - grid - xs - 6 - 309 > div > div > p
//     // cy.get('/html/body/div/div/div[2]/div/div[2]/div/div[3]/table/tbody/tr[1]/td[5]/div/div/div/div[2]/div[1]/div[2]/div/div/p');
//     // cy.get('#MUIDataTableBodyRow-0 > td:nth-child(2) > div > div > div > div.makeStyles-translation-254 > div:nth-child(1) > div.MuiGrid-root-266.MuiGrid-item-268.MuiGrid-grid-xs-6-306 > div > div > p').type('Hello');
//   });
//   // it('MenuButton', function () {
//   //   cy.get('[data-test="drawer-menu-button"]').click();
//   //   cy.contains('en_tn_09-1SA.tsv').click();
//   //   //   cy.wait(1000);
//   // });
//   // it('select ok in dialog box', function () {
//   //   cy.get('[data-test-id="ASDE4JeHBc7Sk4G-tyEP7"]').click();
//   //   // cy.wait(1000);
//   // });
//   // it('Select back button', function () {
//   //   cy.get('[data-test="drawer-menu-close-button"]').click();
//   //   cy.wait(2000);
//   //   cy.contains('Introduction to 1 Samuel');
//   // });
// });
