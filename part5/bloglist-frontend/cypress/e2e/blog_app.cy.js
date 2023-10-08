describe('Blog app', function () {
  beforeEach(function () {
    // reset all documents in the test database
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    // create users
    const user1 = {
      name: 'Ville S',
      username: 'viltsu',
      password: 'salainen',
    }

    const user2 = {
      name: 'Matti L',
      username: 'matska',
      password: 'qwerty123',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user1)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)

    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Login to the application')

    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#login-username-input').type('viltsu')
      cy.get('#login-password-input').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Ville S logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#login-username-input').type('viltsu')
      cy.get('#login-password-input').type('vääräsalasana')
      cy.get('#login-button').click()

      cy.get('.notification').contains('invalid username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'viltsu', password: 'salainen' })
    })

    it('a blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#create-blog-title-input').type('E2E testing with Cypress')
      cy.get('#create-blog-author-input').type('fullstack')
      cy.get('#create-blog-url-input').type('fullstackopen')

      cy.get('#create-blog-button').click()

      cy.contains('E2E testing with Cypress')
    })

    it('user can logout', function () {
      cy.logout()
      cy.contains('Login to the application')
    })

    describe('When blogs have been created', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Introduction to Cypress',
          author: 'cypress',
          url: 'https://docs.cypress.io/guides/core-concepts/introduction-to-cypress#Cypress-Can-Be-Simple-Sometimes',
        })

        cy.createBlog({
          title: 'E2E testing with Cypress',
          author: 'fullstack',
          url: 'https://fullstackopen.com/en/part5/end_to_end_testing',
        })

        cy.createBlog({
          title: 'Writing and Organizing Tests',
          author: 'cypress',
          url: 'https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests',
        })
      })

      it('blog details can be toggled', function () {
        cy.getBlogByTitle('E2E testing with Cypress')
          .find('#blog-view-button')
          .as('view-button')

        cy.get('@view-button').should('contain', 'view').click()

        cy.get('@view-button').should('contain', 'hide').click()

        cy.get('@view-button').should('contain', 'view')
      })

      it('creator of the blog can remove the blog', function () {
        cy.removeBlogByTitle('E2E testing with Cypress')

        cy.contains('E2E testing with Cypress fullstack').should('not.exist')
      })

      it('creator of the blog can like the blog', function () {
        cy.viewBlogByTitle('E2E testing with Cypress').as('blog')

        cy.get('@blog').contains('likes 0')

        cy.get('@blog').get('#like-blog-button').click()

        cy.get('@blog').contains('likes 1')
      })

      describe('when liked', function () {
        it('the blogs are sorted based on their likes', function () {
          cy.checkBlogOrder([
            'Introduction to Cypress',
            'E2E testing with Cypress',
            'Writing and Organizing Tests',
          ])

          cy.likeBlogByTitle('E2E testing with Cypress')
          cy.checkBlogOrder([
            'E2E testing with Cypress',
            'Introduction to Cypress',
            'Writing and Organizing Tests',
          ])

          cy.likeBlogByTitle('Introduction to Cypress')
          cy.checkBlogOrder([
            'E2E testing with Cypress',
            'Introduction to Cypress',
            'Writing and Organizing Tests',
          ])

          cy.likeBlogByTitle('Introduction to Cypress')
          cy.checkBlogOrder([
            'Introduction to Cypress',
            'E2E testing with Cypress',
            'Writing and Organizing Tests',
          ])
        })
      })

      describe('when other user logs in', function () {
        beforeEach(function () {
          cy.logout()
          cy.login({ username: 'matska', password: 'qwerty123' })
        })

        it('can not see the remove button of blogs by other users', function () {
          cy.viewBlogByTitle('E2E testing with Cypress fullstack')
            .find('#remove-blog-button')
            .should('not.exist')
        })
      })
    })
  })
})
