import 'react-native-gesture-handler'
import * as React from 'react'
import { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Settings from './src/pages/Settings'
import Orders from './src/pages/Orders'
import Delivery from './src/pages/Delivery'
import SignIn from './src/pages/SignIn'
import SignUp from './src/pages/SignUp'

/* 
  TypeScript에서 React Navigation을 사용하려면 아래와 같이 Type Check를 해야 한다.
  Page List와 로그인, 회원가입 List는 하나로 묶어도 되지만 두 개로 나눠 놓으면 누릴 수 있는 장점이 있다.
    - Login 했을 떄는 로그인, 회원가입 페이지가 보일 필요 없기 때문에, 두 개로 나눠서 처리한다.
    - 두 개로 나눠놨기 때문에 로그인 화면에서 갑자기 세팅 화면으로 넘어가거나, 회원가입 화면에서 딜리버리 화면으로 넘어가는 사태를 미연에 방지할 수 있다.

  
*/
// Navigation Page List
export type LoggedInParamList = {
  Orders: undefined //주문 목록
  Settings: undefined //세팅 - 정산화면
  Delivery: undefined //주문 목록 수락 시 지도, 배달 시작 화면
  Complete: { orderId: string } // 완료 처리 화면(사진 업로드), order마다 부여된 고유아이디 param으로 넘김
}

// 로그인, 회원가입 화면 List
export type RootStackParamList = {
  SignIn: undefined
  SignUp: undefined
}

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false)
  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          {/* <Tab.Group> 조건문으로 화면 처리할 때 오직 하나의 children이 있어야 한다는 에러가 뜨거나, 특정 스크린 간에 공통 속성이 있을 때 그룹으로 묶어줄 수 있다.*/}
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{ title: '오더 목록' }}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{ title: '내 정보' }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ title: '로그인', headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: '회원가입' }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default App
