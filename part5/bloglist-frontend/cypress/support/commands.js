// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${Cypress.env('BACKEND')}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedBlogAppUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: `${Cypress.env('BACKEND')}/blogs`,
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedBlogAppUser')).token}`
    }
  })

  cy.visit('')
})

Cypress.Commands.add('logout', () => {
  cy.get('#logout-button').contains('logout').click()
})

// TODO implement all with bypassing the UI

Cypress.Commands.add('checkBlogOrder', titles => {
  titles.forEach((title, index) => {
    cy.get('.blog').eq(index).should('contain', title)
  })
})

Cypress.Commands.add('getBlogByTitle', title => {
  cy.contains(title)
    .then(element => {
      return element.parent()
    })
})

Cypress.Commands.add('viewBlogByTitle', title => {
  cy.getBlogByTitle(title)
    .as('blog')
    .find('#blog-view-button')
    // open details if not already open
    .then(($button) => {
      if ($button.text() === 'view') {
        cy.wrap($button).click()
      }
    })

  cy.get('@blog')
    .then(element => {
      return element
    })
})

// todo wait for blog to be removed?
Cypress.Commands.add('removeBlogByTitle', title => {
  cy.viewBlogByTitle(title)
    .as('blog')
    .find('#remove-blog-button')
    .click()
})

Cypress.Commands.add('likeBlogByTitle', title => {
  cy.viewBlogByTitle(title)
    .as('blog')
    .find('#blog-likes')
    .then(function($value) {
      const likesBefore = $value.text()

      cy.get('@blog')
        .find('#like-blog-button')
        .click()

      cy.get('@blog')
        .find('#blog-likes')
        .should('not.to.have.text', likesBefore)
    })
})
