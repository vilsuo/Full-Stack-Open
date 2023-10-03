import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('', () => {
  let container

  const updateBlog = jest.fn()

  const blog = {
    title: 'My blog',
    author: 'me',
    url: 'findithere',
    likes: 0,
    user: {
      name: 'ville',
      username: 'viltsu',
      id: '123'
    },
    id: '456'
  }

  beforeEach(() => {
    container = render(
      <Blog
        updateBlog={updateBlog}
        blog={blog}
      />
    ).container
  })

  test('default renders title and url, but not likes', () => {
    const titleAndAuthorElement = screen.getByText(
      `${blog.title} ${blog.author}`
    )
    expect(titleAndAuthorElement).toBeDefined()

    const likesElement = screen.queryByText(`likes ${blog.likes}`)
    expect(likesElement).toBeNull()
  })

  test('url and likes are shown after opening details', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likesElement = screen.getByText(`likes ${blog.likes}`)
    expect(likesElement).toBeDefined()
  })

  test('when liked like twice, liking is handled twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})