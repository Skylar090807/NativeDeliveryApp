import { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useRef, useState } from 'react'
import {
  Alert,
  // KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { RootStackParamList } from '../../App'
import DismissKeyboardView from '../components/DismissKeyboardView'
// import DismissKeyboardView from '../components/DismissKeyboardView'

type SignUpScreenProps = NativeStackScreenProps<RootStackParamList, 'SignUp'>

function SignUp({ navigation }: SignUpScreenProps) {
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

  const onSubmit = useCallback(() => {
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
    console.log(email, name, password)
    Alert.alert('알림', '회원가입 되었습니다.')
  }, [email, name, password])

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
          disabled={!canGoNext}
          onPress={onSubmit}
        >
          <Text style={styles.loginButtonText}>회원가입</Text>
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
