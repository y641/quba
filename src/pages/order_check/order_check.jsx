import Taro, { Component, initPxTransform } from '@tarojs/taro'
import { View, Text, } from '@tarojs/components'
import { AtSteps, AtCard, AtButton} from 'taro-ui'
import './order_check.scss'
import { SplitMember } from '../utils/utils'

export default class Index extends Component {
    config = {
        navigationBarTitleText: '订单核对',
    }
    state = {
        current: 0,
        icon: '#ff0',
        checkcircle: '#f0f',
        iconcheck: true,
        getinfo: null, //订单信息
        appid: null,  //userid
        mobile: '', //手机号
        username: '', //真实姓名
        idcard: '', //身份证号码
        list: null,
        info: null,
        sex: '',
        item: null,
        currentIndex: '-1',
        resultInfo: null
    }
    componentWillMount() {
        let list = [...JSON.parse(this.$router.params.info)]
        this.setState({ order: list, appid: this.$router.params.appid, mobile: this.$router.params.mobile, username: this.$router.params.username, idcard: this.$router.params.idcard, sex: this.$router.params.sex })
    }
    choose = () => {
        if (this.state.currentIndex >= 0) {
            Taro.navigateTo({ url: `/pages/mate/mate?info=${JSON.stringify(this.state.item)}&appid=${this.state.appid}&mobile=${this.state.mobile}&username=${this.state.username}&num=1&sex=${this.state.sex}&idcard=${this.state.idcard}` })
        } else {
            Taro.showToast({
                title: '请选择',
                icon: 'none'
            })
        }
    }
    getContainer = () => {

    }
    textContent = (item, index) => {
        this.setState({ item, currentIndex: index })
    }
    handle = () => {
        if (this.state.currentIndex >= 0) {
            if (this.state.item.rsvSrcId) {
                let gender = ''
                this.state.sex === 'f' ? gender = '女' : gender = '男'
                //拆分订单
                SplitMember({
                    mobile: this.state.item.mobile,
                    rsvSrcId: this.state.item.rsvSrcId,
                    name: this.state.item.rsvMan,
                    idNo: this.state.idcard,
                    sex: gender,
                    idCode: '01'
                }, (res) => {
                        if (res.data && res.data.resultCode === 0) {
                            Taro.navigateTo({
                                url: `/pages/registration/registration?info=${JSON.stringify(res.data.resultInfo)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1&sex=${this.state.sex}`
                            })
                        } else {
                            Taro.showToast({title:'请求失败',icon:'none'})
                    }
                })
            } else {
                Taro.navigateTo({
                    url: `/pages/registration/registration?info=${JSON.stringify(this.state.item)}&sex=${this.state.sex}&appid=${this.state.appid}&idNo=${this.state.idcard}&num=1`
                })
            }
        } else {
            Taro.showToast({
                title: '请选择',
                icon: 'none'
            })
        }
    }
    render() {
        const items = [
            { 'title': '房间选择' },
            { 'title': '登记确认' },
            { 'title': '登记成功' }
        ]
        const {mobile}=this.state
        return (
            <View className='order_check'>
                {/* 步骤条 */}
                <AtSteps
                    items={items}
                    current={this.state.current}
                    onChange={()=>{}}
                />
                {/* 预定信息 */}
                {this.state.order ? this.state.order.map((item, index) => {
                    return (
                        <View className='post'>
                            <AtCard
                                title={index === 0 ? '请选择预订信息' : null}
                                onClick={this.textContent.bind(this, item, index)}
                            >
                                <View>
                                    <Text className='at-article'>预定人：{item.rsvMan}</Text>
                                    <Text className='at-article ditch'>预定渠道：飞猪</Text>
                                </View>
                                <View>
                                    <icon type="success" size='30' className='icon' color={index === this.state.currentIndex ? '#6190E8' : '#ddd'} />
                                </View>
                                <View className='at-article'>联系电话：{item.mobile || mobile}</View>
                                <View className='at-article'>入住日期：{item.arr}</View>
                                <View className='at-article'>离店日期：{item.dep}</View>
                                <View className='at-article'>入住房型：{item.rmtype}</View>
                                <View className='at-article'>房间数量：共{item.rmnum}间</View>
                            </AtCard>
                        </View>
                    )
                }) : null}
                {this.state.order &&  this.state.order.length===1 ? <View className='at-article'>
                    <AtButton type='primary' onClick={this.handle}>确认选择</AtButton>
                </View> : <View className='at-article'>
                        <AtButton type='primary' onClick={this.choose}>确认选择</AtButton>
                    </View>}
            </View>
        )
    }
}