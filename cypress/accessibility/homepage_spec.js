describe('Homepage accessibility', () => {
  it('Light mode has no accessibility violations', () => {
    cy.visitInLightMode('/');
    cy.a11yCheck();
  });

  it('Dark mode has no accessibility violations', () => {
    cy.visitInDarkMode('/');
    cy.a11yCheck();
  });
});
