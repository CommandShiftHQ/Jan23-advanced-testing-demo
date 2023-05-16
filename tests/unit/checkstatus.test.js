const { expect } = require('chai');
const sinon = require('sinon');
const { checkStatus } = require('../../src/controllers/checkStatus');

describe('checkStatus', () => {
  it('returns a 200 status code', () => {
    // arrange
    const request = {}
    const response = { sendStatus: sinon.spy() }
    
    // act
    checkStatus(request, response)

    // assert
    expect(response.sendStatus.calledOnce).to.be.true
    expect(response.sendStatus.calledWith(200)).to.be.true
  })
})
