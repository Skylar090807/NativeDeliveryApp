import React, { PropsWithChildren, ReactNode } from 'react'
import {
  Keyboard,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// TextInput 외 빈 곳을 터치하면 keyboard가 내려가도록 만든다.
// children을 prop으로 받아 올 땐 React.FC 형태를 쓰는 것이 좋다.
// RN StyleSheet typing -> style?: StyleProp<ViewStyle>
// react-native-keyboard-aware-scroll-view 라이브러리는 JavaScript 기반으로 typing을 지원하지 않는다. d.ts파일을 작성해 type 선언을 해줘야 한다.
const DismissKeyboardView: React.FC<{
  style?: StyleProp<ViewStyle>
  children?: ReactNode
}> = ({ children }: PropsWithChildren, { ...props }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView {...props} style={props.style}>
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
)

export default DismissKeyboardView
