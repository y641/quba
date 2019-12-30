import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtSegmentedControl, AtButton, AtInput, AtForm } from 'taro-ui'
import '../mate.scss'

export default class Mate extends Component {
    config = {
        navigationBarTitleText: '信息匹配',
    }
    state = {
        cuurent: 0,
        mate: '',
        phone:''
    }
    handleClick=(value)=> {
        this.setState({
            current: value
        })
    }
    handleChange = (value) => {
        this.setState({ mate: value})
    }
    doChange = () => {
        this.setState({phone:value})
    }
    render() {
        return (
            <View style='padding-top:20px'>
                <View>
                    <AtSegmentedControl
                        values={['预订单号', '手机号码']}
                        onClick={this.handleClick}
                        current={this.state.current}
                    />
                    {
                        this.state.current === 0
                            ? <View className='tab-content'>
                                <AtForm>
                                    <AtInput
                                        style='height:300px'
                                        name={this.state.mate}
                                        type='number'
                                        placeholder='请输入预订确认号'
                                        value={this.state.mate}
                                        onChange={this.handleChange}
                                    />
                                </AtForm>
                            </View>
                            : null
                    }
                    {
                        this.state.current === 1
                            ? <View className='tab-content'>
                                <AtForm>
                                    <AtInput
                                        style='height:300px'
                                        name={this.state.phone}
                                        type='phone'
                                        placeholder='预订手机后4位'
                                        value={this.state.phone}
                                        onChange={this.doChange}
                                    />
                                </AtForm>
                            </View>
                            : null
                    }
                </View>
                <View style='margin:100px 20px 0 20px'>
                    <AtButton type='primary'>确认匹配</AtButton>
                </View>
            </View>
        )
    }
}