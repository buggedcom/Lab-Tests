import chai from "chai";
import { expect } from "chai";
import chaiHttp from "chai-http";

import jp from "../../../helpers/JsonPayload";
import res from "../../../helpers/Response";
import ds from "../../../helpers/DataSource";
import td from "../../../helpers/TestData";
import server from "../../../../server";
import LaboratoryTests from '../../../../models/LaboratoryTests';
import LaboratoryTest from "../../../../models/LaboratoryTest";

chai.use(chaiHttp);

describe('/PUT /api/1.0.0/laboratory-tests/:laboratoryTest', function() {

    const collection = new LaboratoryTests();

    const tests = td.getSetOf3Tests();

    beforeEach(function(done) {
        collection.truncate();
        tests.forEach((test) => collection.add(new LaboratoryTest(test)));
        done();
    });

    after(function(done) {
        collection.truncate();
        done();
    });

    const doPutTest = function(properties, expectedErrorMessage) {
        const url = '/api/1.0.0/laboratory-tests/1';
        const postData = properties;

        it('it should get statusCode = 422', function(done) {
            chai.request(server)
                .put(url)
                .send(postData)
                .end(function(error, response) {
                    res.expectStatus(422, response);
                    done();
                });
        });
        it('it should get a JsonPayloadError with human validation error', function(done) {
            chai.request(server)
                .put(url)
                .send(postData)
                .end(function(error, response) {
                    jp.expectErrorPayload(response, expectedErrorMessage, 'validation-error');
                    jp.expectPayloadDataToBeEmpty(response);
                    jp.expectPayloadMetaToBeEmpty(response);
                    done();
                });
        });
        it('the data source should still contain the same data as initial setup', function(done) {
            chai.request(server)
                .get(url)
                .end(function(error, response) {
                    const table = ds.getDataSource().get('table');
                    tests.forEach((test, index) => {
                        const result = table.find({
                            name: test.name,
                            unit: test.unit,
                            abbrv: test.abbrv,
                            goodRangeMax: test.goodRangeMax,
                            goodRangeMin: test.goodRangeMin
                        });
                        expect(result).to.not.be.undefined;
                    });
                    done();
                });
        });
    };

    describe('Invalid requests', function() {

        describe('with no data sent in request', function() {
            const url = '/api/1.0.0/laboratory-tests/1';
            const postData = {};

            it('it should get statusCode = 400', function(done) {
                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        res.expectStatus(400, response);
                        done();
                    });
            });
            it('it should get a JsonPayloadError saying nothing was updated', function(done) {
                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        jp.expectErrorPayload(response, 'Nothing was updated.', 'empty-request');
                        jp.expectPayloadDataToBeEmpty(response);
                        jp.expectPayloadMetaToBeEmpty(response);
                        done();
                    });
            });
            it('the data source should still contain the same data as initial setup', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
                        const table = ds.getDataSource().get('table');
                        tests.forEach((test, index) => {
                            const result = table.find({
                                name: test.name,
                                unit: test.unit,
                                abbrv: test.abbrv,
                                goodRangeMax: test.goodRangeMax,
                                goodRangeMin: test.goodRangeMin
                            });
                            expect(result).to.not.be.undefined;
                        });
                        done();
                    });
            });
        });

        describe('extraneous data sent in request', function() {
            const url = '/api/1.0.0/laboratory-tests/1';
            const postData = {
                invalidProperty: 'abcd',
            };

            it('it should get statusCode = 400', function(done) {
                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        res.expectStatus(400, response);
                        done();
                    });
            });
            it('it should get a JsonPayloadError saying nothing was updated', function(done) {
                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        jp.expectErrorPayload(response, 'Nothing was updated.', 'empty-request');
                        jp.expectPayloadDataToBeEmpty(response);
                        jp.expectPayloadMetaToBeEmpty(response);
                        done();
                    });
            });
            it('the data source should still contain the same data as initial setup', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
                        const table = ds.getDataSource().get('table');
                        tests.forEach((test, index) => {
                            const result = table.find({
                                name: test.name,
                                unit: test.unit,
                                abbrv: test.abbrv,
                                goodRangeMax: test.goodRangeMax,
                                goodRangeMin: test.goodRangeMin
                            });
                            expect(result).to.not.be.undefined;
                        });
                        done();
                    });
            });
        });

        describe('Single property PUTs', function() {

            const tests = {
                name: [
                    ['too short', {name:'a'}, 'The name must be between 2 and 255 characters long.'],
                    ['too long', {name:'a'.repeat(256)}, 'The name must be between 2 and 255 characters long.'],
                    ['non-string array value', {name:[]}, 'The name must be between 2 and 255 characters long.'],
                    ['whitespace only', {name:'   '}, 'The name cannot be just whitespace.'],
                ],
                abbrv: [
                    ['too short', {abbrv:''}, 'The abbreviation must be between 1 and 5 characters long.'],
                    ['too long', {abbrv:'a'.repeat(6)}, 'The abbreviation must be between 1 and 5 characters long.'],
                    ['non-string array value', {abbrv:[]}, 'The abbreviation must be between 1 and 5 characters long.'],
                    ['whitespace only', {abbrv:'   '}, 'The abbreviation cannot contain whitespace.'],
                ],
                unit: [
                    ['too short', {unit:''}, 'The unit must be between 1 and 20 characters long.'],
                    ['too long', {unit:'a'.repeat(21)}, 'The unit must be between 1 and 20 characters long.'],
                    ['non-string array value', {unit:[]}, 'The unit must be between 1 and 20 characters long.'],
                    ['whitespace only', {unit:'   '}, 'The unit cannot be just whitespace.'],
                ],
                goodRangeMin: [
                    ['non-numeric', {goodRangeMin:'abcef'}, 'The good range minimum must be a number or empty.'],
                    ['non-numeric array value', {goodRangeMin:[]}, 'The good range minimum must be a number or empty.'],
                    ['whitespace only', {goodRangeMin:'    '}, 'The good range minimum cannot contain white space.'],
                ],
                goodRangeMax: [
                    ['non-numeric', {goodRangeMax:'abcef'}, 'The good range maximum must be a number or empty.'],
                    ['non-numeric array value', {goodRangeMax:[]}, 'The good range maximum must be a number or empty.'],
                    ['whitespace only', {goodRangeMax:'    '}, 'The good range maximum cannot contain white space.'],
                ]
            };

            Object.keys(tests).forEach((property) => {
                describe(property, function() {
                    tests[property].forEach((test) => {
                        describe(test[0] + ' ' + JSON.stringify(test[1]), function() {
                            doPutTest(test[1], test[2]);
                        });
                    });
                });
            });
        });

        describe('Multiple property PUTs', function() {

            const tests = [
                ['name empty, abbrv ok', {name:'', abbrv:'abbrv'}, 'The name must be between 2 and 255 characters long.'],
                ['name ok, abbrv empty', {name:'name', abbrv:''}, 'The abbreviation must be between 1 and 5 characters long.'],
                ['abbrv empty, name ok', {abbrv:'', name:'Labtest 1234'}, 'The abbreviation must be between 1 and 5 characters long.'],
                ['abbrv empty, name empty', {abbrv:'', name:''}, 'The name must be between 2 and 255 characters long.'],
                ['name empty, abbrv empty', {name:'', abbrv:''}, 'The name must be between 2 and 255 characters long.'],
                ['unit empty, abbrv empty, name empty', {unit:'', abbrv:'', name:''}, 'The name must be between 2 and 255 characters long.'],
                ['name empty, unit empty, abbrv empty', {name:'', unit:'', abbrv:''}, 'The name must be between 2 and 255 characters long.'],
                ['unit empty, abbrv empty, name empty, goodRangeMin alpha, goodRangeMax alpha', {goodRangeMin:'a', unit:'', abbrv:'', name:'', goodRangeMax:'b'}, 'The name must be between 2 and 255 characters long.'],
            ];

            tests.forEach((test) => {
                describe(test[0] + ' ' + JSON.stringify(test[1]), function() {
                    doPutTest(test[1], test[2]);
                });
            });

        });

    });

});