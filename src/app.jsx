import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index/index'
import 'taro-ui/dist/style/index.scss'

import './app.scss'

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/registration_check/registration_check',
      'pages/add_check/add_check',
      'pages/success/success',
      'pages/registration/registration',
      'pages/order_check/order_check',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    "tabBar": {
      color: "#333",
      selectedColor: "#1296DB",
      backgroundColor: "#fff",
      borderStyle: "black",
      "list": [{
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "./img/home.png",
        "selectedIconPath": "./img/active.png"
      }, {
        "pagePath": "pages/index/index",
        "text": "我的",
        "iconPath": "./img/me.png",
        "selectedIconPath": "./img/me_active.png"
      }]
    },
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
