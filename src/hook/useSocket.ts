// Socket.IO 사용을 위한 커스텀 훅
import { useCallback } from 'react'
import { io, Socket } from 'socket.io-client'

// socket이 없을 때 한 번만 연결을 맺도록 처리.
let socket: Socket | undefined

/*
  typing [Socket | undefined, () => void]에 대한 설명
  
*/
const useSocket = (): [typeof socket, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect()
      socket = undefined
    }
  }, [])
  if (!socket) {
    /*
      io('서버주소', {option})
      transports: ['websocket'], 설명
        'websocket'은 옛날 브라우저는 지원하지 않는 경우가 있다. 
        'long-polling' websocket을 지원하지 않을 때 http 방식으로 요청보내고 응답받는 것을 실시간으로 반복하는 방법. 서버에 부담이 많이 간다.
        'long-polling' 방식을 사용하지 않으려고 작성하지 않았다. 만일 long-polling 방법을 사용하려면 아래와 같이 작성한다.
          transports: ['long-polling', 'websocket'], 
    */
    socket = io('http://10.0.2.2:3105', {
      transports: ['websocket'],
      // path: 'socket-io', 에러의 원인이 되므로 주석처리
      // path: 'socket-io',
    })
  }
  return [socket, disconnect] //socket 연결을 끊을 수 있도록 disconnect 추가.
}

export default useSocket
