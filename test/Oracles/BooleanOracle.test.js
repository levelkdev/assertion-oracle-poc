const web3Utils = require('web3-utils')
const { shouldFail, constants } = require('lk-test-helpers')(web3)
const { ZERO_BYTES32 } = constants

const BooleanOracle = artifacts.require('MockBooleanOracle')

contract('BooleanOracle', function (accounts) {

  const [ dataSource ] = accounts

  beforeEach(async function () {
    this.booleanOracle = await BooleanOracle.new(dataSource)
  })

  describe('setResult()', function () {
    describe('when bytes result converts to a uint with a value of 1', function () {
      beforeEach(async function () {
        this.result = web3Utils.padLeft(1, 64)
        await this.booleanOracle.setResult(this.result)
      })

      it('sets the result to 1', async function () {
        expect(await this.booleanOracle.resultFor(ZERO_BYTES32)).to.equal(this.result)
      })
    })

    describe('when bytes result converts to a uint with a value of 0', function () {
      beforeEach(async function () {
        this.result = ZERO_BYTES32
        await this.booleanOracle.setResult(this.result)
      })

      it('sets the result to 0', async function () {
        expect(await this.booleanOracle.resultFor(ZERO_BYTES32)).to.equal(this.result)
      })
    })

    describe('when bytes result converts to a uint with a value other than 0 or 1', function () {
      it('reverts', async function () {
        await shouldFail.reverting(this.booleanOracle.setResult(web3Utils.padLeft(2, 64)))
      })
    })
  })

  describe('boolResult()', function () {
    describe('when result is 1', function () {
      it('returns true', async function () {
        await this.booleanOracle.setResult(web3Utils.padLeft(1, 64))
        expect(await this.booleanOracle.boolResult()).to.be.true
      })
    })

    describe('when result is 0', function () {
      it('returns false', async function () {
        await this.booleanOracle.setResult(ZERO_BYTES32)
        expect(await this.booleanOracle.boolResult()).to.be.false
      })
    })

    describe('when result is not set', function () {
      it('reverts', async function () {
        await shouldFail.reverting(this.booleanOracle.boolResult())
      })
    })
  })
  
  describe('setBoolResult()', function () {
    describe('when given false', function () {
      it('sets result to 0', async function () {
        await this.booleanOracle.setBoolResult(false)
        expect(await this.booleanOracle.resultFor(ZERO_BYTES32)).to.equal(ZERO_BYTES32)
      })
    })

    describe('when given true', function () {
      it('sets result to 1', async function () {
        await this.booleanOracle.setBoolResult(true)
        expect(await this.booleanOracle.resultFor(ZERO_BYTES32)).to.equal(web3Utils.padLeft(1, 64))
      })
    })
  })
})
