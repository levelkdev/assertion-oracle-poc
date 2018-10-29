require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 6000000,
      gasPrice: 20 * 10 ** 9
    }
  }
}
