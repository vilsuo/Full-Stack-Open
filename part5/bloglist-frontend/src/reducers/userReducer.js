import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import loginService from '../services/login'

const initialState = null
const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload
      blogService.setToken(user.token)
      return user
    },
    removeUser(state, action) {
      blogService.setToken(null)
      window.localStorage.removeItem('loggedBlogAppUser')
      return null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const user = action.payload
        // add user to local storage
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

        // set token so user can post blogs etc.
        blogService.setToken(user.token)
        return user
      })
      .addCase(login.rejected, (state, action) => {
        return state
      })
  },
})

export const { setUser, removeUser } = userReducer.actions

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }
}

export const login = createAsyncThunk(
  'users/login',
  async ({ username, password }, thunkApi) => {
    try {
      const user = await loginService.login({ username, password })
      return user
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.error)
    }
  },
)

export default userReducer.reducer
