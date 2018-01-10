'use strict';

const util = require('util'); // show object
var express = require('express');
var router = express.Router();
var request = require('request');
var promise = require('promise');
var empty = require('is-empty'); //check if it empty



// var http = require('http');
// var bodyParser = require('body-parser');

var PARTNER_CODE =require('./config').PARTNER_CODE;  //get PARTNER_CODE and CREDENTIAL_CODE
var CREDENTIAL_CODE =require('./config').CREDENTIAL_CODE;
var AlphaPayResults = require('./data').AlphaPayResults;
process.env.TZ = 'America/Vancouver';


class AlphaPayApi{

    /**
     *
     * 汇率查询，nonce_str、time不需要填入
     * @param AlphaPayExchangeRate $inputObj
     * @param int $timeOut
     * @throws AlphaPayException
     * @return $result 成功时返回，其他抛异常
     */
    exchangeRate(inputObj, timeOut){
        timeOut = 10;
        var url = "https://pay.alphapay.ca//api/v1.0/gateway/partners/" + PARTNER_CODE +"/exchange_rate";
        inputObj.setTime(this.getMillisecond());//时间戳
        inputObj.setNonceStr(this.getNonceStr());//随机字符串
        inputObj.setSign();
        return this.getJsonCurl(url, inputObj, timeOut).then(function(response){
            //console.log("api//// inside putJsoncurl object  " + util.inspect(inputObj,true));
            return JSON.parse(response);
        },function(error){
            console.log("ERROR: There is error in getJsonCurl function " + error);
        });
    }

    qrOrder(inputObj, timeOut){
        timeOut = 15;
        var orderId = inputObj.getOrderId();
        // console.log("api//// getorderid  " + orderId);
        var url = "https://pay.alphapay.ca//api/v1.0/gateway/partners/"+ PARTNER_CODE +"/orders/"+orderId;
        // console.log("api////url " + url);
        inputObj.setTime(this.getMillisecond());
        // console.log("api////settime " + util.inspect(inputObj, false, null));
        inputObj.setNonceStr(this.getNonceStr());
        // console.log("api////setNonceStr " + util.inspect(inputObj, false, null));
        inputObj.setSign();
        // console.log("api////setSign " + JSON.stringify(inputObj));
        //console.log("api////bodyvalue " + util.inspect(inputObj,true));
        return this.putJsonCurl(url, inputObj, timeOut).then(function(response){
            //console.log("api/// qrorder inputObj  " + util.inspect(inputObj,true));     
            return JSON.parse(response);
        },function(error){
            console.log("ERROR: There is error in putJsonCurl function  " + error);
        });

    }

    /**
     *
     * JsApi下单，nonce_str、time不需要填入
     * @param AlphaPayUnifiedOrder $inputObj
     * @param int $timeOut
     * @throws AlphaPayException
     * @return $result 成功时返回，其他抛异常
     */

    jsApiOrder(inputObj, timeOut){
        timeOut = 10;
        var partnerCode = PARTNER_CODE;
        var orderId = inputObj.getOrderId();
        var url = "https://pay.alphapay.ca//api/v1.0/wechat_jsapi_gateway/partners/"+ partnerCode + "/orders/" + orderId;
        inputObj.setTime(this.getMillisecond());
        // console.log("api////jsApiOrder settime " + util.inspect(inputObj, false, null));
        inputObj.setNonceStr(this.getNonceStr());
        // console.log("api////jsApiOrder setNonceStr " + util.inspect(inputObj, false, null));
        inputObj.setSign();
        return this.putJsonCurl(url, inputObj, timeOut).then(function(response){
            //console.log("api/// qrorder inputObj  " + util.inspect(inputObj,true));     
            return JSON.parse(response);
        },function(error){
            console.log("ERROR: There is error in putJsonCurl function  " + error);
        });

    }

    
    /**
     *
     * QR支付跳转，nonce_str、time不需要填入
     * @param string $pay_url
     * @param AlphaPayRedirect $inputObj
     * @throws AlphaPayException
     * @return $pay_url 成功时返回，其他抛异常
     */

