const util = require('util')

module.exports = _value => util.inspect(_value, {compact: false})