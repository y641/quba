import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard, AtButton  } from "taro-ui"
export default class checksuccess extends Component {
    config = {
        navigationBarTitleText: '入住成功',
    }
    state = {
        checkSuccess:null
    }
    componentWillMount() {
        this.setState({checkSuccess:JSON.parse(this.$router.params.checksuccess)})
    }
    render() {
        return (
            <View>
                <View style='margin-top:50px'>
                    {this.state.checkSuccess ? this.state.checkSuccess.map(item => {
                        return <AtCard
                            title='入住成功'
                        >
                            <View>
                                <Text className='at-article'>入住人：{item.name}</Text>
                            </View>
                            <View className='at-article'>联系电话：{item.mobile}</View>
                            <View className='at-article'>入住日期：{item.arr}</View>
                            <View className='at-article'>离店日期：{item.dep}</View>
                            <View className='at-article'>入住房型：{item.rmtype}</View>
                            <View className='at-article'>房间数量：共1间</View>
                        </AtCard>
                    }) : null}
                    <View style='margin:30px 10px 0px 10px'>
                        <AtButton type='primary' size='normal'>添加同住人</AtButton>
                    </View>
                </View>
            </View>
        )
    }
}