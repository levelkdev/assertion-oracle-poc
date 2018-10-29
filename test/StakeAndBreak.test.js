const chai = require('chai')
const { expect } = chai.use(require('chai-bignumber')(web3.BigNumber))

const BadBoy = artifacts.require('BadBoy')
const StakeAndBreak = artifacts.require('StakeAndBreak')

const stakeAmount = 10 * 10 ** 18

contract('StakeAndBreak', function (accounts) {

  const [ holder1, holder2 ] = accounts;

  beforeEach(async function () {
    this.stakeAndBreak = await StakeAndBreak.new()
  })

  describe('deposit()', function () {
    beforeEach(async function () {
      await this.stakeAndBreak.deposit({ value: stakeAmount, from: holder1 })
    })

    it('should increase stake amount for msg.sender', async function () {
      expect(await this.stakeAndBreak.stakes(holder1)).to.be.bignumber.equal(stakeAmount)
    })

    it('should increase ETH balance of the contract', async function () {
      expect(await web3.eth.getBalance(this.stakeAndBreak.address)).to.be.bignumber.equal(stakeAmount)
    })
  })

  describe('withdraw()', function () {
    describe('when called by a BadBoy contract', async function () {
      beforeEach(async function () {
        this.badBoy = await BadBoy.new(this.stakeAndBreak.address, stakeAmount)
        await this.stakeAndBreak.deposit({ value: stakeAmount, from: holder2 })
        await this.badBoy.deposit({ value: stakeAmount, from: holder1 })
        await this.badBoy.send()
      })

      it('should drain the StakeAndBreak contract', async function () {
        expect(await web3.eth.getBalance(this.stakeAndBreak.address)).to.be.bignumber.equal(0)
      })

      it('should transfer the balance to the BadBoy contract', async function () {
        expect(await web3.eth.getBalance(this.badBoy.address)).to.be.bignumber.equal(stakeAmount * 2)
      })
    })
  })

})
