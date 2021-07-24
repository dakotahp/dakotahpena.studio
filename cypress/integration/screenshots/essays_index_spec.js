describe('Test essays index', () => {
  it('matches expected in day mode', () => {
    cy.visit('/essays/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/essays/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});
