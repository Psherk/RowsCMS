var ConfigurationData = require('../ConfigurationData.json').Mysql
	mysql = require('mysql');

	module.exports = mysql.createPool(ConfigurationData);
