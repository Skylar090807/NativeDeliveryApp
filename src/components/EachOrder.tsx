import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import orderSlice, { Order } from '../slices/order'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { LoggedInParamList } from '../../AppInner'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducer'
import axios, { AxiosError } from 'axios'
import getDistanceFromLatLonInKm from '../util'
import NaverMapView, { Marker, Path } from 'react-native-nmap'

interface Props {
  item: Order
}
function EachOrder({ item }: Props) {
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>()
  const dispatch = useAppDispatch()
  const accessToken = useSelector((state: RootState) => state.user.accessToken)

  const [loading, setLoading] = useState(false)
  // toggleDetail
  const [detail, showDetail] = useState(false)

  /*
    주문 수락의 경우 서버와 통신하여 수락을 알려야 한다.
    내가 수락한 주문을 타인이 수락하거나, 타인이 수락한 주문을 내가 수락하면 안 되기 때문이다.
  */
  const onAccept = useCallback(async () => {
    if (!accessToken) {
      return
    }
    try {
      await axios.post(
        'http://127.0.0.1:3105/accept',
        { orderId: item.orderId },
        { headers: { authorization: `Bearer ${accessToken}` } },
      )
      dispatch(orderSlice.actions.acceptOrder(item.orderId))
      //다른 컴포넌트로 이동 시 현재 컴포넌트가 unMount 되므로, 이동 전에 loading state를 바꾼다. (native는 언마운트 되지 않지만 다른 경우 신경써야 한다.)
      setLoading(true)
      navigation.navigate('Delivery')
    } catch (error) {
      let errorResponse = (error as AxiosError).response
      if (errorResponse?.status === 400) {
        // 타인이 이미 수락한 경우
        Alert.alert('알림', (errorResponse.data as any).message)
        dispatch(orderSlice.actions.rejectOrder(item.orderId))
      }
      setLoading(false)
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
            <NaverMapView
              style={{ width: '100%', height: '100%' }}
              zoomControl={true}
              /*
                center options

              */
              center={{
                zoom: 10,
                tilt: 50,
                latitude: (start.latitude + end.latitude) / 2,
                longitude: (start.longitude + end.longitude) / 2,
              }}
            >
              <Marker
                // 출발 지점 마커
                coordinate={{
                  latitude: start.latitude,
                  longitude: start.longitude,
                }}
                pinColor="blue"
              />
              <Path
                coordinates={[
                  { latitude: start.latitude, longitude: start.longitude },
                  { latitude: end.latitude, longitude: end.longitude },
                ]}
              />
              <Marker
                // 도착 지점 마커
                coordinate={{
                  latitude: end.latitude,
                  longitude: end.longitude,
                }}
              />
            </NaverMapView>
          </View>
          <View style={styles.buttonWrapper}>
            <Pressable
              onPress={onAccept}
              disabled={loading}
              style={styles.acceptButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>수락</Text>
              )}
            </Pressable>
            <Pressable
              onPress={onReject}
              // disabled={loading}
              style={styles.rejectButton}
            >
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
    width: Dimensions.get('window').width - 30,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
  },
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
