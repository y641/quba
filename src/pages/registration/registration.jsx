import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtCard, AtSwipeAction, AtButton, AtDivider  } from 'taro-ui'
import './registration.scss'
import {order} from '../utils/AppData'
import { getmoney, searchroom, getorderstr, gettardeno,noPassByName,noPassByMobile} from '../utils/utils'

var list = [];
var newid = []
export default class Registration extends Component {
    config = {
        navigationBarTitleText: '登记确认',
        'usingComponents': {
            'unify-pay': 'plugin://myPlugin/UnifyPay'
        }
    }
    state = {
        current: 1,
        hasBorder: false,
        getinfo: null,  //订单信息
        money: '',  //支付信息
        appid: '', //用户id
        mobile: '',  //手机号
        room: '',  //房间码
        username: '',  //真实姓名
        rmnum: '',
        sex: '',
        newid: null,
        isOpened: false,
        disabled:'disabled'
    }
    componentWillMount() {
        if (this.$router.params.num === '1') { list = [JSON.parse(this.$router.params.info)] }
        else if(this.$router.params.num==='3'){
            list = [...list, JSON.parse(this.$router.params.info)]
            newid = [...newid,this.$router.params.newid]
            this.setState({newid})
        }
        this.setState({ getinfo: list, appid: this.$router.params.appid, mobile: this.$router.params.mobile, username: this.$router.params.username, rmnum: this.$router.params.rmnum ,sex:this.$router.params.sex})
        this.getPayMoney(list[0].id)
    }
    getPayMoney = (id) => {
        getmoney({ masterId: id }, (res) => {
            if (res.data && res.data.resultCode === 0) {
                    this.setState({ money: res.data.resultInfo })
            } else {
                Taro.showToast({title:'请求失败',icon:'none'})
                }
        })
    }
    list = () => {
        //查询可用房间
        searchroom({
            rmtype: this.state.getinfo[0].rmtype,
            arr: this.state.getinfo[0].arr,
            dep: this.state.getinfo[0].dep
        }, (res) => {
                if (res.data && res.data.resultInfo.length > 0) {

                    Taro.navigateTo({ url: `/pages/success/success?info=${JSON.stringify(this.state.getinfo)}&rmno=${res.data.resultInfo[0].rmno}&newid=${JSON.stringify(this.state.newid)}` })
                } else if (res.data.resultInfo.length === 0) {
                    Taro.navigateTo({url:'/pages/without/without'})
                } else {
                    Taro.showToast({title:'请求失败',icon:'none'})
                }
        })
    }
    //唤起收银台
    success = (trade) => {
        my.tradePay({
            tradeNO: trade,
            success: (res) => {
                if (res.result && res.memo === "") {
                    order.status = 1
                    this.list()
                }
            },
            fail: () => {
                Taro.showToast({
                    title: '请求失败',
                    icon: 'none'
                })
                return
            }
        });
    }
    test = () => {
        Taro.navigateTo({ url: `/pages/add_check/add_check?info=${JSON.stringify(this.state.getinfo[0])}&appid=${this.state.appid}&sex=${this.state.sex}` })
    }
    orderStr = (order) => {
        my.tradePay({
            orderStr:order,
            success: (res) => {
                if (res.result && res.memo === "") {
                    order.status = 1
                   this.list()
                }
            },
            fail: () => {
                Taro.showToast({
                    title: '请求失败',
                    icon: 'none'
                })
                return
            }
        });
    }
    getOrder (e) {
        if (e.preFreeze) {
            getorderstr({
                masterId: this.state.getinfo[0].id,
                subject: this.state.getinfo[0].rmtype,
                // totalFee: this.state.money.nonPay,
                totalFee: 0.01,
                isPreFreeze: 'T',
                buyerId: this.state.appid
            }, (res) => {
                    if (res.data && res.data.resultCode === 0) {
                        this.orderStr(res.data.resultInfo) 
                    } else {
                        Taro.showToast({title:'请求失败',icon:'none'})
                    }
            })
        } else {
            this.TradeNo()
        }
    }
    TradeNo = () => {
        gettardeno({
            masterId: this.state.getinfo[0].id,
            subject: this.state.getinfo[0].rmtype,
            totalFee: 0.01,
            // totalFee: this.state.money.nonPay,
            buyerId: this.state.appid
        }, (res) => {
                if (res.data && res.data.resultCode === 0) {
                    this.success(res.data.resultInfo)
                } else {
                    Taro.showToast({title:'请求失败',icon:'none'})
                }
        })  
    }
    del = (value) => {
        if (value.text === '删除') {
            Taro.showModal({
                title: '确认删除',
                cancelText:'取消',
                success: res => {
                    if (res.confirm) {
                        Taro.showToast({ title: '删除成功', icon: 'none' })
                        this.setState({ isOpened: this.state.isOpened })
                    } else {
                        this.setState({ isOpened: this.state.isOpened })
                    }
                }
            })
        } else {
            this.setState({ isOpened:this.state.isOpened}) 
        }
    }
    render() {
        const items = [
            { 'title': '房间选择' },
            { 'title': '登记确认' },
            { 'title': '登记成功' }
        ]
        return (
            <View>
                <View className='registration'>
                    <AtSteps
                        items={items}
                        current={this.state.current}
                    />
                    <AtCard>
                        <View className='at-article '>
                            <Text >绿云大酒店</Text>
                        </View>
                        <View className='at-article '>
                            <View className='at-article '>入住：{this.state.getinfo && this.state.getinfo[0].arr}</View>
                            <View className='at-article '>离店：{this.state.getinfo && this.state.getinfo[0].dep}
                            </View>
                        </View>
                    </AtCard>
                    <View className='at-row at-row__justify--between' style='margin:15px 0'>
                        <View className='at-col at-col-5' style='padding:8px 0 0 15px;font-size:0.35rem'>入住人</View>
                        <View className='at-col at-col-5' onClick={this.test}>
                            <AtButton type='primary' size='small'>添加同住人</AtButton>
                        </View>
                    </View>
                    <AtDivider lineColor='#ddd' />
                    {this.state.getinfo ? this.state.getinfo.map((item, index) => {
                        if (item.idNo) {
                            var idcard = item.idNo.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
                        } else {
                            var card = item.idcard.replace(/^(.{4})(?:\d+)(.{4})$/, "$1******$2")
                        }
                        
                        return <View key={index} className='normal' style='padding-top:10px'>
                            <AtSwipeAction isOpened={this.state.isOpened} disabled={index === 0 ? this.state.disabled :null}  onClick={this.del} options={[
                                    {
                                        text: '取消',
                                        style: {
                                            backgroundColor: '#6190E8'
                                        }
                                    },
                                    {
                                        text: '删除',
                                        style: {
                                            backgroundColor: '#FF4949'
                                        }
                                    }
                                ]}>
                                <View style='padding:8px 0 3px 10px'>{index === 0 ? '入住人' : '同住人'}：{noPassByName(item.name)}</View>
                                <View style='padding:8px 0 3px 10px'>手机号：{noPassByMobile(item.mobile || this.state.mobile)}</View>
                                <View style='padding:8px 0 3px 10px'>身份证：{idcard || card}</View>
                                </AtSwipeAction>
                            </View>
                    }) : null}
                    <View style="margin:20px 10px 0 10px;">
                        <unify-pay
                            userId={this.state.appid}
                            serviceId='2019122400000000000003655000'
                            onClick={this.getOrder.bind(this)}
                        />
                    </View>
                </View>
            </View>
        )
    }
}