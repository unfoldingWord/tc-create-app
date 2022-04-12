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
    it('select origQuote', function () {
        /** Select file */
        // cy.contains('κατὰ πίστιν');
        cy.get('[data-testid="View Columns-iconButton"]').click();
        cy.get('[value="OrigQuote"]').click();
        cy.get('[aria-label="Close"]').click();
    });
    it('search for origquote', function () {
        /** Select file */
        cy.wait(3000);
        cy.contains('κατὰ πίστιν').should('have.attr', 'class', 'makeStyles-html-374');;
        // cy.get('[class="MuiTableCell-root-620 MuiTableCell-body-622 makeStyles-cell-619"]')
    });
    // it('search for data-test', function () {
    //     /** Select file */
    //     cy.contains('κατὰ').should('have.attr', 'data-testselected', 'true');
    //     cy.contains('πίστιν').should('have.attr', 'data-testselected', 'true');
    // });
    // it('select origQuote', function () {
    //     /** Select file */
    //     // cy.contains('κατὰ πίστιν');
    //     cy.get('[data-testid="View Columns-iconButton"]').click();
    //     cy.get('[value="OrigQuote"]').click();
    //     cy.get('[aria-label="Close"]').click();
    // });
    // it('search for origquote', function () {
    //     /** Select file */
    //     cy.wait(3000);
    //     cy.contains('κατὰ πίστιν').should('have.attr', 'class', 'makeStyles-html-374');;
    //     // cy.get('[class="MuiTableCell-root-620 MuiTableCell-body-622 makeStyles-cell-619"]')
    // });
    // it('search for data-test', function () {
    //     /** Select file */
    //     cy.contains('κατὰ').should('have.attr', 'data-testselected', 'true');
    //     cy.contains('πίστιν').should('have.attr', 'data-testselected', 'true');
    // });
});
