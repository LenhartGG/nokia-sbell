var environment = require('./environment');

/**
 * mysql config
 */
var config = {
    host: '135.252.218.128',
    user: 'webuser',
    password: 'web1830',
    database: 'VLMTest'
};

var tablename = 'Ipluggable';
// var tablename = 'Ipluggable_test';
// var tablename = 'Ipluggable_test1';

module.exports = {
    config: config,
    tablename: tablename
}