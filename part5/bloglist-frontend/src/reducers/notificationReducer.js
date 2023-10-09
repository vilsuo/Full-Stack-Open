import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createSuccessNotification(state, action) {
      return { message: action.payload, type: 'success' }
    },
    createErrorNotification(state, action) {
      return { message: action.payload, type: 'error' }
    },
    resetNotification(state, action) {
      return null
    },
  },
})

export const { createSuccessNotification, createErrorNotification, resetNotification } =
  notificationSlice.actions

export const showSuccessNotification = (message) => {
  return (dispatch) => {
    dispatch(createSuccessNotification(message))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }
}

export const showErrorNotification = (message) => {
  return (dispatch) => {
    dispatch(createErrorNotification(message))
    setTimeout(() => {
      dispatch(resetNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer
