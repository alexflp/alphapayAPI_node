var express = require('express');
var router = express.Router();


var AlphaPayDataBase = require('../lib/data').AlphaPayDataBase;
var AlphaPayUnifiedOrder = require('../lib/data').AlphaPayUnifiedOrder;
var AlphaPayApi = require('../lib/api');

var PARTNER_CODE =require('../lib/config').PARTNER_CODE;  //get PARTNER_CODE and CREDENTIAL_CODE
var CREDENTIAL_CODE =require('../lib/config').CREDENTIAL_CODE
process.env.TZ = 'America/Vancouver';



// var p = new AlphaPayApi;
// console.log("p.getMillisecond():" + p.getMillisecond());


// var s = new AlphaPayDataBase;
// s.setTime('123');
// s.setNonceStr('string');
// s.setSign('abc');
// console.log("s.gettime():" + s.getTime());
// console.log("s.getNonceStr():" + s.getNonceStr());
// console.log("s.toSignParams():" + s.toSignParams());
// console.log("s.makeSign():" + s.setSign());
// console.log("s.toBodyParams():" + s.toBodyParams());
// console.log("s.toQueryParams():" + s.toQueryParams());

// var w = new AlphaPayUnifiedOrder;
// var time = moment.utc();
// w.setOrderId(PARTNER_CODE + time);
// w.setDescription("test");
// w.setPrice("100");
// w.setCurrency("CAD");
// w.setNotifyUrl("https://pay.alphapay.ca/notify_url");
// w.setOperator("123456");

// var result = p.qrOrder(w);
// console.log("result :" + result);
// s.setOrderId9(s.partner_code);







/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express asdjlasdl' });
  console.log("test");
});

// router.post('/s', function (req, res) {
//   res.send('Got a POST request');
// });









module.exports = router;
