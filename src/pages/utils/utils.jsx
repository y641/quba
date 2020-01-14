import Taro, { Component } from '@tarojs/taro'
const head = {
    header: {
        'Content-Type': 'application/json',
        'x-authorization': '331bf2cb743368b4a0d01e0ac8b26332',
    },
     method: 'POST',
    dataType: 'json',
}
const url ='https://openapidev.ipms.cn/igroup/edbg/'
const dataConfig = {
    "hotelGroupCode": "EDBG",
    "hotelCode": "EDB1",
}


function getNowTime() {
    // 加0
    function add_10(num) {
        if (num < 10) {
            num = '0' + num
        }
        return num;
    }
    var myDate = new Date();
    myDate.getYear(); //获取当前年份(2位)
    myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    myDate.getDate(); //获取当前日(1-31)
    myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
    myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
    myDate.getHours(); //获取当前小时数(0-23)
    myDate.getMinutes(); //获取当前分钟数(0-59)
    myDate.getSeconds(); //获取当前秒数(0-59)
    myDate.getMilliseconds(); //获取当前毫秒数(0-999)
    myDate.toLocaleDateString(); //获取当前日期
    var nowTime = myDate.getFullYear() + '-' + add_10(myDate.getMonth()) + '-' + myDate.getDate() + ' ' + add_10(myDate.getHours()) + ':' + add_10(myDate.getMinutes()) + ':' + add_10(myDate.getSeconds());
    return nowTime;
}
export function Img(params, success) {
    Taro.request({
        url: url + '/openapi/v1/order/order/getroomdetail',
        ...head,
        data: {
            ...dataConfig,
            arr: params.arr
        },
        success: (res) => {
            if (res) {
                success(res)
            }
        }
    })
}
//拆分成员单
export function SplitMember(params, success, fail) {
    Taro.request({
        url: url+'openapi/v1/order/src/split/one',
       ...head,
        data: {
           ...dataConfig,
            mobile: params.mobile,
            rsvSrcId: params.rsvSrcId,
            name: params.name,
            idNo: params.idNo,
            sex: params.sex,
            idCode: params.idCode,
        },
       
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}
//小程序授权
export function info(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/getauthbuyerid',
        ...head,
        data: {
            ...dataConfig,
            authCode: params.authCode
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}

//获取用户信息
export function getuserinfo(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/getuserinfobyaccesstoken',
        ...head,
        data: {
            ...dataConfig,
            accessToken:params.accessToken
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}

//身份证查询成员单
export function inquiry(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/list',
        ...head,
        data: {
            ...dataConfig,
            idCode: params.idCode,
            idNo: params.idNo
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}

//姓名查询成员单
export function findname(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/list',
        ...head,
        data: {
            ...dataConfig,
            name:params.name
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//手机号查询成员单
export function findphone(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/list',
        ...head,
        data: {
            ...dataConfig,
            mobile:params.mobile
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//身份证查询预订单
export function findsubscribecard(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/only/list',
        ...head,
        data: {
            ...dataConfig,
            idCode: params.idCode,
            idNo: params.idNo
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//姓名查询预订单
export function findsubscribename(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/only/list',
        ...head,
        data: {
            ...dataConfig,
            rsvMan: params.rsvMan
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//手机号查询预订单
export function findsubscribephone(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/only/list',
        ...head,
        data: {
            ...dataConfig,
            mobile: params.mobile
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//押金
export function getmoney(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/rmfee/nonpay',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//查询可用房间
export function searchroom(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/avail/rmno/list',
        ...head,
        data: {
            ...dataConfig,
            rmtype: params.rmtype,
            arr: params.arr,
            dep:params.dep
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//添加同住人
export function addperson(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/src/masteradd',
        ...head,
        data: {
            ...dataConfig,
            name: params.name,
            sex:params.sex,
            idCode: params.idCode,
            idNo: params.idNo,
            mobile:params.mobile,
            masterId:params.masterId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 


//获取orderstr

export function getorderstr(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/getunifypay',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
            subject: params.subject,
            totalFee: params.totalFee,
            isPreFreeze: params.isPreFreeze,
            buyerId: params.buyerId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 


//获取tardeNo
export function gettardeno(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/alipay/gettradeno',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
            subject: params.subject,
            totalFee: params.totalFee,
            isPreFreeze: params.isPreFreeze,
            buyerId: params.buyerId
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//成员单排房
export function shotgunhouse(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/rmno/assign',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
            rmno: params.rmno
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
} 

//成员登记单入住
export function checkperson(params, success, fail) {
    Taro.request({
        url: url + 'openapi/v1/order/item/checkin',
        ...head,
        data: {
            ...dataConfig,
            masterId: params.masterId,
        },
        success: res => {
            if (res) {
                success(res)
            }
        },
        fail: (err) => {
            if (err) {
                fail(err)
            }
        }
    })
}


//手机号脱敏
export function noPassByMobile(str) {
    if (null != str && str != undefined) {
        var pat = /(\d{3})\d*(\d{2})/;
        return str.replace(pat, '$1******$2');
    } else {
        return "";
    }
}

//姓名脱敏
export function noPassByName(str) {
    if (null != str && str != undefined) {
        if (str.length <= 3) {
            return "*" + str.substring(1, str.length);
        } else if (str.length > 3 && str.length <= 6) {
            return "**" + str.substring(2, str.length);
        } else if (str.length > 6) {
            return str.substring(0, 2) + "****" + str.substring(6, str.length)
        }
    } else {
        return "";
    }
}

//验证身份证号的真实性
export function IdentityCodeValid(code) {
    var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
    var tip = "";
    var pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        tip = "身份证号格式错误";
        pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
        tip = "地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                tip = "校验位错误";
                pass = false;
            }
        }
    }
    return pass;
}
