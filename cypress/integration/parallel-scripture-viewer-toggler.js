describe('Parallel scripture viewer toggle', function () {
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
    it('Select Organization', function () {   //sometime select organisation is failing because click on login button is taking too long so unfoldingWord is not getting found
        /** Select organization */
        cy.wait(1000);
        cy.contains('unfoldingWord').click();
    });
    it('Select Resource', function () {
        /** Select resource */
        cy.wait(1000);
        cy.contains('Translation Notes').click();
    });
    it('Select Language', function () {      //some time select language fails because No languages found shows up momentarily 
        /** Select language */
        cy.get('.language-select-dropdown').click();
        cy.focused().type('english{enter}');
    });
    it('Select en_tn File', function () {
        /** Select file */
        cy.contains('en_tn_57-TIT.tsv').should('be.be.visible').click();
        cy.contains('Introduction to Titus');
    });
    it('Select hamburger', function () {
        /** Select language */
        cy.get('[data-test="drawer-menu-button"]').click();
    });
    it('Select view toggle', function () {
        cy.get('[aria-label="secondary checkbox"]').click();
    });
    it('Select menu close button', function () {
        cy.get('[data-test="drawer-menu-close-button"]').click();
    });
    it('Select pagination next', function () {
        cy.get('[data-testid="pagination-next"]').click();
    });
    it('Select Expand Scripture Pane', function () {
        cy.get('[aria-label="Expand Scripture Pane"]').click({ multiple: true, timeout: 19000 });
    });
});