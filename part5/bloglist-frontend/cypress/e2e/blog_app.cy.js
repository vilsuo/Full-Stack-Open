describe('Blog app', function() {
  beforeEach(function() {
    // reset all documents in the test database
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    // create user
    const user = {
      name: 'Ville S',
      username: 'viltsu',
      password: 'salainen'
    }

    cy.request('POST', 'http://localhost:3001/api/users', user)

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Login to the application')

    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#login-username-input').type('viltsu')
      cy.get('#login-password-input').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Ville S logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#login-username-input').type('viltsu')
      cy.get('#login-password-input').type('vääräsalasana')
      cy.get('#login-button').click()

      cy.get('.notification').contains('invalid username or password')
    })
  })
})