'use strict';


var sha256 = require('sha256');
const util = require('util'); // show object


var PARTNER_CODE =require('./config').PARTNER_CODE;  //get PARTNER_CODE and CREDENTIAL_CODE
var CREDENTIAL_CODE =require('./config').CREDENTIAL_CODE;


/**
 *
 * 数据对象基础类，该类中定义数据类最基本的行为，包括：
 * 计算/设置/获取签名、输出json格式的参数、从json读取数据对象等
 * @author Nico Chen
 *
 */
class AlphaPayDataBase{
    constructor(){
        this.pathValues = {};
        this.queryValues = {};
        this.bodyValues = {};
    }

    /**
     * 设置随机字符串，不长于30位。推荐随机数生成算法
     * @param string $value
     **/
    setNonceStr(value){
        this.queryValues['nonce_str'] = value;
    }

    /**
     * 获取随机字符串，不长于30位。推荐随机数生成算法的值
     * @return 值
     **/
    getNonceStr(){
        return this.queryValues['nonce_str'];
    }

    /**
     * 判断随机字符串，不长于32位。推荐随机数生成算法是否存在
     * @return true 或 false
     **/
    isNonceStrSet(){
        if(typeof this.queryValues['nonce_str'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 设置时间戳
     * @param long $value
     **/
    setTime(value){
        this.queryValues['time'] = value;
    }

    /**
     * 获取时间戳
     * @return 值
     **/
    getTime(){

        return this.queryValues['time'];
    }

      /**
     * 判断时间戳是否存在
     * @return true 或 false
     **/
    isTimeSet(){
        if(typeof this.queryValues['time'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 设置签名，详见签名生成算法
     * @param string $value
     **/
    setSign(){
        var sign = this.makeSign();
        this.queryValues['sign'] = sign;
        return sign;
    }

    /**
     * 获取签名，详见签名生成算法的值
     * @return 值
     **/
     getSign(){
        return this.queryValues['sign'];
     }

     /**
     * 判断签名，详见签名生成算法是否存在
     * @return true 或 false
     **/
    isSignSet(){
        if(typeof this.queryValues['sign'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 格式化参数格式化成url参数
     */
    toQueryParams(){
        var buff = "";
        //console.log("toqueryParams returlar query values:" + this.queryValues);
        for (var i in this.queryValues){
            if (this.queryValues.hasOwnProperty(i)) {
                buff += i + "=" + this.queryValues[i] + "&";
           }
        }
        //console.log("toqueryParams buff:" + util.inspect(buff,true));

        buff = buff.slice(0,-1);

        return buff;
    }

    /**
     * 格式化参数格式化成json参数
     */

    toBodyParams(){
        return JSON.stringify(this.bodyValues);
    }

        /**
     * 格式化签名参数
     */
    toSignParams(){
        var string = '';
        string += PARTNER_CODE + '&' + this.getTime() +'&' + this.getNonceStr() + '&' + CREDENTIAL_CODE;

        // console.log('data///toSignParams: '+ string);
        return string;
    }

    /**
     * 生成签名
     * @return 签名，本函数不覆盖sign成员变量，如要设置签名需要调用setSign方法赋值
     */
    makeSign(){
        //签名步骤一：构造签名参数
        var string = this.toSignParams();

        //签名步骤三：SHA256加密
        var hash = sha256(string);

        //签名步骤四：所有字符转为小写
        var result = hash.toLowerCase();
        return result;
    }

    /**
     * 获取设置的path参数值
     */
    getPathValues(){
        return this.pathValues;
    }

    /**
     * 获取设置的query参数值
     */
    getQueryValues(){
        return this.queryValues;
    }

    /**
     * 获取设置的body参数值
     */
    getBodyValues(){
        return this.bodyValues;
    }



}

/**
 * 统一下单对象
 * @author Nico Chen
 */
class AlphaPayUnifiedOrder extends AlphaPayDataBase{

    /**
     * 设置商户支付订单号，同一商户唯一
     * @param string $value
     **/
    setOrderId(value){
        this.pathValues['order_id'] = value;
    }

    /**
     * 获取商户支付订单号
     * @return 值
     **/
    getOrderId(){
        return this.pathValues['order_id'];
    }

    /**
     * 判断商户支付订单号是否存在
     * @return true 或 false
     **/
    isOrderIdSet(){
        if(typeof this.pathValues['order_id'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 设置订单标题
     * @param string $value
     **/
    setDescription(value){
        this.bodyValues['description'] = value;
    }

    /**
     * 获取订单标题
     * @return 值
     **/
    getDescription(){
        return this.bodyValues['description'];
    }

    /**
     * 判断订单标题是否存在
     * @return true 或 false
     **/
    isDescriptionSet(){
        if(typeof this.bodyValues['description'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 设置金额，单位为货币最小单位
     * @param string $value
     **/
    setPrice(value){
        this.bodyValues['price'] = value;
    }

    /**
     * 获取金额，单位为货币最小单位
     * @return 值
     **/
    getPrice(){
        return this.bodyValues['price'];
    }

    /**
     * 判断金额是否存在
     * @return true 或 false
     **/
    isPriceSet(){
        if(typeof this.bodyValues['price'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 设置币种代码
     * 默认值: CAD
     * 允许值: CAD, CNY
     * @param string $value
     **/
    setCurrency(value){
        this.bodyValues['currency'] = value;
    }

    /**
     * 获取币种代码
     * 默认值: AUD
     * 允许值: AUD, CNY
     * @return 值
     **/
    getCurrency(){
        return this.bodyValues['currency'];
    }

    /**
     * 判断币种代码是否存在
     * @return true 或 false
     **/
    isCurrencySet(){
        if(typeof this.bodyValues['currency'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

    /**
     * 设置支付通知url,不填则不会推送支付通知
     * @param string $value
     **/
    setNotifyUrl(value){
        this.bodyValues['notify_url'] = value;
    }

    /**
     * 获取支付通知url
     * @return 值
     **/
    getNotifyUrl(){
        return this.bodyValues['notify_url'];
    }

    /**
     * 判断支付通知url是否存在
     * @return true 或 false
     **/
    isNotifyUrlSet(){
        if(typeof this.bodyValues['notify_url'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

      /**
     * 设置操作人员标识
     * @param string $value
     **/
    setOperator(value){
        this.bodyValues['operator'] = value;
    }

      /**
     * 获取操作人员标识
     * @return 值
     **/
    getOperator(){
        return this.bodyValues['operator'];
    }

    /**
     * 判断操作人员标识是否存在
     * @return true 或 false
     **/
    isOperatorSet(){
        if(typeof this.bodyValues['operator'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }





}

class AlphaPayExchangeRate extends AlphaPayDataBase{

}

/**
 * QRCode支付跳转对象
 * @author Nico Chen
 */
class AlphaPayRedirect extends AlphaPayDataBase{
      /**
     * 设置支付成功后跳转页面
     * @param string $value
     **/
    setRedirect(value){
        this.queryValues['redirect'] = value;
    }

    /**
     * 获取支付成功后跳转页面
     * @return 值
     **/
    getRedirect(){
        return this.queryValues['redirect'];
    }

    /**
     * 判断支付成功后跳转页面是否存在
     * @return true 或 false
     **/
    isRedirectSet()
    {
        if(typeof this.queryValues['redirect'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }

}

/**
 * jsapi支付跳转对象
 * @author Nico Chen
 */
class AlphaPayJsApiRedirect extends AlphaPayRedirect{
    setDirectPay(value){
        this.queryValues['directpay'] = value;
    }

    /**
     * 获取是否直接支付
     * @return 值
     **/
    getDirectPay(){
        return this.queryValues['directpay'];
    }

    /**
     * 判断直接支付是否存在
     * @return true 或 false
     **/
    isDirectPaySet(){
        if(typeof this.queryValues['directpay'] === 'undefined'){
            return false;
        }else{
            return true;
        }
    }


}



module.exports.AlphaPayDataBase = AlphaPayDataBase;
module.exports.AlphaPayUnifiedOrder = AlphaPayUnifiedOrder;
module.exports.AlphaPayRedirect = AlphaPayRedirect;
module.exports.AlphaPayExchangeRate = AlphaPayExchangeRate;
module.exports.AlphaPayJsApiRedirect = AlphaPayJsApiRedirect;

