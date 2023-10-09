import { createAsyncThunk, createSlice, isRejectedWithValue  } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'

const rejectionReducer = (state, action) => {
  return state
}

const initialState = []

// remove reducers or make extraReducers as reducres?
// implement common rejected handler?
const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action) {
      const blogs = action.payload
      return blogs
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.fulfilled, (state, action) => {
        return state.concat(action.payload)
      })
      //.addCase(createBlog.rejected, (state, action) => {
      //  return state
      //})
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload
        return state.filter((blog) => blog.id !== id)
      })
      //.addCase(deleteBlog.rejected, (state, action) => {
      //  return state
      //})
      .addCase(updateBlog.fulfilled, (state, action) => {
        const result = action.payload
        return state.map((blog) => (blog.id !== result.id ? blog : result))
      })
      //.addCase(updateBlog.rejected, (state, action) => {
      //  return state
      //})
      .addCase(createComment.fulfilled, (state, action) => {
        const result = action.payload
        return state.map((blog) => (blog.id !== result.id ? blog : result))
      })
      //.addCase(createComment.rejected, (state, action) => {
      //  return state
      //})
      .addMatcher(
        isRejectedWithValue(createBlog, deleteBlog, updateBlog, createComment),
        rejectionReducer
      )
  },
})

export const { setBlogs } = blogsSlice.actions

// todo error handler?
export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogsService.getAll()
      dispatch(setBlogs(blogs))
    } catch (exception) {}
  }
}

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
  },
)

export const deleteBlog = createAsyncThunk(
  'blogs/deleteBlog',
  async (id, thunkApi) => {
    try {
      await blogsService.remove(id)
      return id
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.error)
    }
  },
)

export const updateBlog = createAsyncThunk(
  'blogs/updateBlog',
  async ({ id, newValues }, thunkApi) => {
    try {
      const updatedBlog = await blogsService.update(id, newValues)
      return updatedBlog
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.error)
    }
  },
)

export const createComment = createAsyncThunk(
  'blogs/createComment',
  async ({ id, comment }, thunkApi) => {
    try {
      const updatedBlog = await blogsService.createComment(id, comment)
      return updatedBlog
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.error)
    }
  }
)

export default blogsSlice.reducer
