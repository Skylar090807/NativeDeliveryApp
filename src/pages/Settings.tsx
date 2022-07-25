import React, { useCallback } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import axios, { AxiosError } from 'axios'
import { useAppDispatch } from '../store'
import userSlice from '../slices/user'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducer'
import EncryptedStorage from 'react-native-encrypted-storage'

function Settings() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  const dispatch = useAppDispatch()
  const onLogout = useCallback(async () => {
    try {
      // Axios server 통신
      await axios.post(
        'http://10.0.2.2:3105/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
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

  return (
    <View>
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
