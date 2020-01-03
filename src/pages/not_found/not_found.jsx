import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

export default class NotFound extends Component {
    config = {
        navigationBarTitleText: '绿云大酒店',
    }
    render() {
        return (
            <View>
                <View className='at-row' style='margin-top:25px'>
                    <View className='at-col at-col__offset-4'>
                        <icon type='warn' size='140'></icon>
                    </View>
                </View>
                <View className='at-row'>
                    <View className='at-col at-col__offset-3'>
                        <Text className='at-article__h2'>抱歉~~订单未找到！</Text>
                    </View>
                </View>
                <View className='at-row'>
                    <View className='at-col at-col__offset-3'>
                        <Text className='at-article__p'>请确认信息匹配正确</Text>
                    </View>
                </View>
                <View style='margin:50px 100px'>
                <AtButton type='secondary'>返回并继续</AtButton>
                </View>
            </View>
        )
    }
}