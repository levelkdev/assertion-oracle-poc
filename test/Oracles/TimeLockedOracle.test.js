const web3Utils = require('web3-utils')
const { shouldFail, constants, increaseTime } = require('lk-test-helpers')(web3)
const { ZERO_BYTES32 } = constants

const TimeLockedOracle = artifacts.require('TimeLockedOracle')

contract('TimeLockedOracle', function (accounts) {

  const [ dataSource ] = accounts

  beforeEach(async function () {
    this.now = (await web3.eth.getBlock('latest')).timestamp
  })

  describe('setResult()', function () {
    describe('when unlockTime is in the past', function () {
      beforeEach(async function () {
        this.timeLockedOracle = await TimeLockedOracle.new(this.now + 1000, dataSource)
        this.result = web3Utils.fromAscii('yes')
        await increaseTime(2000)
        await this.timeLockedOracle.setResult(this.result)
      })

      it('sets the result', async function () {
        expect(await this.timeLockedOracle.resultFor(ZERO_BYTES32)).to.equal(this.result)
      })
    })

    describe('when unlockTime is in the future', function () {
      beforeEach(async function () {
        this.timeLockedOracle = await TimeLockedOracle.new(this.now + 1000, dataSource)
        this.result = web3Utils.fromAscii('yes')
      })

      it('reverts', async function () {
        await shouldFail.reverting(this.timeLockedOracle.setResult(this.result))
      })
    })
  })

})