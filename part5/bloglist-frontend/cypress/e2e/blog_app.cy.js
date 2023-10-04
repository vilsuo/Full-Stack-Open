describe('Blog app', function() {
  beforeEach(function() {
    // reset all documents in the test database
    cy.request('POST',  `${Cypress.env('BACKEND')}/testing/reset`)

    // create users
    const user1 = {
      name: 'Ville S',
      username: 'viltsu',
      password: 'salainen'
    }

    const user2 = {
      name: 'Matti L',
      username: 'matska',
      password: 'qwerty123'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)

    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Login to the application')

    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
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

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'viltsu', password: 'salainen' })
    })

    it('a blog can be created', function() {
      cy.contains('create new blog').click()
      cy.get('#create-blog-title-input').type('E2E testing with Cypress')
      cy.get('#create-blog-author-input').type('fullstack')
      cy.get('#create-blog-url-input').type('fullstackopen')

      cy.get('#create-blog-button').click()

      cy.contains('E2E testing with Cypress')
    })

    it('user can logout', function() {
      cy.contains('logout').click()
      cy.contains('Login to the application')
    })

    describe('When a blog has been created', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'E2E testing with Cypress',
          author: 'fullstack',
          url: 'fullstackopen'
        })
      })

      it('blog details can be viewed', function() {
        cy.contains('E2E testing with Cypress fullstack').parent()
          .find('button')
          .should('contain', 'view')
          .click()
          .should('contain', 'hide')
      })

      it('creator of the blog can liked the blog', function() {
        cy.contains('E2E testing with Cypress fullstack')
          .parent().as('blog')
          .find('button').click()

        cy.get('@blog').contains('likes 0')

        cy.get('@blog')
          .get('#like-blog-button').click()

        cy.get('@blog').contains('likes 1')
      })

      it('creator of the blog can remove the blog', function() {
        cy.contains('E2E testing with Cypress fullstack')
          .parent().as('blog')
          .find('button').click()

        cy.get('@blog')
          .get('#remove-blog-button').click()

        cy.contains('E2E testing with Cypress fullstack')
          .should('not.exist')
      })
    })
  })
})