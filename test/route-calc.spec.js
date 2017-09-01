// test/route-calc.spec.js
'use strict'
process.env.NODE_ENV = 'test';

const chai = require('chai');
const expect = chai.expect;

/* Module under test */
const routeCalc = require('../app/route-calc');

describe('Route Calc module', () => {
  describe('"calculateShortestRoute"', () => {
    it('should export a function', () => {
      expect(routeCalc.calculateShortestRoute).to.be.a('function');
    });
    describe('A request with 1 destination', () => {
          let routeRequest = {
              token: 'testToken',
              origin: ["22.511200", "114.126183"],
              destinations: [["22.336931", "114.176336"]]
          };

          it('should return a success result', (done) => {
              routeCalc.calculateShortestRoute(routeRequest, function(err, token, result) {
                  expect(err).to.not.exist;
                  expect(token).to.equal('testToken');
                  expect(result).to.have.property('status').and.to.equal('success');
                  expect(result).to.have.property('path').and.to.deep.equal([["22.511200", "114.126183"], ["22.336931", "114.176336"]]);
                  expect(result).to.have.property('total_distance').to.be.above(9500);
                  expect(result).to.have.property('total_time').to.be.above(600);
                  done();
              });
          }).timeout(5000);
      });
      describe('A request with 2 destination', () => {
          let routeRequest = {
              token: 'testToken',
              origin: ["22.511200", "114.126183"],
              destinations: [["22.336931", "114.176336"],["22.377130", "114.197439"] ]
          };

          it('should return a success with shortest route', (done) => {
              routeCalc.calculateShortestRoute(routeRequest, function(err, token, result) {
                  console.log(JSON.stringify(result));
                  expect(err).to.not.exist;
                  expect(token).to.equal('testToken');
                  expect(result).to.have.property('status').and.to.equal('success');
                  expect(result).to.have.property('path').and.to.deep.equal([["22.511200", "114.126183"], ["22.377130", "114.197439"], ["22.336931", "114.176336"]]);
                  expect(result).to.have.property('total_distance').to.be.above(18000);
                  expect(result).to.have.property('total_time').to.be.above(1700);
                  done();
              });
          }).timeout(5000);
      });


  });
});


