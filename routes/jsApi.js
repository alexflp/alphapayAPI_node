var express = require('express');
var router = express.Router();
const util = require('util'); // show object
var empty = require('is-empty'); //check if it empty
var urlencode = require('urlencode'); // encode URIcompment


var PARTNER_CODE =require('../lib/config').PARTNER_CODE;  //get PARTNER_CODE and CREDENTIAL_CODE
var CREDENTIAL_CODE =require('../lib/config').CREDENTIAL_CODE
process.env.TZ = 'America/Vancouver';


var AlphaPayApi = require('../lib/api');
var AlphaPayUnifiedOrder = require('../lib/data').AlphaPayUnifiedOrder;
var AlphaPayJsApiRedirect = require('../lib/data').AlphaPayJsApiRedirect;



var p = new AlphaPayApi;
var input = new AlphaPayUnifiedOrder;
var time = new Date();
input.setOrderId(PARTNER_CODE + time);
input.setDescription("test");
input.setPrice("1");
input.setCurrency("CAD");
input.setNotifyUrl("https://pay.alphapay.ca/notify_url");
input.setOperator("123456");
var currency = input.getCurrency();
if(!empty(currency) && currency == 'CNY'){

  var inputRate = new AlphaPayExchangeRate();

  p.exchangeRate(inputRate).then(function(rate){
    if(rate['return_code'] == 'SUCCESS'){
      var real_pay_amt = input.getPrice()/rate['rate']/100;
      if (real_pay_amt < 0.01){
        console.log("人民币转换加币后必须大于0.01加币");
      }
    }
  });
}

var pay_url; // url path

p.jsApiOrder(input).then(function(result){
  var inputObj = new AlphaPayJsApiRedirect;
  //console.log("jsApiOrder/// result  " + util.inspect(result,true));
  //console.log("jsApiOrder " + util.inspect(inputObj,true));
  inputObj.setDirectPay('true');
  console.log("jsApiOrder " + util.inspect(inputObj,true));

  inputObj.setRedirect(urlencode('order_id='+ input.getOrderId().toString()));

  pay_url = p.getJsApiRedirectUrl(result['pay_url'],inputObj);

});


 

router.get('/', function(req, res, next) {
  res.render('jsApi', {pay_url:pay_url});
});

module.exports = router;
