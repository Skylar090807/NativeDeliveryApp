import { NativeStackScreenProps } from '@react-navigation/native-stack'
import axios, { AxiosError } from 'axios'
import React, { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  // KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { RootStackParamList } from '../../AppInner'
import DismissKeyboardView from '../components/DismissKeyboardView'

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>

function SignUp({ navigation }: SignUpScreenProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const emailRef = useRef<TextInput | null>(null)
  const nameRef = useRef<TextInput | null>(null)
  const passwordRef = useRef<TextInput | null>(null)

  const onChangeEmail = useCallback((text: string) => {
    setEmail(text.trim())
  }, [])
  const onChangeName = useCallback((text: string) => {
    setName(text.trim())
  }, [])
  const onChangePassword = useCallback((text: string) => {
    setPassword(text.trim())
  }, [])

  // useEffect는 param에 async를 쓰면 안 되지만, useCallback은 async 사용 가능.
  const onSubmit = useCallback(async () => {
    // loading 중인데 한번 더 회원가입을 터치 했을 때 요청 가지않게 막아주는 것.
    if (loading) {
      return
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.')
    }
    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 입력해주세요')
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요')
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.')
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      )
    }
    // Axios로 서버에 요청
    try {
      setLoading(true)
      // http Method : request, get, put, patch, post, delete, head, options
      // axios.post(url[, data[, config]])
      const response = await axios.post(
        // 운영과 개발 서버 분기처리
        // `${
        //   process.env.NODE_ENV === 'production'
        //     ? '운영서버주소'
        //     : 'localhost:3105'
        // }/user`,
        // `${__DEV__ ? 'localhost:3105' : '운영서버주소'}/user`,

        // localhost 주소 부르는 방법
        // '127.0.0.1:3105/user',
        // 'localhost:3105/user',
        // '내아이피/user',
        '10.0.2.2:3105/user',
        {
          email,
          name,
          password,
        },
        // config에 headers를 요청, 같은 사용자가 얼마나 여러번 터치했는지 체크하는 안전장치를 만들 수 있다. 서버 개발자와 상의해서 인공지능 robot 등이 여러번 클릭하지 못하도록 클라이언트에서도 한 번 더 처리할 수 있다.
        // {
        //   headers: {
        //     token: '고유한 값',
        //   },
        // },
      )
      console.log(response.data)
      Alert.alert('알림', '가입 되었습니다.')
    } catch (error) {
      // error는 unknown이다. typescript에서 쓸 때는 (error as AxiosError)라고 해줘야 한다.
      // 변수에 (error as AxiosError)를 담아 가독성, 사용성을 높인다.
      // 다만 아래와 같이 error catch를 하면 네트워크(Axios) 에러만 잡고, 문법 에러는 잡을 수 없다. catch에서 생긴 에러는 catch에서 잡을 수 없다.
      const errorResponse = (error as AxiosError).response
      console.error(errorResponse)
      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message)
      }
    } finally {
      setLoading(false)
    }

    console.log(email, name, password)
    Alert.alert('알림', '회원가입 되었습니다.')
  }, [loading, email, name, password])

  const canGoNext = email && name && password
  return (
    // <KeyboardAvoidingView behavior="position">
    <DismissKeyboardView>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>이메일</Text>
        <TextInput
          value={email}
          style={styles.textInput}
          onChangeText={onChangeEmail}
          placeholder="이메일을 입력하세요."
          placeholderTextColor="#666"
          textContentType="emailAddress"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => nameRef.current?.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>이름</Text>
        <TextInput
          value={name}
          style={styles.textInput}
          placeholder="이름을 입력해주세요"
          placeholderTextColor="#666"
          onChangeText={onChangeName}
          textContentType="name"
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={nameRef}
          onSubmitEditing={() => {
            passwordRef.current?.focus()
          }}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputLabel}>비밀번호</Text>
        <TextInput
          value={password}
          style={[styles.textInput, styles.passwordInput]}
          placeholder="비밀번호를 입력하세요.(영문, 숫자, 특수문자)"
          placeholderTextColor="#666"
          onChangeText={onChangePassword}
          keyboardType={Platform.OS === 'android' ? 'default' : 'ascii-capable'}
          textContentType="password"
          secureTextEntry
          returnKeyType="send"
          clearButtonMode="while-editing"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
        />
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          // 회원가입 버튼을 터치하면 Axios 서버 요청으로 넘어간다. 이 때 loading 중일 때 버튼이 활성화 되지 않도록 한다. 회원가입을 여러번 클릭 시 클릭 수만큼 가입되는 것을 막는 것.
          disabled={!canGoNext || loading}
          onPress={onSubmit}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>회원가입</Text>
          )}
        </Pressable>
      </View>
    </DismissKeyboardView>
  )
}

const styles = StyleSheet.create({
  inputWrapper: { padding: 20 },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  textInput: {
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ececec',
  },
  passwordInput: {
    marginBottom: 70,
  },
  buttonZone: { alignItems: 'center' },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: '#294A9D',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default SignUp
