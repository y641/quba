import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'

export default class NotFound extends Component {
    config = {
        navigationBarTitleText: '绿云大酒店',
    }
    reservationRoom = () => {
        Taro.showToast({ title: '功能待开启', icon: 'none' })
    }
    orderCode = () => {
        Taro.showToast({ title: '功能待开启', icon: 'none' })
    }
    teamMembers = () => {
        Taro.showToast({ title: '功能待开启', icon: 'none' })
    }
    render() {
        return (
            <View style='padding-top:50px'>
                <View className='at-row' style='padding-left:40px'>
                    <View>
                        <Image style='height:80px;width:80px;' src={require('../../img/face.png')}></Image>
                    </View>
                    <View style='padding-top:18px'>
                        <View className='at-article__h3' style='margin:0'>呃~~没有查询到和您相关的订单，</View>
                        <View className='at-article__h3' style='margin:0'>您可以尝试以下操作</View>
                    </View>
                </View>
                <View style='margin:70px 70px 30px 70px' onClick={this.reservationRoom}>
                    <AtButton type='secondary'>我要订房</AtButton>
                </View>
                <View style='margin:0px 70px 30px 70px' onClick={this.orderCode}>
                    <AtButton type='secondary'>我有订单号（手机号）</AtButton>
                </View>
                <View style='margin:0px 70px' onClick={this.teamMembers}>
                    <AtButton type='secondary'>我是团队成员</AtButton>
                </View>
            </View>
        )
    }
}