import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import React, { useCallback, useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSelector } from 'react-redux'
import { LoggedInParamList } from '../../AppInner'
import ImagePicker from 'react-native-image-crop-picker'
import ImageResizer from 'react-native-image-resizer'
import { useAppDispatch } from '../store'
import { RootState } from '../store/reducer'
import axios, { AxiosError } from 'axios'
import orderSlice from '../slices/order'

/*
  Image를 촬영하고 front단에서 resizing을 해주지 않으면 서버 용량이 빠르게 찬다.
  물론 서버에서 resizing을 해도 된다. 그러나 서버 자원을 사용하지 않기 위해 front 단에서 resizing을 해주는 것이 좋다.
  react-natvie 에선 react-native-image-resizer로, 웹에서는 canvas로 resizing 해준다.
*/

function Complete() {
  const dispatch = useAppDispatch()

  /*
    React-Native hook useRoute(), useNavigation()
      function Complete({navigation, route}: typing) {} 한 것과 크게 다르지 않다.
    parent screen prop인 navigation과 route를 hook으로 빼면 아래와 같이 쓸 수 있다.

    route 안에는 전달 받은 param이 존재한다.
      Ing.tsx에서  <Marker> onClick 이벤트로 navigation.push('Complete', { orderId: deliveries[0].orderId })를 전달받았다.
      전달 받은 param orderId를 const orderId = route.params?.orderId로 선언해서 사용한다.
  */
  const route = useRoute<RouteProp<LoggedInParamList>>()
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>()

  const [image, setImage] = useState<{
    uri: string
    name: string
    type: string
  }>()
  const [preview, setPreview] = useState<{ uri: string }>()
  const accessToken = useSelector((state: RootState) => state.user.accessToken)

  /*
    onResponse는
      onTakePhoto, onChangeFile처리되고 나면 수행되는 함수이다.
      onTakePhoto, onChangeFile에서 받은 response를 Preview state에 setPreview 해준 뒤,
      ImageResizer.createResizedImage()를 사용해 이미지를 리사이징 해준다. 
      리사이징 된 이미지 데이터를 .then()의 param r로 받아서 Image state에 객체형태로 setImage하여 저장한다.
   */
  const onResponse = useCallback(async (response: any) => {
    console.log('response : ', response.width, response.height, response.exif)
    setPreview({ uri: `data:${response.mime};base64,${response.data}` })
    /*
      base64로 경로를 처리하는 이유
        setPreview({ uri: `data:${response.mime};base64,${response.data}` }) 대신에
        setPreview({uri: response.path})로 경로에 직접 접근해도 처리가 되어야 하는데 native에선 파일 읽기 권한 문제로 불가능한 경우가 있다.
        따라서 base64로 처리하는 것이 좋다.
    */
    const orientation = (response.exif as any)?.Orientation
    console.log('orientation', orientation)
    return ImageResizer.createResizedImage(
      response.path, //uri: 파일의 경로 ex) file://안드로이드 경로
      600, //width
      600, //height
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG', //format
      100, //quality
      0, // rotation
    ).then(r => {
      console.log(r.uri, r.name)

      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      })
    })
  }, [])

  const onTakePhoto = useCallback(() => {
    /*
      includeBase64: type boolean, 이미지를 텍스트 형태로 변형, 이미지 미리 보기를 위해서 필요하다. 
      includeExif: type boolean, image의 방향 전환 참조 사이트 http://sylvana.net/jpegcrop/exif_orientation.html
      saveToPhotos: type boolean, 커스텀 옵션
      cropping: type boolean, image crop 편집 기능
    */
    return ImagePicker.openCamera({
      includeBase64: true,
      includeExif: true,
      // saveToPhotos: true,
      cropping: true,
    })
      .then(onResponse)
      .catch(console.log)
  }, [onResponse])

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log)
  }, [onResponse])

  const orderId = route.params?.orderId
  const onComplete = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.')
      return
    }
    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.')
      return
    }
    const formData = new FormData()
    formData.append('image', image)
    formData.append('orderId', orderId)
    try {
      await axios.post(`http://127.0.0.1:3105//complete`, formData, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })
      Alert.alert('알림', '완료처리 되었습니다.')
      navigation.goBack()
      navigation.navigate('Settings')
      dispatch(orderSlice.actions.rejectOrder(orderId))
    } catch (error) {
      const errorResponse = (error as AxiosError).response
      if (errorResponse) {
        Alert.alert('알림', (errorResponse.data as any).message)
      }
    }
  }, [dispatch, navigation, image, orderId, accessToken])

  return (
    <View>
      <View style={styles.orderId}>
        <Text>주문번호: {orderId}</Text>
      </View>
      <View style={styles.preview}>
        {preview && <Image style={styles.previewImage} source={preview} />}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onChangeFile}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </Pressable>
        <Pressable
          style={
            image
              ? styles.button
              : StyleSheet.compose(styles.button, styles.buttonDisabled)
          }
          onPress={onComplete}
        >
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  orderId: {
    padding: 20,
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
  },
  buttonWrapper: { flexDirection: 'row', justifyContent: 'center' },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: '#F29B2C',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
})

export default Complete
