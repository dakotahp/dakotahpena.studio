function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length
    })
  )

  cy.task('table', violationData)
}

Cypress.Commands.add('a11yCheck', () => {
  cy.configureAxe({
    rules: [
      // ignore warnings that page has no H1 tag
      {id: 'page-has-heading-one', enabled: false},
    ],
  });

  cy.checkA11y(
    null, // context (DOM selector)
    {
      includedImpacts: ['critical', 'serious', 'moderate', 'minor'],
    }, // options (for axe.run).
    terminalLog, // violationCallback
    false, // skipFailures
  );
});

Cypress.Commands.add('a11yVisit', (destination) => {
  cy.visit(destination);
  cy.injectAxe();
});
