import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('filling all inputs with valid data', () => {
  let user
  const addBlog = jest.fn(x => true)

  beforeEach(() => {
    user = userEvent.setup()

    render(
      <BlogForm
        addBlog={addBlog}
      />
    )
  })

  test('form submits input values to blog adding handler', async () => {
    // select inputs...
    const titleInput = screen.getByPlaceholderText('give title')
    const authorInput = screen.getByPlaceholderText('give author')
    const urlInput = screen.getByPlaceholderText('give url')

    // and insert values..
    await user.type(titleInput, 'Awesome blog')
    await user.type(authorInput, 'Me')
    await user.type(urlInput, 'read-it-here')

    // click submit
    const submitButton = screen.getByText('create')
    await user.click(submitButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0]).toEqual({
      title: 'Awesome blog',
      author: 'Me',
      url: 'read-it-here'
    })
  })
})