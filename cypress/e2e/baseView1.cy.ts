// https://on.cypress.io/api

describe('baseView1', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the welcome message', () => {
    cy.contains('Welcome to the App!').should('exist')
  })
})
