import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps,  AtButton, AtDivider } from 'taro-ui'
import { checkperson, noPassByMobile, noPassByName} from '../utils/utils'
import './check_success.scss'

var list=[]
export default class checksuccess extends Component {
    config = {
        navigationBarTitleText: '入住成功',
    }
    state = {
        checkSuccess: null,
        newid: '',
        current:2,
        getinfo:null
    }
    componentWillMount() {
        if (this.$router.params.num === '8') {
            this.setState({newid:this.$router.params.newid},()=>{this.checkin()})
         list = [...list,JSON.parse(this.$router.params.checksuccess)]
        } else {
            list = JSON.parse(this.$router.params.checksuccess)
        }
        this.setState({ checkSuccess: list })
        Taro.getStorage({key:'getInfo'}).then(res=>{this.setState({getinfo:res.data})})
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
        const items = [
            { 'title': '房间选择' },
            { 'title': '登记确认' },
            { 'title': '登记成功' }
        ]
        if (this.state.getinfo) {
                var card = this.state.getinfo.certNo.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
        }
        return (
            <View>
                <View style='background:#fff;margin-bottom:5px'>
                    <AtSteps
                        items={items}
                        current={this.state.current}
                        onChange={this.onChange}
                    />
                </View>
                <View style='padding:40px 0;background:#fff'>
                    <View className='at-row at-row__justify--center' style='padding-bottom:10px'>
                        <View className='at-col at-col-5  at-col__offset-2' style='font-size:24px'>登记成功</View>
                    </View>
                    <View className='at-row at-row__justify--center'>
                        <View className='at-col at-col-5' style='font-size:16px'>请去线下自助机拿房卡入住</View>
                    </View>
                </View>
                <View className='at-row at-row__justify--between at-article'>
                    <View className='at-col at-col-5 at-article__p' style='padding:5px 0px'>登记信息</View>
                    <View className='at-col at-col-5 at-article__p' style='border:1px solid rgb(97, 144, 232);padding:5px 0px 5px 35px;border-radius:5px;color:rgb(97, 144, 232);background:#fff' onClick={this.add}>
                        添加入住人
                    </View>
                </View>
                <AtDivider />
                {/* 入住人信息 */}
                {this.state.checkSuccess ? this.state.checkSuccess.map((item, index) => {
                    console.log(item,'item')
                    if (item.idcard) {
                        var idcard = item.idcard.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
                    } 
                    return <View className='at-article' style='background:#fff;padding:10px 0px'>
                        <Text className='at-article__p'>{noPassByName(item.name)}</Text>
                        <Text className='at-article__info' style='border-left:1px solid #ddd'></Text>
                        <Text className='at-article__p'>{noPassByMobile(item.mobile)}</Text>
                        <View className='at-article__p'>{index === 0 ? `证件号码：${card}` : `证件号码：${idcard}` }</View>
                    </View>
                }) : null}
                <View style='margin:30px 20px 0 20px'>
                    <AtButton type='secondary' onClick={() => {
                        Taro.navigateBack({ delta: 100 })
                    }}>返回首页</AtButton>
                </View>



                {/* <View style='margin-top:50px'>
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
                </View> */}
            </View>
        )
    }
}