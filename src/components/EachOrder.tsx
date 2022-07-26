import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import orderSlice, { Order } from '../slices/order'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { LoggedInParamList } from '../../AppInner'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducer'
import axios, { AxiosError } from 'axios'
import getDistanceFromLatLonInKm from '../util'

interface Props {
  item: Order
}
function EachOrder({ item }: Props) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>()
  const dispatch = useAppDispatch()
  const accessToken = useSelector((state: RootState) => state.user.accessToken)
  const [detail, showDetail] = useState(false)

  const onAccept = useCallback(async () => {
    if (!accessToken) {
      return
    }
    try {
      await axios.post(
        'http://10.0.2.2:3105/accept',
        { orderId: item.orderId },
        { headers: { authorization: `Bearer ${accessToken}` } },
      )
      dispatch(orderSlice.actions.acceptOrder(item.orderId))
      navigation.navigate('Delivery')
    } catch (error) {
      let errorResponse = (error as AxiosError).response
      if (errorResponse?.status === 400) {
        // 타인이 이미 수락한 경우
        Alert.alert('알림', (errorResponse.data as any).message)
        dispatch(orderSlice.actions.rejectOrder(item.orderId))
      }
    }
  }, [navigation, dispatch, item, accessToken])

  const onReject = useCallback(() => {
    dispatch(orderSlice.actions.rejectOrder(item.orderId))
  }, [dispatch, item])
  const { start, end } = item

  const toggleDetail = useCallback(() => {
    showDetail(prevState => !prevState)
  }, [])

  return (
    <View style={styles.orderContainer}>
      <Pressable onPress={toggleDetail} style={styles.info}>
        <Text style={styles.eachInfo}>
          {item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원
        </Text>
        <Text style={styles.eachInfo}>
          {getDistanceFromLatLonInKm(
            start.latitude,
            start.longitude,
            end.latitude,
            end.longitude,
          ).toFixed(1)}
          km
        </Text>
      </Pressable>
      {detail && (
        <View>
          <View style={styles.mapWrapper}>
            <Text style={styles.mapText}>Naver Map Place</Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable onPress={onAccept} style={styles.acceptButton}>
              <Text style={styles.buttonText}>수락</Text>
            </Pressable>
            <Pressable onPress={onReject} style={styles.rejectButton}>
              <Text style={styles.buttonText}>거절</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  orderContainer: {
    borderRadius: 5,
    margin: 10,
    padding: 20,
    backgroundColor: 'lightgray',
  },
  info: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  eachInfo: {
    flex: 1,
    fontSize: 18,
  },
  mapWrapper: {
    marginBottom: 10,
  },
  mapText: {},
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  acceptButton: {
    backgroundColor: '#294A9D',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
    flex: 1,
  },
  rejectButton: {
    backgroundColor: '#F29B2C',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default EachOrder
