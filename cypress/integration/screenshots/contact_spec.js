describe('Test contact page', () => {
  it('matches expected in day mode', () => {
    cy.visit('/contact/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/contact/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});
