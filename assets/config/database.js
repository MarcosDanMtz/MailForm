const mongojs       = require('mongojs');
var usr             = 'gtsmx_user';
var pwd             = 'gtsmx_user123';
//var mongourl        = 'mongodb://localhost:27017/mailfeedback'//'mongodb://'+usr+':'+pwd+'@ds113628.mlab.com:13628/feedback';
var mongourl        = 'mongodb://'+usr+':'+pwd+'@ds151973.mlab.com:51973/gtsmx_mailform';

exports.db          = mongojs(mongourl);