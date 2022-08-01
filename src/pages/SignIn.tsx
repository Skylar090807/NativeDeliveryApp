import { NativeStackScreenProps } from '@react-navigation/native-stack'
import axios, { AxiosError } from 'axios'
import React, { useCallback, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import EncryptedStorage from 'react-native-encrypted-storage'
import { RootStackParamList } from '../../AppInner'
import userSlice from '../slices/user'
import { useAppDispatch } from '../store'

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>

function SignIn({ navigation }: SignInScreenProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  //ref는 기본적으로 null이 들어갈 수 있다. undefined를 넣을 수도 있다.
  const emailRef = useRef<TextInput | null>(null)
  const passwordRef = useRef<TextInput | null>(null)

  const onChangeEmail = useCallback((text: React.SetStateAction<string>) => {
    setEmail(text)
  }, [])
  const onChangePassword = useCallback((text: React.SetStateAction<string>) => {
    setPassword(text)
  }, [])

  const onSubmit = useCallback(async () => {
    // trim() 좌우공백 제거
    if (!email || !email.trim()) {
      return Alert.alert('이메일을 입력해주세요.')
    }
    if (!password || !password.trim()) {
      return Alert.alert('비밀번호를 입력해주세요.')
    }
    /*
       로그인시 서버로 인증 토큰을 요청하면 서버에서 토큰을 보내준다.
       서버에서 받은 토큰을 저장해야한다. redux 스토어 같은 곳에 저장하면 rem과 같기 때문에 App을 끄면 날아가버린다.
       Native App 에서는 localStorage와 비슷한 개념인 RN의 기본 제공 AsyncStorage를 사용할 수 있으나, AsyncStorage는 암호화되지 않아 누구나 열어볼 수 있다.
       AsyncStorage에 토큰을 담아주면 위험하다. 보안에 민감하지 않으나 계속 유지되어야 하는 데이터를 담는 것은 괜찮다. 
       보안에 민감한 데이터들은 react-native-encrypted-storage 라이브러리를 사용한다. 
    */
    //  Axios API 서버 호출
    try {
      setLoading(true)
      const response = await axios.post('http://127.0.0.1:3105/login', {
        email,
        password,
      })
      console.log(response.data)
      Alert.alert('알림', '로그인 되었습니다.')
      dispatch(
        // userSlice.actions.setUser({})의 action
        userSlice.actions.setUser({
          name: response.data.data.name,
          email: response.data.data.email,
          /*
            accessToken과 refreshToken
              accessToken에는 유효기간을 둔다. 지정된 시간이 지나면 로그아웃 된다. 유효기간: 5분~ 1시간
              시간을 연장할 때 refreshToken을 서버로 보내준다. 서버는 다시 accessToken을 보내준다. 유효기간: 1일 ~ 30일
              accessToken과 refreshToken 동시에 모두 탈취되는 사태가 발생하지 않도록 각각 다른 곳에 저장한다.
                - ex) 
          */
          accessToken: response.data.data.accessToken,
        }),
      )
      // 바꿀 state가 하나일 때 action에서 객체가 아닌 data 값을 바로 던지는 예시.
      dispatch(userSlice.actions.setName(response.data.data.name))

      // refreshToken EncryptedStorage에 저장.
      /*
        EncryptedStorage 사용법 (Promise 문법으로 사용한다)
        await EncryptedStorage.setItem('키', '값');
        await EncryptedStorage.removeItem('키');
        const 값 = await EncryptedStorage.getItem('키');
      */
      await EncryptedStorage.setItem(
        'refreshToken',
        response.data.data.refreshToken,
      )
    } catch (error) {
      const errorResponse = (error as AxiosError).response
      if (errorResponse) {
        Alert.alert('알림', (errorResponse.data as any).message)
      }
    } finally {
      setLoading(false)
    }
  }, [dispatch, email, password])

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp')
  }, [navigation])

  const canGoNext = email && password
  return (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.InputLabel}>이메일</Text>
        <TextInput
          value={email}
          placeholder="이메일을 입력하세요."
          onChangeText={onChangeEmail}
          style={styles.textInput}
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          keyboardType="email-address"
          onSubmitEditing={() => {
            passwordRef.current?.focus()
          }}
          // blurOnSubmit 다음 input 입력 창으로 넘어갈 때 키보드 내려가는 것 방지
          blurOnSubmit={false}
          ref={emailRef}
          // iOS 작성중 x 터치하면 한번에 작성내용 삭제
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.inputWrapper}>
        <Text style={styles.InputLabel}>비밀번호</Text>
        <TextInput
          value={password}
          placeholder="비밀번호를 입력하세요."
          onChangeText={onChangePassword}
          style={[styles.textInput, styles.passwordInput]}
          secureTextEntry
          importantForAutofill="yes"
          autoComplete="password"
          textContentType="password"
          ref={passwordRef}
          // enter 쳤을 때 로그인 버튼 onSubmit 함수 활성화
          onSubmitEditing={onSubmit}
          // iOS 작성중 x 터치하면 한번에 작성내용 삭제
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.buttonZone}>
        {/* disabled : 이메일과 비밀번호를 입력하지 않으면 로그인 버튼이 활성화 되지 않는다. */}
        <Pressable
          onPress={onSubmit}
          style={
            !canGoNext
              ? styles.loginButton
              : // 배열로 스타일을 부른다. 뒤에 부른 스타일 우선 순위가 더 높다.
                // [styles.loginButton, styles.loginButtonActive]
                // 배열로 스타일을 부른 것과 결과적으로는 같으나 여러 개의 스타일을 부르는 다른 방법.
                StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
          }
          // disabled={!email || !password}
          disabled={!canGoNext}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>로그인</Text>
          )}
        </Pressable>
        <Pressable onPress={toSignUp} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  inputWrapper: {
    padding: 40,
  },
  buttonZone: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    width: 350,
    height: 50,
    fontSize: 16,
  },
  loginButtonActive: {
    backgroundColor: '#294A9D',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  InputLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  passwordInput: {
    marginBottom: 100,
  },
})

export default SignIn
