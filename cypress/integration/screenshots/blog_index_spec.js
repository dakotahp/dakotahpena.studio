describe('Test blog index', () => {
  it('matches expected in day mode', () => {
    cy.visit('/posts/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot({screenshotConfig: {capture: 'fullPage'}});
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/posts/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot({screenshotConfig: {capture: 'fullPage'}});
      });
  });
});
