import { useEffect } from 'react'
import { Alert, Linking, Platform } from 'react-native'
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'

/*
  Linking 사용 예시
  Linking.openURL로 https, tel, sms 다양하게 연결 할 수 있다.
  App URI Scheme 설정으로 다른 앱으로 연동 시킬 수 있다.
*/
// Linking.openURL('https://google.com')
// Linking.openURL('tel://01012345678')
// Linking.openURL('sms://01012345678')
// Linking.openURL('mailto://skylar@email.com')
// Linking.openURL('upbitex://account') //업비트 어카운트 연결

function usePermissions() {
  useEffect(() => {
    /*
      android 위치 권한
      ACCESS_FINE_LOCATION을 허용하면 ACCESS_COARSE_LOCATION도 허용 되므로 ACCESS_FINE_LOCATION만 check하면 된다.
    */
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          console.log('check location', result)
          if (result === RESULTS.DENIED) {
            return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
          } else if (result === RESULTS.BLOCKED) {
            Alert.alert(
              '위치 권한 허용이 필요합니다.', // title
              '설정에서 항상 허용으로 변경 해주세요.', //message
              [
                //button
                {
                  text: '네',
                  onPress: () => Linking.openSettings(), // 사용자 편의를 위해 Settings를 연결
                  style: 'default',
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            )
          }
        })
        .catch(console.error)
      /*
        ios 위치 권한
      */
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '백그라운드 위치 권한 허용이 필요합니다.',
              '설정에서 항상 허용으로 변경 해주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            )
          }
        })
        .catch(console.error)
    }

    // android Camera 권한
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          // RESULTS.GRANTED 된 상태에서는 request는 아무 역할도 하지 않지만 빼버리면 else문으로 흘러가서 계속 error를 띄우므로 추가.
          if (result === RESULTS.DENIED || result === RESULTS.GRANTED) {
            return request(PERMISSIONS.ANDROID.CAMERA)
          } else {
            console.log(result)
            throw new Error('카메라 지원 불가')
          }
        })
        .catch(console.error)
    }
    // iOS Camera 권한
    else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          if (
            result === RESULTS.DENIED ||
            result === RESULTS.LIMITED ||
            result === RESULTS.GRANTED
          ) {
            return request(PERMISSIONS.IOS.CAMERA)
          } else {
            console.log(result)
            throw new Error('카메라 지원 불가')
          }
        })
        .catch(console.error)
    }
  }, [])
}

export default usePermissions
