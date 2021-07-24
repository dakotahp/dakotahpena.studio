describe('Test homepage', () => {
  it('toMatchImageSnapshot - HTML', () => {
    cy.visit('/')
      .then(() => {
        cy.get('body').toMatchImageSnapshot();
      });
  });
});