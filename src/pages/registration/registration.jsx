import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtCard } from 'taro-ui'
import './registration.scss'
import { getmoney, searchroom, getorderstr, gettardeno} from '../utils/utils'

var list = [];
export default class Index extends Component {
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
        sex:''
    }
    componentWillMount() {
        console.log(this.$router.params,'B')
        if (this.$router.params.num === '1') { list = [JSON.parse(this.$router.params.info)] }
        else { list = [...list, JSON.parse(this.$router.params.info)]}
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
                    Taro.navigateTo({ url: `/pages/success/success?info=${JSON.stringify(this.state.getinfo)}&rmno=${res.data.resultInfo[0].rmno}` })
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
                console.log(res, '唤起收银台')
                if (res.result && res.memo === "") {
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
    render() {
        const items = [
            { 'title': '房间选择' },
            { 'title': '登记确认' },
            { 'title': '登记成功' }
        ]
        return (
            <View>
                <View className='registration'>
                    {/* 步骤条 */}
                    <AtSteps
                        items={items}
                        current={this.state.current}
                    />
                    {/* 登记确认 */}
                    <AtCard>
                        <View className='at-article '>
                            <Text >绿云大酒店</Text>
                        </View>
                        <View className='at-article '>
                            <View className='at-article '>入住：{this.state.getinfo[0].arr}</View>
                            <View className='at-article '>离店：{this.state.getinfo[0].dep}
                                {/* <Text className='at-article disth'>共{this.stata.rmnum}晚</Text> */}
                            </View>
                        </View>
                    </AtCard>
                    <View className='at-article'>
                        <Text className='at-article__h3 at-article'>入住人</Text>
                        <Text className='person at-article ' onClick={this.test}>添加同住人</Text>
                    </View>
                    <View className='line'></View>
                    {/* 同住人信息 */}
                    {this.state.getinfo && this.state.getinfo.map((item, index) => {
                        return <View>
                            <View className='at-article__p'>{index===0 ? '入住人' : '同住人'}：{item.name}</View>
                            <View className='at-article__p'>手机号：{(item.mobile || this.state.mobile) ? (item.mobile || this.state.mobile) : null}</View>
                            <View className='at-article__p'>身份证：{item.idNo || item.idcard}</View>
                            <View className='line'></View>
                        </View>
                    })}
                    {/* 费用明细 */}
                    <View style="margin:30px 10px 0 10px;">
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