    getQRRedirectUrl(pay_url, inputObj){
        inputObj.setTime(this.getMillisecond());
        // console.log("api//// getQRRedirectUrl settime " + util.inspect(inputObj, true));
        inputObj.setNonceStr(this.getNonceStr());
        // console.log("api//// getQRRedirectUrl setNonceStr " + util.inspect(inputObj, true));
        inputObj.setSign();
        // console.log("api//// getQRRedirectUrl setSign " + util.inspect(inputObj,true));
        pay_url += '?' + inputObj.toQueryParams();
        return pay_url;
    }

      /**
     *
     * JsApi支付跳转，nonce_str、time不需要填入
     * @param string $pay_url
     * @param AlphaPayJsApiRedirect $inputObj
     * @throws AlphaPayException
     * @return $pay_url 成功时返回，其他抛异常
     */
    getJsApiRedirectUrl(pay_url, inputObj){
        var directPay = inputObj.getDirectPay();
        if (empty(directPay)){
            inputObj.setDirectPay('false');
        }
        inputObj.setTime(this.getMillisecond());
        inputObj.setNonceStr(this.getNonceStr());
        inputObj.setSign();
        console.log("api//// getQRRedirectUrl setsign " + util.inspect(inputObj, true));        
        pay_url += '?' + inputObj.toQueryParams();
        console.log("api//// getQRRedirectUrl psyurl " + pay_url);                
        return pay_url;
    }


    /**
     * 以get方式提交json到对应的接口url
     *
     * @param string $url
     * @param object $inputObj
     * @param int $second url执行超时时间，默认30s
     * @throws AlphaPayException
     */
    getJsonCurl(url, inputObj, second){

        return new Promise(
            function(resolve, reject){
        
            })


        second = 30;
        url +='?'+inputObj.toQueryParams();
        // console.log("get///url in getjsonurl after url + = "+ url);
        // console.log("get///inputObj.toQueryParams  " + inputObj.toQueryParams());
        // console.log("get///inputObj.toBodyParams  " + inputObj.toBodyParams());
        // console.log("get///inputObj.toBodyParams type  " + typeof inputObj.toBodyParams());
        var options = {
            url: url,
            timeout: second*1000,            
            headers: {
                "Accept": "application/json"
            }
        };

        request.get(options,function(error,req,body){
            if (error) {
                console.log('failed:', error);
            }
            // console.log('req::::   '+ JSON.stringify(req));
            //console.log('body::::   '+ JSON.stringify(body));
            //console.log('inputObject inside request put::::   '+ JSON.stringify(inputObj));
            resolve(body);
        });

    }

        /**
     * 以put方式提交json到对应的接口url
     *
     * @param string $url
     * @param object $inputObj
     * @param int $second url执行超时时间，默认30s
     * @throws AlphaPayException
     */
    putJsonCurl(url, inputObj, second){
        return new Promise(
            function(resolve, reject){
                
                url +='?'+inputObj.toQueryParams();
                console.log("url in putjsonurl after url + = "+ url);
                //console.log("inputObj.toQueryParams  " + inputObj.toQueryParams());
                // console.log("inputObj.toBodyParams  " + inputObj.toBodyParams());
                // console.log("inputObj.toBodyParams type  " + typeof inputObj.toBodyParams());
        
                var options = {
                    url: url,
                    body: inputObj.toBodyParams(),
                    timeout: second*1000,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                };
                request.put(options,function(error,req,body){
                    if (error) {
                        console.log('failed:', error);
                    }
                    // console.log('req::::   '+ JSON.stringify(req));
                    //console.log('body::::   '+ JSON.stringify(body));
                    //console.log('inputObject inside request put::::   '+ JSON.stringify(inputObj));
                    resolve(body);
                });
                
            }
        );
    }

      /**
     * 获取毫秒级别的时间戳
     */
    getMillisecond(){
        //获取毫秒的时间戳
        var millisecond = Date.now();
        // console.log("api////millisecond "+millisecond);

        return millisecond;
    }


    /**
     *
     * 产生随机字符串，不长于30位
     * @param int $length
     * @return $str 产生的随机字符串
     */
    getNonceStr(length){
        var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var str = "";
        length  = 30;
        for(var i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // console.log("api/// getNonceStr " + str);
        return str;
    }

    


}
module.exports = AlphaPayApi;
