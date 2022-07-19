import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useRef, useState } from 'react'
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { RootStackParamList } from '../../App'

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>

function SignIn({ navigation }: SignInScreenProps) {
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

  const onSubmit = useCallback(() => {
    // trim() 좌우공백 제거
    if (!email || !email.trim()) {
      return Alert.alert('이메일을 입력해주세요.')
    }
    if (!password || !password.trim()) {
      return Alert.alert('비밀번호를 입력해주세요.')
    }
    Alert.alert('로그인 되었습니다.')
  }, [email, password])

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
          <Text style={styles.loginButtonText}>로그인</Text>
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
