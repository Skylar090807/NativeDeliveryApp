import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import rootReducer from './reducer'

const store = configureStore({
  reducer: rootReducer,
  /*
    flipper를 연동을 위해 middleware에 정의
  */
  // middleware: getDefaultMiddleware => {
  //   if (__DEV__) {
  //     const createDebugger = require('redux-flipper').default
  //     return getDefaultMiddleware().concat(createDebugger())
  //   }
  //   return getDefaultMiddleware()
  // },
})
export default store

// Redux store typing
// TypeScript 때문에 기존 함수를 새로운 함수로 wrapping 했다.
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
