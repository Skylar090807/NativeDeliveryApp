import React, { useCallback, useEffect } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import axios, { AxiosError } from 'axios'
import { useAppDispatch } from '../store'
import userSlice from '../slices/user'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducer'
import EncryptedStorage from 'react-native-encrypted-storage'

function Settings() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  const money = useSelector((state: RootState) => state.user.money)
  const name = useSelector((state: RootState) => state.user.name)
  const dispatch = useAppDispatch()

  /*
    서버에서 수익금 조회 로직
      내 수익금이기 때문에 headers에 accessToken 담아서 체크.
  */
  useEffect(() => {
    async function getMoney() {
      const response = await axios.get<{ data: number }>(
        'http://127.0.0.1:3105//showmethemoney',
        {
          headers: { authorization: `Bearer ${accessToken}` },
        },
      )
      /*
        TypeScript는 서버에서 data를 가져올 때 Type을 추론하지 못한다.
        때문에 <{ data: number }>와 같이 typing을 따로 해줘야 한다.
        그래야만 response.data.data가 number임을 알 수 있다.
      */
      dispatch(userSlice.actions.setMoney(response.data.data))
    }
    getMoney()
  }, [accessToken, dispatch])

  /*
    로그아웃 로직
  */
  const onLogout = useCallback(async () => {
    try {
      // Axios server 통신
      await axios.post(
        'http://127.0.0.1:3105/logout',
        {},
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        },
      )
      Alert.alert('알림', '로그아웃 되었습니다.')
      dispatch(
        userSlice.actions.setUser({
          name: '',
          email: '',
          accessToken: '',
        }),
      )
      await EncryptedStorage.removeItem('refreshToken')
    } catch (error) {
      const errorResponse = (error as AxiosError).response
      console.error(errorResponse)
      if (errorResponse) {
        Alert.alert('알림', (errorResponse.data as any).message)
      }
    }
  }, [accessToken, dispatch])

  // TODO: 배달 완료 후 사진 업로드

  return (
    <View>
      <View style={styles.money}>
        <Text style={styles.moneyText}>
          {name}님의 수익금{' '}
          <Text style={{ fontWeight: 'bold', fontSize: 25, color: '#294A9D' }}>
            {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </Text>
          원
        </Text>
      </View>
      <View style={styles.buttonZone}>
        <Pressable
          style={StyleSheet.compose(
            styles.loginButton,
            styles.loginButtonActive,
          )}
          onPress={onLogout}
        >
          <Text style={styles.loginButtonText}>로그아웃</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  money: {
    padding: 40,
  },
  moneyText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonZone: {
    alignItems: 'center',
    paddingTop: 20,
  },
  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: '#294A9D',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Settings
