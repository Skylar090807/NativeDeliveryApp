// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Complete from './Complete'
import Ing from './Ing'

// const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()
/*
  배달 화면은 지도가 먼저 보이고 그 위에 완료화면이 stack screen으로 쌓인다.
  - 지도에 표시된 마커를 누르면 완료 화면으로 넘어가는 형태로 구현할 예정이다.
  - 지도는 API를 불러오는 로딩 시간이 길기 때문에 화면을 따로 구성해서 지도를 보고 완료 화면으로 이동했다가 다시 지도 화면으로 돌아오는 형태는 좋지 않다.
    때문에 stack으로 쌓이는 형태가 낫다.
*/
function Delivery() {
  return (
    <Stack.Navigator initialRouteName="Ing">
      <Stack.Screen
        name="Ing"
        component={Ing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Complete"
        component={Complete}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

export default Delivery
