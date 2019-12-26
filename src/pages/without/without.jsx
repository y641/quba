import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

export default class without extends Component{
    config = {
        navigationBarTitleText:'绿云大酒店'
    }
    render() {
        return (
            <View style='padding-top:100px'>
                <View className='at-row'>
                        <AtIcon value='close-circle' size='180' color='#F00' className='at-col at-col__offset-3'></AtIcon>
                </View>
                <View className='at-row' style='padding:0 40px'>
                    <View className='at-article__h2 at-col at-col__offset-5'> 无可用房间，请联系酒店前台</View>
                </View>
            </View>
        )
    }
}