import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    resetNotification(state, action) {
      return null
    },
  },
})

export const { createNotification, resetNotification } =
  notificationSlice.actions

export const showNotification = (message) => {
  return (dispatch) => {
    dispatch(createNotification(message))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer
