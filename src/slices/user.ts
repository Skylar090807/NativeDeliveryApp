/*
  Redux
  Slices들이 모여서 reducer가 되고, reducer가 모여서 store가 된다.
  store는 App.tsx에서 가장 상위 부모 Provider에 전달되어, 하위 자식들이 접근할 수 있다.
*/
import { createSlice } from '@reduxjs/toolkit'

// initialState는 모든 컴포넌트들이 자유롭게 공유할 수 있는 global(전역) state이다.
const initialState = {
  name: '',
  email: '',
  accessToken: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email
      state.name = action.payload.name
      state.accessToken = action.payload.accessToken
    },
  },
  extraReducers: builder => {},
})

export default userSlice
