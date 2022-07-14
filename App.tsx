import 'react-native-gesture-handler'
import * as React from 'react'
import { NavigationContainer, ParamListBase } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
import { Pressable, Text, TouchableHighlight, View } from 'react-native'
import { useCallback } from 'react'

type RootStackParamList = {
  Home: undefined
  Details: undefined
}
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>

// TypeScript는 작은 개념으로는 JavaScript의 parameter(매개변수), return value(리턴 값), variable(변수)에 Typing 한 것.
function HomeScreen({ navigation }: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details')
  }, [navigation])

  return (
    /*
      React Native에서의 Style
        flex 개념은 웹에서 사용하는 CSS flex와 같다. 
        - sibling 끼리 지정해준 숫자만큼 비율을 나눠가진다. sibling이 없으면 혼자서 차지한다.
        flex-direction은 column이 default이다.
        - 웹과 같이 flex-direction: column일 때 justify-content = column 정렬, align-items = row 정렬이 된다.
        각 컴포넌트에서 적용 가능한 style은 Cmd+ Click으로 따라가서 보면 된다.
        - ex) View 컴포넌트의 경우 style (Cmd+ Click) -> node_module/@types/react-native/index.d.ts파일 <ViewStyle>(Cmd+ Click)
        React Native에서 style 상속
        - 큰 특을 웹과 비슷하나, Text의 경우 Text의 부모 View에서 Color를 줘도 상속되지 않는다.
        - Text 관련 Style은 Text에 따로 줘야 한다. 자세한 style은 Cmd+ Click으로 따라가서 보면 된다.
        CSS short cut X
        - web에서 사용 가능한 short cut들은 사용할 수 없다
          -ex) border: 1px solid black 같은 것들 사용할 수 없음. borderWidth: 1, borderStyle: 'solid', borderColor: 'black'과 같이 따로 지정.
        - 다만 padding, margin의 경우 left, right 합쳐서 paddingHorizontal을 쓸 수 있고, top, bottom 합쳐서 paddingVertical을 쓸 수 있다.
          - ex) paddingHorizontal, marginHorizontal, paddingVertical, marginVertical
    */
    <React.Fragment>
      <View
        style={{
          flex: 3,
          alignItems: 'flex-end',
          justifyContent: 'center',
          backgroundColor: 'lightblue',
        }}
      >
        {/* 
            React Native의 버튼들
              Button
              TochableNativeFeedback
              TochableWithoutFeedback
              TochableHighlight
              - underlayColor prop으로 highlihgt color 변경 가능
              TochableOpacity
              Pressable
              - ios, android 운영체제 구분 없이 쓸 수 있다.
              공통적으로 onPress prop을 사용할 수 있다.
              - Callback으로 Press 되었을 때 이벤트를 등록할 수 있다.
              - web에서의 onClick과 혼동하지 않도록 주의. (mobile이기 때문에 onPress)
        */}
        <TouchableHighlight
          onPress={onClick}
          underlayColor="#ececec"
          style={{
            padding: 20,
            backgroundColor: 'blue',
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            상세 페이지로 가기
          </Text>
        </TouchableHighlight>
      </View>
      <View
        style={{
          flex: 4,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'lightyellow',
        }}
      >
        <Pressable onPress={onClick}>
          <Text>상세 페이지로 가기</Text>
        </Pressable>
      </View>
    </React.Fragment>
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
      {/* Screen을 Grouping 하는 컴포넌트에서는 creenOptions={{}}, Screen 컴포넌트에서는 options로 option props를 사용한다.
          TypeScript를 사용하면 option props 들이 snippet으로 뜬다.
      */}
      <Stack.Navigator initialRouteName="Home" screenOptions={{}}>
        {/*  */}
        {/* 일반적인 <Stack.Screen> 사용법은 "Home" 과 같다. */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // options 적용
          options={{ title: '홈', headerShown: true }}
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
