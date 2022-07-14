import 'react-native-gesture-handler'
import * as React from 'react'
import { NavigationContainer, ParamListBase } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { Text, TouchableHighlight, View } from 'react-native'
import { useCallback } from 'react'

type RootStackParamList = {
  Home: undefined
  Details: undefined
}
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>

function HomeScreen({ navigation }: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details')
  }, [navigation])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight onPress={onClick}>
        <Text>상세 페이지로 가기</Text>
      </TouchableHighlight>
    </View>
  )
}

function DetailsScreen({ navigation }: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home')
  }, [navigation])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableHighlight onPress={onClick}>
        <Text>홈으로 가기</Text>
      </TouchableHighlight>
    </View>
  )
}

/* 
    Stack에 createNativeStackNavigator() 함수를 미리 선언해 둔다.
    cretateNativeStackNavigator() 함수는 아래와 같은 형식으로 라이브러리에 정의 되어있는 것을 가져다 쓰는 것.
    JavaScript 객체(Object)와 똑같다. (함수도 객체)
      function Stack() {
        return <View></View>
      }
      function Navigator() {
        return <View></View>
      }
      function Screen() {
        return <View></View>
      }
      Stack.Navigator = Navigator
      Stack.Screen = Screen
*/
const Stack = createNativeStackNavigator()

/* 
    에전엔 const App = () => { ... } arrow function 형태로 많이 사용했으나, 요즘 트렌드는 function 선언형으로 많이 쓴다.
    별 차이는 없다고 판단된다.
*/
function App() {
  return (
    /*
        React Navigation을 사용할 때는 항상 <NavigationContainer>로 감싸준다. 
          - <NavigationContainer>가 있어야 React Navigation이 작동할 수 있다.
        <NavigationContainer> 하위에 사용할 Navigator를 install 후 import하여 사용한다.
          - <Stack.Navigator></Stack.Navigator> 안에 <Stack.Screen>을 넣어 화면을 구성한다. 
          - <Stack.Navigator> 는 <Stack.Screen>을 그룹으로 묶어 화면 전환이 가능하다.
        <Stack.Screen>은 화면을 그리는 page 단위이다. (혹은 page 보다 조금 더 작은 단위.)
    */
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
        {/*  */}
        {/* 일반적인 <Stack.Screen> 사용법은 "Home" 과 같다. */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // options 적용
          options={{ title: '홈', headerShown: false }}
        />

        {/* <Stack.Screen>을 "Details"처럼 잘 사용하진 않지만 화면이 전환되면서 꼭 넘겨야 할 props가 있다면 아래 처럼 사용할 수도 있다. */}
        <Stack.Screen name="Details" options={{ title: '상세 페이지' }}>
          {(props: any) => <DetailsScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
