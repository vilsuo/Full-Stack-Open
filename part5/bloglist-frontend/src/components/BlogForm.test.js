import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('', () => {
  let container

  const addBlog = jest.fn()

  beforeEach(() => {
    container = render(
      <BlogForm
        addBlog={addBlog}
      />
    )
  })

  test('', () => {

  })
})