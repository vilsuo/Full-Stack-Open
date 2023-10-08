import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import { showNotification } from './notificationReducer'

const initialState = []

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      const blogs = action.payload
      return blogs
    },
    appendBlog(state, action) {
      const blog = action.payload
      return state.concat(blog)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.fulfilled, (state, action) => {
        //console.log('added', action.payload)
        return state.concat(action.payload)
      })
      .addCase(createBlog.rejected, (state, action) => {
        //console.log('rejected', action)
        return state
      })
  }
})

export const createBlog = createAsyncThunk(
  // A string that will be used to generate additional Redux action type
  // constants, representing the lifecycle of an async request
  'blogs/createBlog',
  // A callback function that should return a promise containing the
  // result of some asynchronous logic
  async (blog, thunkApi) => {
    try {
      const createdBlog = await blogsService.create(blog)
      return createdBlog
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.error)
    }
  }
)

/*
export const createBlog = (blog) => {
  return async dispatch => {
    try {
      const createdBlog = await blogsService.create(blog)
      dispatch(appendBlog(createdBlog))
    } catch (error) {
      dispatch(showNotification(error.response.data.error))
    }
  }
}
*/

export const {
  setBlogs, appendBlog, removeBlog
} = blogsSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    try {
      const blogs = await blogsService.getAll()
      dispatch(setBlogs(blogs))
    } catch (exception) {
      
    }
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    try {
      await blogsService.remove(id)
      dispatch(removeBlog(id))
    } catch (exception) {

    }
  }
}

export default blogsSlice.reducer