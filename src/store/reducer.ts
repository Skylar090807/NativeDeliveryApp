import { combineReducers } from 'redux'

import userSlice from '../slices/user'

const rootReducer = combineReducers({
  user: userSlice.reducer,
})

// Redux reducer typing
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
