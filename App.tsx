import 'react-native-gesture-handler'
import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-redux'
import store from './src/store'
import AppInner from './AppInner'

function App() {
  /* 
    Redux useSelector
    Redux useSelector는 항상 Provider 안에서만 쓸 수 있다. 
    바깥에 useSelector를 선언해서 쓰고 싶다면 자식 컴포넌트들을 하나의 컴포넌트로 분리한 후 Provider 안쪽에서 분리한 컴포넌트를 불러준다.
  */
  // useSelector를 Provider 바깥에서 사용하면 error 발생.
  // const isLoggedIn = useSelector((state: RootState) => !!state.user.email)

  return (
    // Redux를 사용하기 위해 구현해둔 Prop들을 <Provider></Provider>로 감싼다.
    <Provider store={store}>
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </Provider>
  )
}

export default App
