describe('Test blog post', () => {
  it('matches expected in day mode', () => {
    cy.visit('/posts/give-short-term-memory-break/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });

  it('matches expected in dark mode', () => {
    cy.selectDarkMode()
    cy.visit('/posts/give-short-term-memory-break/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});
