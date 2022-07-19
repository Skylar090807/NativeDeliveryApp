import React, { PropsWithChildren } from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'

// TextInput 외 빈 곳을 터치하면 keyboard가 내려가도록 만든다.
const DismissKeyboardView = ({ children }: PropsWithChildren, { ...props }) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAvoidingView
      {...props}
      //  behavior prop의 경우 android는 position, iOS는 padding이 잘 적용된다. height의 경우 둘 다 적용이 안 된다.
      behavior={Platform.OS === 'android' ? 'position' : 'padding'}
      style={props.style}
    >
      {children}
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
)

export default DismissKeyboardView
