describe('Test homepage', () => {
  it('matches expected in day mode', () => {
    cy.visit('/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});
