import { combineReducers } from 'redux'
import orderSlice from '../slices/order'

import userSlice from '../slices/user'

const rootReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
})

// Redux reducer typing
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
