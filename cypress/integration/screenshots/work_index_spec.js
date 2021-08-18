describe('Work index page', () => {
  it('matches expected in day mode', () => {
    cy.visit('/work/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/work/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});
