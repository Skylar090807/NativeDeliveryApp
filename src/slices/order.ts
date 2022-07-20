// 수정 필요
import { createSlice } from '@reduxjs/toolkit'

// initialState는 모든 컴포넌트들이 자유롭게 공유할 수 있는 global(전역) state이다.
const initialState = {
  name: '',
  email: '',
  accessToken: '',
}

const orderSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email
      state.name = action.payload.name
      state.accessToken = action.payload.accessToken
    },
  },
  // extraReducers: builder => {},
})

export default orderSlice
