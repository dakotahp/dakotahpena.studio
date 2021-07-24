describe('Test essays post', () => {
  it('matches expected in day mode', () => {
    cy.visit('/essays/everyday-carry/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/essays/everyday-carry/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});
