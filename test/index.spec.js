// test/index.spec.js
'use strict'
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;

/* App under test */
const app = require('../app/index');

describe('App', () => {
    var token;
    describe('/route', () => {
        it('responds with status 200', (done) => {
            chai.request("http://localhost:80")
                .post('/route')
                .send(["22.372081", "114.107877"], ["22.336931", "114.176336"])
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    done();
                });
        });

        it('responds with a token', (done) => {
            chai.request("http://localhost:80")
                .post('/route')
                .send(["22.372081", "114.107877"], ["22.336931", "114.176336"])
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('token');
                    token = res.body.token;
                    done();
        });


        });
    });
    describe('/route/(:token)', () => {
        it('the token is valid', (done) => {
            chai.request("http://localhost:80")
                .get('/route/'+token)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status').and.to.equal('in progress');
                    done();
                });
        });
    });
});