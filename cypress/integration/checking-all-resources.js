describe('checking all resources are loaded with content', function () {
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
  it('Select en_tn File', function () {
    /** Select file */
    cy.contains('en_tn_57-TIT.tsv').should('be.be.visible').click();
    cy.contains('Introduction to Titus');
    cy.get('[id="deleteIcon_en_tn"]').click();
  });
  it('Select en_ta File', function () {
    cy.contains('Translation Academy').should('be.be.visible').click();
    cy.contains('translate/').should('be.be.visible').click();
    cy.contains('biblicalimageryta/').should('be.be.visible').click();
    cy.contains('01.md').should('be.be.visible').click();
    cy.contains('The term “biblical imagery”');
    cy.get('[id="deleteIcon_en_ta"]').click();
  });
  it('Select en_tw File', function () {
    /** Select file */
    cy.contains('Translation Words').should('be.be.visible').click();
    cy.contains('bible/').click();
    cy.contains('kt/').click();
    cy.contains('abomination.md').should('be.be.visible').click();
    cy.contains('abomination, abominable');
    cy.get('[id="deleteIcon_en_tw"]').click();
  });
  it('Select en_twl File', function () {
    /** Select file */
    cy.contains('Links from the original language words to Translation Words articles.').should('be.be.visible').click();
    cy.contains('twl_TIT.tsv').should('be.be.visible').click();
    cy.contains('I, Paul, write this letter to you, Titus.');
    cy.get('[id="deleteIcon_en_twl"]').click();
  });
  it('Select en_tq File', function () {
    /** Select file */
    cy.contains('Translation Questions').should('be.be.visible').click();
    cy.contains('tq_TIT.tsv').click();
    cy.contains('I, Paul, write this letter to you, Titus.');
    cy.get('[id="deleteIcon_en_tq"]').click();
  });
  it('Select en_sq File', function () {
    /** Select file */
    cy.contains('Study Questions in TSV files for Bible books').click();
    cy.contains('sq_TIT.tsv').should('be.be.visible').click();
    cy.contains('Titus Study Questions');
    cy.get('[id="deleteIcon_en_sq"]').click();
  });
  it('Select en_sn File', function () {
    /** Select file */
    cy.contains('Study Notes in TSV files for Bible books').click();
    cy.contains('sn_TIT.tsv').should('be.be.visible').click();
    cy.contains('Introduction to Titus');
    cy.get('[id="deleteIcon_en_sn"]').click();
  });
  it('Select en_obs File', function () {
    /** Select file */
    cy.get('#Workspace-Container > div.MuiPaper-root.MuiPaper-elevation1.MuiPaper-rounded > div > div:nth-child(2) > div > ul > div:nth-child(8) > div.MuiButtonBase-root.MuiListItem-root.MuiListItem-gutters.MuiListItem-button.MuiListItem-alignItemsFlexStart.MuiListItem-secondaryAction > div.MuiListItemText-root.MuiListItemText-multiline > span').click();
    cy.contains('content/').click();
    cy.contains('01.md').click();
    cy.contains('1. The Creation');
    cy.get('[id="deleteIcon_en_obs"]').click();
  });

  it('Select en_obs-tq File', function () {
    /** Select file */
    cy.contains('Open Bible Stories Translation Questions').click();
    cy.contains('tq_OBS.tsv').click();
    cy.contains('Where did everything in the universe come from?');
    cy.get('[id="deleteIcon_en_obs-tq"]').click();
  });
  it('Select en_obs-tn File', function () {
    /** Select file */
    cy.contains('Open Bible Stories Translation Notes').click();
    cy.contains('content/').click();
    cy.contains('01/').click();
    cy.contains('00.md').click();
    cy.contains('The Creation');
    cy.get('[id="deleteIcon_en_obs-tn"]').click();
  });
  it('Select en_obs-sn File', function () {
    /** Select file */
    cy.contains('Open Bible Stories Study Notes').click();
    cy.contains('sn_OBS.tsv').click();
    cy.contains('The term God refers to the eternal');
    cy.get('[id="deleteIcon_en_obs-sn"]').click();
  });
  it('Select en_obs-sq File', function () {
    /** Select file */
    cy.contains('Open Bible Stories Study Questions').click();
    cy.contains('sq_OBS.tsv').click();
    cy.contains('A Guide to Using the Stories in the OBS');
    cy.get('[id="deleteIcon_en_obs-sq"]').click();
  });
});