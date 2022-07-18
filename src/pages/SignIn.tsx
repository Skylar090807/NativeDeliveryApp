import React, { useCallback, useState } from 'react'
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onChangeEmail = useCallback((text: React.SetStateAction<string>) => {
    setEmail(text)
  }, [])
  const onChangePassword = useCallback((text: React.SetStateAction<string>) => {
    setPassword(text)
  }, [])

  const onSubmit = useCallback(() => {
    Alert.alert('메시지')
  }, [])

  return (
    <View>
      <View>
        <Text>이메일</Text>
        <TextInput
          placeholder="이메일을 입력하세요."
          onChangeText={onChangeEmail}
        />
      </View>
      <View>
        <Text>비밀번호</Text>
        <TextInput
          placeholder="비밀번호를 입력하세요."
          onChangeText={onChangePassword}
        />
      </View>
      <View style={styles.buttonZone}>
        {/* disabled : 이메일과 비밀번호를 입력하지 않으면 로그인 버튼이 활성화 되지 않는다. */}
        <Pressable
          onPress={onSubmit}
          style={
            !email || !password
              ? styles.loginButton
              : // 배열로 스타일을 부른다. 뒤에 부른 스타일 우선 순위가 더 높다.
                // [styles.loginButton, styles.loginButtonActive]
                StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
          }
          disabled={!email || !password}
        >
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        <Pressable onPress={onSubmit} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>회원가입</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: 'gray',
    // paddingHorizontal: 20,
    // paddingVertical: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: 300,
    height: 50,
  },
  loginButtonActive: {
    backgroundColor: 'darkblue',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonZone: {
    alignItems: 'center',
  },
})

export default SignIn
