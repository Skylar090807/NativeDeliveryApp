// react-native-keyboard-aware-scroll-view 라이브러리는 JavaScript 기반으로 typing을 지원하지 않는다. d.ts파일을 작성해 type 선언을 해줘야 한다.
declare module 'react-native-keyboard-aware-scrollview' {
  import * as React from 'react'
  import { Constructor, ViewProps } from 'react-native'
  class KeyboardAwareScrollViewComponent extends React.Component<ViewProps> {}
  const KeyboardAwareScrollViewBase: KeyboardAwareScrollViewComponent &
    Constructor<any>
  class KeyboardAwareScrollView extends KeyboardAwareScrollViewComponent {}
  export { KeyboardAwareScrollView }
}
