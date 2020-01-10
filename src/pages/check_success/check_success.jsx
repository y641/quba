import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtCard, AtButton } from "taro-ui"
import { checkperson} from '../utils/utils'
import './check_success.scss'

var list=[]
export default class checksuccess extends Component {
    config = {
        navigationBarTitleText: '入住成功',
    }
    state = {
        checkSuccess: null,
        newid:''
    }
    componentWillMount() {
        if (this.$router.params.num === '8') {
            this.setState({newid:this.$router.params.newid},()=>{this.checkin()})
         list = [...list,JSON.parse(this.$router.params.checksuccess)]
        } else {
            list = JSON.parse(this.$router.params.checksuccess)
        }
        this.setState({ checkSuccess: list })
        console.log(list)
    }
    checkin = () => {
        checkperson({ masterId: this.state.newid }, (res) => {
            console.log(res, '入住')
            if (res.data && res.data.resultCode === 0) {
                console.log('入住成功')
            } else {
                Taro.showToast({
                    title: '入住失败，请联系酒店前台',
                    icon: 'none'
                })
                return
            }
        })
    }
    add = () => {
        Taro.navigateTo({url:`/pages/add/add?id=${this.state.checkSuccess[0].id}&num=6`})
    }
    render() {
        return (
            <View>
                入住成功
                <View style='margin-top:50px'>
                    {this.state.checkSuccess ? this.state.checkSuccess.map((item,index) => {
                        return <AtCard
                            title={index===0?'入住成功' :'同住人'}
                        >
                            <View>
                                <Text className='at-article'>{index === 0 ? `入住人：${item.name}` : null}</Text>
                            </View>
                            <View className='at-article'>{index > 0 ? `姓名：${item.name}` :null}</View>
                            <View className='at-article'>联系电话：{item.mobile}</View>
                            <View className='at-article'>{index>0 ?`证件号码：${item.idcard}` :null}</View>
                            <View className='at-article'>{index === 0 ?`入住日期：${item.arr}`:null}</View>
                            <View className='at-article'>{index === 0 ?`离店日期：${item.dep}`:null}</View>
                            <View className='at-article'>{index === 0 ?`入住房型：${item.rmtype}`:null}</View>
                            <View className='at-article'>{index === 0 ?`房间数量：共1间` :null}</View>
                        </AtCard>
                    }) : null}
                    <View style='margin:30px 10px 0px 10px'>
                        <AtButton type='primary' size='normal' onClick={this.add}>添加同住人</AtButton>
                    </View>
                    <View style='margin:20px 10px 0px 10px'>
                        <AtButton type='secondary' size='normal' onClick={() => {
                            Taro.navigateBack({delta:100})
                        }}>返回首页</AtButton>
                    </View>
                </View>
            </View>
        )
    }
}