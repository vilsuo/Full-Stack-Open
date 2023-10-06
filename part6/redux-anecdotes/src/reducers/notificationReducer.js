import { createSlice } from "@reduxjs/toolkit";

const initialState = ''
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    createNotification(state, action) {
      return action.payload
    },
    removeNotification(state) {
      return ''
    }
  }
})

export const { createNotification, removeNotification } = notificationSlice.actions

export default notificationSlice.reducer