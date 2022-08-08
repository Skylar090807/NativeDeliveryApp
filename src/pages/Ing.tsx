import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import NaverMapView, { Marker, Path } from 'react-native-nmap'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducer'
import Geolocation from '@react-native-community/geolocation'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { LoggedInParamList } from '../../AppInner'

/*
  Navigation Param을 'Delivery'로 보내도 Ing 컴포넌트 화면으로 넘어오는 이유?
  - Delivery 컴포넌트에서 Ing와 Complete 컴포넌트를 stack navigator로 감싸고 있다. 아래와 같은 형태.
  - tab navigator 
    - tab screen ('Delivery')
      - stack navigator
        - stack screen ('Ing')
        - stack screen ('Complete')
  - initialRouteName="Ing" 이므로 'Delivery'로 보냈을 때 Ing 컴포넌트가 보인다.
  
*/
type IngScreenProps = NativeStackScreenProps<LoggedInParamList, 'Delivery'>

function Ing({ navigation }: IngScreenProps) {
  console.log(navigation)
  const deliveries = useSelector((state: RootState) => state.order.deliveries)

  // 내 위치 useSate로 관리
  const [myPosition, setMyPosition] = useState<{
    latitude: number
    longitude: number
  } | null>(null)

  // Geolocation 사용
  useEffect(() => {
    /*
      getCurrentPosition()
        첫번째 param: 현재 위치 정보 활용. type은 function
        두번째 param: 에러 처리 type은 function
        세번째 param: enableHighAccuracy(높은 정확도 사용) type은 Boolean, timeout 20초 후에도 위치 정보 찾지 못하면 에러 띄우게 함 type은 Number
    */
    Geolocation.getCurrentPosition(
      info => {
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        })
      },
      console.error,
      {
        enableHighAccuracy: true,
        timeout: 20000,
      },
    )
  }, [])

  if (!deliveries?.[0]) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>주문을 먼저 수락해주세요!</Text>
      </View>
    )
  }

  if (!myPosition || !myPosition.latitude) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>내 위치를 로딩 중입니다. 권한을 허용했는지 확인해주세요.</Text>
      </View>
    )
  }

  const { start, end } = deliveries?.[0]

  return (
    <View>
      <View style={styles.mapWrapper}>
        <NaverMapView
          style={styles.naverMapView}
          zoomControl={true}
          center={{
            zoom: 10,
            tilt: 50,
            // 출발지와 도착지가 맵 중간이 되도록 start와 end를 더해 2로 나눴다.
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2,
          }}
        >
          {myPosition?.latitude && (
            <Marker
              coordinate={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
              }}
              width={30}
              height={30}
              anchor={{ x: 0.5, y: 0.5 }}
              caption={{ text: '내 위치' }}
              image={require('../assets/black-marker.png')}
            />
          )}
          {myPosition?.latitude && (
            <Path
              coordinates={[
                {
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                },
                { latitude: start.latitude, longitude: start.longitude },
              ]}
              color="#294A9D"
            />
          )}
          <Marker
            coordinate={{
              latitude: start.latitude,
              longitude: start.longitude,
            }}
            width={30}
            height={30}
            anchor={{ x: 0.5, y: 0.5 }}
            caption={{ text: '출발' }}
            image={require('../assets/blue-marker.png')}
          />
          <Path
            coordinates={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              { latitude: end.latitude, longitude: end.longitude },
            ]}
            color="#F29B2C"
          />
          <Marker
            coordinate={{ latitude: end.latitude, longitude: end.longitude }}
            width={40}
            height={40}
            anchor={{ x: 0.5, y: 0.5 }}
            caption={{ text: '도착' }}
            image={require('../assets/home-marker.png')}
            onClick={() => {
              console.log(navigation)
              navigation.push('Complete', { orderId: deliveries[0].orderId })
            }}
          />
        </NaverMapView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mapWrapper: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  naverMapView: {
    width: '100%',
    height: '100%',
  },
})
export default Ing
