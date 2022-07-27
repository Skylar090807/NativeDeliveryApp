import React, { useCallback } from 'react'
import { FlatList, View } from 'react-native'
import { Order } from '../slices/order'
import { useSelector } from 'react-redux'
import { RootState } from '../store/reducer'
import EachOrder from '../components/EachOrder'

function Orders({}) {
  const orders = useSelector((state: RootState) => state.order.orders)
  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <EachOrder item={item} />
  }, [])

  /*
    scrollView와 FlatList
      scrollView는 하위 자식들을 계속해서 랜더링 한다. 때문에 반복문, 서버에서 데이터를 내려받는 경우엔 성능면에서 나쁘다.
      data 목록이 늘어나 스크롤이 필요하고 데이터 양이 많을 땐 FlatList를 사용하는 것이 좋다.
  */
  /*
    FlatList Props
    data={} : 사용할 data
    keyExtractor={} : type function, key 값
    renderItem={} : type function, map()과 유사. 반복할 함수 적용.
  */
  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId}
        renderItem={renderItem}
      />
    </View>
  )
}

export default Orders
