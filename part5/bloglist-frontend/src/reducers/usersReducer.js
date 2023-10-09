import { createSlice } from '@reduxjs/toolkit'
import usersService from '../services/users'

const initialState = []
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    addUserBlog(state, action) {
      const blog = action.payload
      return state.map((user) => {
        return user.id !== blog.user.id ? user : appendUserBlog(user, blog)
      })
    },
    updateUserBlog(state, action) {
      const blog = action.payload
      return state.map((user) => {
        return user.id !== blog.user.id ? user : replaceUserBlog(user, blog)
      })
    },
    removeUserBlog(state, action) {
      const id = action.payload
      return state.map((user) => filterUserBlog(user, id))
    },
  },
})

const appendUserBlog = (user, newValues) => {
  return { ...user, blogs: user.blogs.concat(newValues) }
}

const replaceUserBlog = (user, newValues) => {
  return {
    ...user,
    blogs: user.blogs.map((blog) =>
      blog.id !== newValues.id ? blog : newValues,
    ),
  }
}

const filterUserBlog = (user, id) => {
  return { ...user, blogs: user.blogs.filter((blog) => blog.id !== id) }
}

export const { setUsers, addUserBlog, updateUserBlog, removeUserBlog } =
  usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll()
    dispatch(setUsers(users))
  }
}

export default usersSlice.reducer
