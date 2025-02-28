/* eslint-disable no-undef */

context('BaseView1', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('renders the welcome message', () => {
    cy.contains('Welcome to the App!').should('exist')
  })
})
