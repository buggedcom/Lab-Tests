import { expect } from "chai";

const helpers = {
    expectPayload(response) {
        expect(response.body).to.be.an('object');

        expect(response.body).to.have.property('status');
        expect(response.body).to.have.property('error');
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.satisfy(function(s){
            return typeof s === 'object';
        });
        expect(response.body).to.have.property('meta');
        expect(response.body.meta).to.be.an('object');
    },

    expectSuccessPayload(response) {
        this.expectPayload(response);
        this.expectPayloadErrorEmpty(response);

        expect(response.body.status).to.equal(true);
    },

    expectPayloadDataToBeEmpty(response) {
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.satisfy(function(s){
            return typeof s === 'object';
        }).that.is.empty;
    },

    expectPayloadDataToNotBeEmpty(response) {
        expect(response.body).to.have.property('data');
        expect(response.body.data).to.satisfy(function(s){
            return typeof s === 'object';
        }).that.is.not.empty;
    },

    expectPayloadDataToNotBeEmptyAndEquals(response, equals) {
        this.expectPayloadDataToNotBeEmpty(response);

        Object.keys(equals).forEach((property) => {
            let responseValue = response.body.data[property];
            let expectedValue = equals[property];
            if(typeof responseValue === 'object') {
                responseValue = JSON.stringify(responseValue);
                expectedValue = JSON.stringify(expectedValue);
            }
            expect(responseValue).to.be.equal(expectedValue);
        });
    },

    expectPayloadMetaToBeEmpty(response) {
        expect(response.body).to.have.property('meta');
        expect(response.body.meta).to.be.an('object').that.is.empty;
    },

    expectPayloadMetaToNotBeEmpty(response) {
        expect(response.body).to.have.property('meta');
        expect(response.body.meta).to.satisfy(function(s){
            return typeof s === 'object';
        }).that.is.not.empty;
    },

    expectErrorPayload(response, errorMessage, errorCode) {
        this.expectPayload(response);

        expect(response.body.status).to.equal(false);
        expect(response.body.error).to.be.an('object');
        expect(response.body.error).to.have.property('message');
        expect(response.body.error.message).to.equal(errorMessage);
        expect(response.body.error).to.have.property('code');
        expect(response.body.error.code).to.equal(errorCode);
    },

    expectPayloadErrorEmpty(response, errorMessage, errorCode) {
        expect(response.body.error).to.equal(null);
    }
};

module.exports = helpers;
