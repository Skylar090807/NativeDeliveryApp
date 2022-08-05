import 'react-native-gesture-handler'
import * as React from 'react'
import { useEffect } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Settings from './src/pages/Settings'
import Orders from './src/pages/Orders'
import Delivery from './src/pages/Delivery'
import SignIn from './src/pages/SignIn'
import SignUp from './src/pages/SignUp'

import { RootState } from './src/store/reducer'
import { useSelector } from 'react-redux'
import useSocket from './src/hook/useSocket'
import EncryptedStorage from 'react-native-encrypted-storage'
import axios, { AxiosError } from 'axios'
import { useAppDispatch } from './src/store'
import userSlice from './src/slices/user'
import { Alert } from 'react-native'
import orderSlice from './src/slices/order'
import usePermissions from './src/hook/usePermissions'

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

function AppInner() {
  const dispatch = useAppDispatch()
  /* 
    Redux useSelector
    Redux useSelector는 항상 Provider 안에서만 쓸 수 있다. 
    바깥에 useSelector를 선언해서 쓰고 싶다면 자식 컴포넌트들을 하나의 컴포넌트로 분리한 후 Provider 안쪽에서 분리한 컴포넌트를 불러준다.
  */
  // email이 있으면 login상태로 본다.
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email)

  // Socket.IO 사용하기
  /*
    Socket.IO에서는 데이터를 key: value 형태로 주고 받는다.
      예시)'hello', 'world'
          'userInfo', { name: 'Skylar', birth: 1989 }
          'order', { orderId: '0001s', price: 3000, latitude: 37.5, longtitude: 127.5 }
  */
  /*
    socket.emit : socket으로 서버에 데이터를 보낸다.
    socket.on : socket으로 서버로부터 데이터를 받는다.
    socket.off : socket으로 서버에서 데이터 받는 것 중단. 
 */
  const [socket, disconnect] = useSocket()

  usePermissions()

  //Socket.IO
  useEffect(() => {
    // server로 부터 데이터를 받는 것은 callback 방식으로 처리를 해야 한다.
    const callback = (data: any) => {
      // 백엔드 쪽에서 data를 요청 받으면 1초마다 emit이라고 보내도록 되어있다.
      console.log('callback', data)
      console.log('error', data?.io?.$error?.[0])
      dispatch(orderSlice.actions.addOrder(data))
    }
    if (socket && isLoggedIn) {
      console.log(socket)
      // socket.emit 보낼 때 login을 해야만 hello를 받을 수 있다.
      socket.emit('acceptOrder', 'hello')
      socket.on('order', callback)
    }
    // useEffect의 return은 clean up. on -> off
    return () => {
      if (socket) {
        socket.off('order', callback)
      }
    }
  }, [dispatch, isLoggedIn, socket])

  // logout을 터치하면 Socket.IO disconnect.
  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn)
      disconnect()
    }
  }, [isLoggedIn, disconnect])

  /*
    앱 실행 시 토큰이 있으면 로그인 유지하는 코드
  */
  useEffect(() => {
    // useEffect()는 async를 사용할 수 없으므로 내부에서 async 함수를 만들어 처리한다.
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken')
        if (!token) {
          return
        }
        const response = await axios.post(
          'http://10.0.2.2:3105/refreshToken',
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        )
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        )
      } catch (error) {
        console.error(error)
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.')
        }
      } finally {
        // TODO: splash screen 종료
      }
    }
    getTokenAndRefresh()

    /*
      deps에 추가된 dispatch는 불변성을 유지하기 때문에 추가하든 추가하지 않든 같은 의미를 가진다.
      그럼에도 추가한 것은 eslint가 오류로 인식하기 때문이다.
    */
  }, [dispatch])

  /*
    accessToken 만료시 자동으로 refresh
      axios.interceptors.response.use() 사용
      첫번째 함수는 response 처리
      두번째 함수는 error 처리
      - param으로 받아오는 error는 error.response.status 형태다. 구조분해할당으로 typing한다.
    
  */
  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response
      },
      async error => {
        const {
          config,
          response: { status },
        } = error
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config
            const refreshToken = await EncryptedStorage.getItem('refreshToken')
            // token refresh 요청
            const { data } = await axios.post(
              'http://127.0.0.1:3105/refreshToken', // token refresh api
              {},
              { headers: { authorization: `Bearer ${refreshToken}` } },
            )
            // 새로운 토큰 저장
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken))
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`
            // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
            return axios(originalRequest)
          }
        }
        // 419 error 외 다른 에러 처리
        return Promise.reject(error)
      },
    )
  }, [dispatch])

  return isLoggedIn ? (
    <Tab.Navigator>
      {/* <Tab.Group> 조건문으로 화면 처리할 때 오직 하나의 children이 있어야 한다는 에러가 뜨거나, 특정 스크린 간에 공통 속성이 있을 때 그룹으로 묶어줄 수 있다. */}
      <Tab.Screen
        name="Orders"
        component={Orders}
        options={{ title: '오더 목록' }}
      />
      <Tab.Screen
        name="Delivery"
        component={Delivery}
        options={{ title: '내 오더' }}
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
        options={{ title: '로그인' }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ title: '회원가입' }}
      />
    </Stack.Navigator>
  )
}

export default AppInner
