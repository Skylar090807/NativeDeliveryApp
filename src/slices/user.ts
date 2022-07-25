/*
  Redux
  Slices들이 모여서 reducer가 되고, reducer가 모여서 store가 된다.
  store는 App.tsx에서 가장 상위 부모 Provider에 전달되어, 하위 자식들이 접근할 수 있다.
*/
/*
    Redux 구조
      store -> root reducer(state) -> user slice(사용자 정보 관련), order slice(주문 내역 관련)
      ui slice 를 만들어 ui 관련 정보를 담아 사용할 수도 있다.

    접근 방법
      state.user, state.order
      user slice의 email에 접근: state.user.email
      -  예시) ui.ts 파일을 만든다.
          const initialState = {
            loading: false  
          }

          const uiSlice = createSlice({
            initialState,
            reducers: { ... },
            extraReducers: builder => {},
          })
    Redux의 action이란?
      action : state를 바꾸는 동작/행위. action을 실제 사용할 때 dispatch 함수 안에 써줘야 한다.
      dispatch : action을 실행하는 함수
      reducer : action이 실행되면 state를 바꾸는 로직 (reducer와 action은 짝을 이룬다.)
    
*/
import { createSlice } from '@reduxjs/toolkit'

// initialState는 모든 컴포넌트들이 자유롭게 공유할 수 있는 global(전역) state이다.
// 초기 상태(state)
const initialState = {
  name: '',
  email: '',
  accessToken: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  // reducers에는 동기 action
  reducers: {
    // setUser() 함수의 첫번째 param state는 initialState를 의미한다. 두번째 param action은 실제 setUser action이 쓰이는 곳에서 action을 받아와서 state를 어떻게 바꿀지 결정.
    // setUser처럼 data가 여러 개인 경우엔 객체로 보내고 setName 처럼 data가 하나인 경우엔 객체로 묶을 필요 없이 name을 바로 던져주면 된다.
    setUser(state, action) {
      state.email = action.payload.email
      state.name = action.payload.name
      state.accessToken = action.payload.accessToken
    },
    // 만약 accessToken 관련 state만 바꾸고 싶다면 setAccessToken(){}으로 아래와 같이 작성할 수 있다.
    setAccessToken(state, action) {
      state.accessToken = action.payload
    },
  },
  // extraReducers에는 비동기 action
  extraReducers: builder => {},
})

export default userSlice
