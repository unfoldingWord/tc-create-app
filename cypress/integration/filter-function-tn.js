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
    it('select filter', function () {
        /** Select file */
        cy.get('[data-testid="Filter Table-iconButton"]').click();
    });
    it('select chapter', function () {
        //     /** Select file */
        cy.get('[aria-labelledby="mui-component-select-Chapter"]').click();
        cy.get('[data-value="front"]').click();
        cy.get('[aria-label="Close"]').click();
    });
    it('search for muichip chapter', function () {
        //     /** Select file */
        // cy.get('[class= "MuiChip-root-936 MUIDataTableFilterList-chip-590 MuiChip-deletable-943"]');
        cy.wait(2000);
        cy.contains('Chapter - front').should('be.be.visible');
        cy.wait(2000);
    });
});
