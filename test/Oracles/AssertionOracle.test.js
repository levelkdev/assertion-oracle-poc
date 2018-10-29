const web3Utils = require('web3-utils')
const { constants, increaseTime } = require('lk-test-helpers')(web3)
const { ZERO_BYTES32 } = constants

const MockAssertionTracker = artifacts.require('MockAssertionTracker')
const AssertionOracle = artifacts.require('AssertionOracle')

const assertionName = 'mockAssertion'

contract('AssertionOracle', function (accounts) {

  beforeEach(async function () {
    this.now = (await web3.eth.getBlock('latest')).timestamp
    this.assertionTracker = await MockAssertionTracker.new()
    this.assertionOracle = await AssertionOracle.new(
      this.assertionTracker.address,
      assertionName,
      this.now + 1000
    )
  })

  describe('setResult()', function () {
    describe('when assertion is passing', function () {
      it('sets result to 1', async function () {
        await increaseTime(2000)
        await this.assertionOracle.setResult(ZERO_BYTES32)
        expect(await this.assertionOracle.resultFor(ZERO_BYTES32)).to.equal(web3Utils.padLeft(1, 64))
      })
    })

    describe('when assertion is failing', function () {
      it('sets result to 0', async function () {
        await this.assertionTracker.setAssertionFailed(assertionName, accounts[0])
        await increaseTime(2000)
        await this.assertionOracle.setResult(ZERO_BYTES32)
        expect(await this.assertionOracle.resultFor(ZERO_BYTES32)).to.equal(ZERO_BYTES32)
      })
    })
  })

})