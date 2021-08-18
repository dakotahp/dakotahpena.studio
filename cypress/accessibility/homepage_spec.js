describe('Homepage accessibility', () => {
  it('loads successfully', () => {
    cy.a11yVisit('/');
  });

  it('has no accessibility violations', () => {
    cy.a11yCheck();
  });
});
