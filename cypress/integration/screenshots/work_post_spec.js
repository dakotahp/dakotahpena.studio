describe('Work post page', () => {
  it('matches expected in day mode', () => {
    cy.visit('/work/human-fund-card/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/work/human-fund-card/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});
