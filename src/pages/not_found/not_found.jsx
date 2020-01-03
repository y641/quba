import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

export default class NotFound extends Component {
    config = {
        navigationBarTitleText: '绿云大酒店',
    }
    render() {
        return (
            <View style='padding-top:50px'>
                <View>
                    <View>
                        <Image style='height:80px;width:80px;' src={require('../../img/face.png')}></Image>
                    </View>
                    <View>呃~~没有查询到和您相关的订单，您可以尝试以下操作</View>
                </View>
            </View>
        )
    }
}