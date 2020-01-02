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
        switch: false,
        content:''
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
        this.setState({switch:value})
    }
    doChange = value => {
        this.setState({content:value})
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
                                    <Picker mode='date' onChange={this.onDateChange}>
                                        <View className='picker at-article' style='margin:0 0.3rem;padding:10px 0;border-bottom:1px solid #ddd'>
                                            <Text className='at-article__p'>日期</Text>
                                            <Text className='at-article__p' style='color:#000;font-weight:400;margin-left:60px'>请选择日期</Text>
                                        </View>
                                    </Picker>
                                </View>
                            </View>
                            <View className='page-section'>
                                <View>
                                    <Picker mode='time' onChange={this.onTimeChange}>
                                        <View className='picker at-article' style='margin:0 0.3rem;padding:10px 0;border-bottom:1px solid #ddd'>
                                            <Text className='at-article__p'>时间</Text>
                                            <Text className='at-article__p' style='color:#000;font-weight:400;margin-left:60px'> 请选择时间</Text>
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
                            switch} onChange={this.doHandle} />
                    </AtForm>
                </View>
                <View>
                    {this.state.switch ? (
                        <View>
                            <AtForm>
                                <AtInput
                                    title='密码'
                                    type='password'
                                    placeholder='密码不能少于10位数'
                                    onChange={() => { }}
                                /></AtForm>
                        </View>
                    ) : null }
                </View>
                <View style='margin:30px 5px 0 5px'>
                    <AtButton type='primary'>确定</AtButton>
                </View>
            </View>
        )
    }
}