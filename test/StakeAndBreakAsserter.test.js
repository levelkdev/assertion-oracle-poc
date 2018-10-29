const web3Utils = require('web3-utils')
const lkTestHelpers = require('lk-test-helpers')
const chai = require('chai')

const { expectEvent } = lkTestHelpers(web3)
const { expect } = chai.use(require('chai-bignumber')(web3.BigNumber))

const MockAssertionTracker = artifacts.require('MockAssertionTracker')
const BadBoyAssertionBreaker = artifacts.require('BadBoyAssertionBreaker')
const StakeAndBreakAsserter = artifacts.require('StakeAndBreakAsserter')

const stakeAmount = 10 * 10 ** 18

contract('StakeAndBreakAsserter', function (accounts) {

  const [ sender1, sender2 ] = accounts;

  beforeEach(async function () {
    this.assertionTracker = await MockAssertionTracker.new()
    this.stakeAndBreakAsserter = await StakeAndBreakAsserter.new(this.assertionTracker.address)
  })

  describe('assertDepositIncrementsSenderBalance()', function () {
    describe('when assertion passes', function () {
      beforeEach(async function () {
        this.tx = await this.stakeAndBreakAsserter.assertDepositIncrementsSenderBalance(
          { value: stakeAmount, from: sender1 }
        )
      })

      it('should emit AssertDepositIncrementsSenderBalance with passed=true', async function () {
        expectEvent.inLogs(this.tx.logs, 'AssertDepositIncrementsSenderBalance', {
          passed: true,
          sender: sender1,
          value: stakeAmount,
          initialBalance: 0,
          finalBalance: stakeAmount
        })
      })

      it('should not call setAssertionFailed() on AssertionTracker', async function () {
        const assertionHash = web3Utils.keccak256("assertDepositIncrementsSenderBalance")
        expect(await this.assertionTracker.assertionPassing(assertionHash)).to.be.true
      })
    })
  })

  describe('assertWithdrawTransfersExpectedAmount()', function () {
    describe('when assertion passes', function () {
      beforeEach(async function () {
        await this.stakeAndBreakAsserter.deposit({ value: stakeAmount, from: sender1 })
        this.tx = await this.stakeAndBreakAsserter.assertWithdrawTransfersExpectedAmount(
          stakeAmount,
          { from: sender1 }
        )
      })

      it('should emit AssertWithdrawTransfersExpectedAmount with passed=true', async function () {
        expectEvent.inLogs(this.tx.logs, 'AssertWithdrawTransfersExpectedAmount', {
          passed: true,
          sender: sender1,
          withdrawAmount: stakeAmount,
          initialBalance: stakeAmount,
          finalBalance: 0
        })
      })

      it('should not call setAssertionFailed() on AssertionTracker', async function () {
        const assertionHash = web3Utils.keccak256("assertWithdrawTransfersExpectedAmount")
        expect(await this.assertionTracker.assertionPassing(assertionHash)).to.be.true
      })
    })

    describe('when assertion fails', function () {
      beforeEach(async function () {
        await this.stakeAndBreakAsserter.deposit({ value: stakeAmount, from: sender2 })
        this.badBoy = await BadBoyAssertionBreaker.new(
          this.stakeAndBreakAsserter.address,
          stakeAmount
        )
        await this.badBoy.deposit({ value: stakeAmount, from: sender1 })
        await this.badBoy.assertWithdrawTransfersExpectedAmount(stakeAmount)

        this.eventLogs = [await eventResult(
          this.stakeAndBreakAsserter,
          'AssertWithdrawTransfersExpectedAmount'
        )]
      })

      it('should emit AssertWithdrawTransfersExpectedAmount with passed=false', async function () {
        expectEvent.inLogs(this.eventLogs, 'AssertWithdrawTransfersExpectedAmount', {
          passed: false,
          sender: this.badBoy.address,
          withdrawAmount: stakeAmount,
          initialBalance: stakeAmount * 2,
          finalBalance: 0
        })
      })

      it('should call setAssertionFailed() on AssertionTracker', async function () {
        const assertionHash = web3Utils.keccak256("assertWithdrawTransfersExpectedAmount")
        expect(await this.assertionTracker.assertionPassing(assertionHash)).to.be.false
      })

      it('should set BadBoy\'s address as the failed assertion sender', async function () {
        const assertionHash = web3Utils.keccak256("assertWithdrawTransfersExpectedAmount")
        expect(await this.assertionTracker.failedAssertionSenders(assertionHash)).to.equal(this.badBoy.address)
      })
    })
  })
})

function eventResult(contract, event) {
  return new Promise((resolve, reject) => {
    const evt = contract[event]();
    evt.watch((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}
