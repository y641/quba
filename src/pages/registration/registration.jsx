import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSteps, AtCard, AtSwipeAction, AtButton, AtDivider, AtIcon, AtFloatLayout  } from 'taro-ui'
import './registration.scss'
import { getInfo, regtion,rmnoRoom } from '../utils/AppData'
import { getmoney, searchroom, getorderstr, gettardeno, noPassByName, noPassByMobile } from '../utils/utils'

var list = [];
var newid = []

function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2019-12-18格式 
    var dateSpan,
        tempDate,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
};


//获取两个日期之间所有的日期
Date.prototype.format = function () {
    var s = '';
    var mouth = (this.getMonth() + 1) >= 10 ? (this.getMonth() + 1) : ('0' + (this.getMonth() + 1));
    var day = this.getDate() >= 10 ? this.getDate() : ('0' + this.getDate());
    s += this.getFullYear() + '-'; // 获取年份。
    s += mouth + "-"; // 获取月份。
    s += day; // 获取日。
    return (s); // 返回日期。
};
function getAll(begin, end) {
    var arr = [];
    var ab = begin.split("-");
    var ae = end.split("-");
    var db = new Date();
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
    var de = new Date();
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
    var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
    var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
    for (var k = unixDb; k <= unixDe;) {
        //console.log((new Date(parseInt(k))).format());
        k = k + 24 * 60 * 60 * 1000;
        arr.push((new Date(parseInt(k))).format());
    }
    return arr;
}

export default class Registration extends Component {
    config = {
        navigationBarTitleText: '登记确认',
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
        disabled:false,
        orderMoney: false,
        rmnoCode:''  //房间号
    }
    componentWillMount() {
        if (this.$router.params.num === '1') {
            console.log(this.$router.params,'params')
            list = [JSON.parse(this.$router.params.info)]
            regtion.regtion = list
            this.setState({rmno:this.$router.params.rmno},()=>{console.log(this.state.rmno)})
        }
        else if (this.$router.params.num === '3') {
            list = [...list, JSON.parse(this.$router.params.info)]
            getInfo.list=list
            newid = [...newid, this.$router.params.newid]
            getInfo.newid=newid
            this.setState({ newid })
        }
        this.setState({ getinfo: list, appid: this.$router.params.appid, mobile: this.$router.params.mobile, username: this.$router.params.username, rmnum: this.$router.params.rmnum, sex: this.$router.params.sex })
        this.getPayMoney(list[0].id)
    }
    getPayMoney = (id) => {
        getmoney({ masterId: id }, (res) => {
            console.log(res,'钱')
            if (res.data && res.data.resultCode === 0) {
                this.setState({ money: res.data.resultInfo })
            } else {
                Taro.showToast({ title: '请求失败', icon: 'none' })
            }
        })
    }
    
   
    test = () => {
        Taro.navigateTo({ url: `/pages/add_check/add_check?info=${JSON.stringify(this.state.getinfo[0])}&appid=${this.state.appid}&sex=${this.state.sex}` })
    }
 
  
   
    del = (value) => {
        if (value.text === '删除') {
            Taro.showModal({
                title: '确认删除',
                cancelText: '取消',
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
            this.setState({ isOpened: this.state.isOpened })
        }
    }
    statusOrder = () => {
        this.setState({ orderMoney: !this.state.orderMoney })
    }


    submitOrder = () => {
        Taro.navigateTo({ url: `/pages/paymentpage/paymentpage?appid=${this.state.appid}&getinfo=${JSON.stringify(this.state.getinfo)}`})
    }

    render() {
        Taro.getStorage({key:'rmnoCode'}).then(res=>this.setState({rmnoCode:res.data}))
        const items = [
            { 'title': '房间选择' },
            { 'title': '登记确认' },
            { 'title': '登记成功' }
        ]
        if (this.state.getinfo) {
            //按日期计算房晚
            var start = this.state.getinfo[0].arr.slice(0, 10)
            var end = this.state.getinfo[0].dep.slice(0, 10)
            //截取日期的月和日
            var timerStart = this.state.getinfo[0].arr.slice(5, 10)
            var timerEnd = this.state.getinfo[0].dep.slice(5, 10)
            //按日期判断周几
            var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            var myDate = new Date(Date.parse(start));
            var myWeek = new Date(Date.parse(end));
            var week = weekDay[myDate.getDay()]
            var weekDate = weekDay[myWeek.getDay()]
            //两个日期之间的所有日期
            var timeData = getAll(start,end)
        }
        return (
            <View>
                <View className='registration'>
                    <AtSteps
                        items={items}
                        current={this.state.current}
                    />
                    <AtCard>
                        <View className='at-article' style='padding:5px'>
                            <Text >绿云大酒店</Text>
                        </View>
                        <View className='at-article'>
                            <Text className='at-article ' style='padding:5px'>抵离日期：{this.state.getinfo ? timerStart + '/' + week : null}~{this.state.getinfo ? timerEnd + '/' + weekDate : null}</Text>
                            <Text className='at-article' style='padding-left:20px'>共{start && end ? datedifference(start, end) : null}晚</Text>
                        </View>
                        <View>房号：{this.state.rmnoCode}</View>
                        <View style='padding:5px'>地址：浙江省杭州市拱墅区登云阁</View>
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
                            <AtSwipeAction isOpened={this.state.isOpened} disabled={index === 0 ? this.state.disabled : null} onClick={this.del} options={[
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
                    <View
                        style='padding:15px;background:#fff;margin-top:165px'>
                        <Text style='padding-left:10px;color:red'>{this.state.money.nonPay ? `￥${this.state.money.nonPay}` :null}</Text>
                        <Text style='padding-left:50px' onClick={this.statusOrder}>
                            明细
                            <Text>
                                <AtIcon value='chevron-down' size='30' color='#ddd'></AtIcon>
                            </Text>
                        </Text>
                        <Text style='margin-left:30px;padding:5px 30px;background:rgb(97, 144, 232);border-radius:30px;color:#fff' onClick={this.
                            submitOrder}>提交订单</Text>
                    </View>
                    {this.state.orderMoney ? (
                        <View>
                            <AtFloatLayout isOpened>
                                <View style='padding:10px'>
                                    <Text className='at-article__h2'>费用明细</Text>
                                    <Text className='at-article__h2' style='padding-left:148px;color:red'>￥{this.state.money.rsvDeposit}</Text>
                                </View>
                                <AtDivider />
                                {timeData ? timeData.map(item => {
                                    return <View>
                                        <View style='padding:10px 10px 0 10px'>
                                            <Text className='at-article__h3'>{item}</Text>
                                            <Text className='at-article__h3' style='padding-left:150px'>￥{this.state.money.rsvDeposit}</Text>
                                        </View>
                                    </View>
                                }) : null}
                                <View style='padding:10px'>
                                    <Text className='at-article__h3'>押金</Text>
                                    <Text className='at-article__h3' style='padding-left:196px'>￥{this.state.money.rsvDeposit}</Text>
                                </View>
                             </AtFloatLayout>
                        </View>
                    ) : null}
                </View>
            </View>
        )
    }
}