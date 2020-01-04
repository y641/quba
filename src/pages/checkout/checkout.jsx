import Taro from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtTextarea, AtInput, AtForm, AtSwitch, AtButton } from 'taro-ui'
import './out.scss'

export default class checkout extends Taro.Component {
    config = {
        navigationBarTitleText: '预约退房',
    }
    state = {
        border: false,
        value:'' , //备注信息
        haha: false,
        content: '', 
        selector: ['专票/普票','发票'],
        selectorChecked: '专票/普票',
        Head: '',  //发票抬头
        dateSel: '请选择日期',
        timeSel: '请选择时间',
        duty: '',  //税号
        address: '', //地址
        phone: '',//电话号码
        bank: '', //开户行
        account: '',//银行账号
        other:'' //其他说明信息
    }
    onTimeChange = e => {
        this.setState({
            timeSel: e.detail.value
        })
    }
    onDateChange = e => {
        this.setState({
            dateSel: e.detail.value
        })
    }
    handleChange = value => {
        this.setState({ value })
    }
    doHandle = value => {
        this.setState({haha:value})
    }
    doChange = value => {
        this.setState({content:value})
    }
    invoiceType = (e) => {
        this.setState({
            selectorChecked: this.state.selector[e.detail.value]
        })
    }
    invoiceHead = (value) => {
        this.setState({
            invoiceHead:value
        })
    }
    dutyParagraph = (value) => {
        this.setState({ duty:value})
    }
    unitAddress = (value) => {
        this.setState({address:value})
    }
    getPhone = (value) => {
        this.setState({phone:value})
    }
    bankDeposit = (value) => {
        this.setState({bank:value})
    }
    bankAccount = (value) => {
        this.setState({ account:value })
    }
    getOther = (value) => {
        this.setState({other:value})
    }
    drawBill = () => {
        console.log('开发票')
    }
    NotdrawBill = () => {
        console.log('不开发票')
    }
    render() {
        return (
            <View>
                <View style='background:#fff;'>
                    <View className='at-article__p' style='border-bottom:1px solid #ddd;font-weight:600;padding:12px;color:#000;font-size:0.4rem'>退房</View>
                    <View className='container'>
                        <View className='page-body'>
                            <View className='page-section'>
                                <View>
                                    <Picker mode='date' value={this.state.timeSel} onChange={this.onDateChange}>
                                        <View className='picker at-article' style='margin:0 0.3rem;padding:10px 0;border-bottom:1px solid #ddd'>
                                            <Text className='at-article__p'>日期</Text>
                                            <Text className='at-article__p' style='color:#000;font-weight:400;margin-left:60px'>{this.state.dateSel}</Text>
                                        </View>
                                    </Picker>
                                </View>
                            </View>
                            <View className='page-section'>
                                <View>
                                    <Picker mode='time' onChange={this.onTimeChange}>
                                        <View className='picker at-article' style='margin:0 0.3rem;padding:10px 0;border-bottom:1px solid #ddd'>
                                            <Text className='at-article__p'>时间</Text>
                                            <Text className='at-article__p' style='color:#000;font-weight:400;margin-left:60px'> {this.state.timeSel}</Text>
                                        </View>
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className='at-article__p' style='padding:0px 13px 8px 13px;'>备注</View>
                    <AtTextarea
                        style='width:70%'
                        value={this.state.content}
                        onChange={this.doChange}
                        maxLength={200}
                        placeholder='备注信息（非必填项)'
                        placeholderStyle='color:#000;font-weight:400;font-size:0.3rem'
                    >
                    </AtTextarea>
                </View>
                <View style='margin-top:20px;background:#fff'>
                    <AtForm>
                        <AtSwitch title='申请开票' checked={this.state.
                            haha} onChange={this.doHandle} />
                    </AtForm>
                </View>
                <View>
                    {this.state.haha ? (
                        <View style='margin-top:10px'>
                            <AtForm>
                                <View className='container'>
                                    <View className='page-body'>
                                        <View className='page-section'>
                                            <View>
                                                <Picker mode='selector' range={this.state.selector} onChange={this.invoiceType}>
                                                    <View className='picker at-article' style='padding:10px 0;border-bottom:1px solid #ddd'>
                                                        <Text className='at-article__p' style='color:#000'>发票类型</Text>
                                                        <Text className='at-article__p' style='color:#000;font-weight:400;margin-left:60px'>{this.state.selectorChecked}</Text>
                                                    </View>
                                                </Picker>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <AtInput
                                    name='invoiceHead'
                                    title='抬头'
                                    type='text'
                                    placeholder='发票抬头（必填）'
                                    value={this.state.head}
                                    onChange={this.invoiceHead}
                                />
                                <AtInput
                                    name='duty'
                                    title='税号'
                                    type='text'
                                    placeholder='税号或社会信用代码（必填）'
                                    value={this.state.duty}
                                    onChange={this.dutyParagraph}
                                />
                                <AtInput
                                    name='address'
                                    title='单位地址'
                                    type='text'
                                    placeholder='单位地址（必填）'
                                    value={this.state.address}
                                    onChange={this.unitAddress}
                                />
                                <AtInput
                                    name='phone'
                                    title='电话号码'
                                    type='phone'
                                    placeholder='电话号码（必填）'
                                    value={this.state.phone}
                                    onChange={this.getPhone}
                                />
                                <AtInput
                                    name='bank'
                                    title='开户行'
                                    type='text'
                                    placeholder='开户行（必填）'
                                    value={this.state.bank}
                                    onChange={this.bankDeposit}
                                />
                                <AtInput
                                    name='account'
                                    title='银行账号'
                                    type='number'
                                    placeholder='银行账号（必填）'
                                    value={this.state.account}
                                    onChange={this.bankAccount}
                                /><AtInput
                                    name='other'
                                    title='其他'
                                    type='text'
                                    placeholder='若您有其他说明信息请填写'
                                    value={this.state.other}
                                    onChange={this.getOther}
                                />
                            </AtForm>
                        </View>
                    ) : null }
                </View>
                <View style='margin:30px 5px 0 5px'>
                    {this.state.haha ? <AtButton type='primary' onClick={this.drawBill}>确定</AtButton> : <AtButton type='primary' onClick={this.NotdrawBill}>确定</AtButton>}
                </View>
            </View>
        )
    }
}