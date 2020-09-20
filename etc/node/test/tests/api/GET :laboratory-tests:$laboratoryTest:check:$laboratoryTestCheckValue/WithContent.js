import chai, {expect} from "chai";
import chaiHttp from "chai-http";

import jp from "../../../helpers/JsonPayload";
import res from "../../../helpers/Response";
import ds from "../../../helpers/DataSource";
import td from "../../../helpers/TestData";
import server from "../../../../server";
import LaboratoryTests from '../../../../models/LaboratoryTests';
import LaboratoryTest from "../../../../models/LaboratoryTest";

chai.use(chaiHttp);

describe('/GET /api/1.0.0/laboratory-tests/:laboratoryTest/check/:laboratoryTestCheckValue', function() {

    const collection = new LaboratoryTests();

    const tests = td.getSetOf7Tests();

    beforeEach(function(done) {
        collection.truncate();
        tests.forEach((test) => collection.add(new LaboratoryTest(test)));
        done();
    });

    after(function(done) {
        collection.truncate();
        done();
    });

    const checkNoValue = (name) => {
        describe('test no value', function() {
            const getUrl = () => {
                const test = collection.findByName(name);
                return `/api/1.0.0/laboratory-tests/${test.id}/check/`;
            };

            it('it should get statusCode = 404', function(done) {
                chai.request(server)
                    .get(getUrl())
                    .end(function(error, response) {
                        res.expectStatus404(response);
                        done();
                    });
            });
            it('it should get a JsonPayloadError', function(done) {
                chai.request(server)
                    .get(getUrl())
                    .end(function(error, response) {
                        // this fallback to the default 404 response
                        // from express since there will be no route
                        // pattern match
                        jp.expectErrorPayload(response, 'Not Found', 'trace');
                        jp.expectPayloadDataToBeEmpty(response);
                        jp.expectPayloadMetaToNotBeEmpty(response);
                        done();
                    });
            });
            it('check data integrity', function(done) {
                checkDataIsUntouched(getUrl(), tests, done);
            });
        });
    };

    const checkValueBounds = (name, checks) => {
         checks.forEach((check) => {
             describe(`test ${check[0]} value`, function() {
                 const getUrl = () => {
                     const test = collection.findByName(name);
                     return `/api/1.0.0/laboratory-tests/${test.id}/check/${check[1]}`;
                 };

                 it('it should get statusCode = 200', function(done) {
                     chai.request(server)
                         .get(getUrl())
                         .end(function(error, response) {
                             res.expectStatus200(response);
                             done();
                         });
                 });
                 it('it should get a successful JsonPayload with details', function(done) {
                     const test = collection.findByName(name);

                     chai.request(server)
                         .get(getUrl())
                         .end(function(error, response) {
                             jp.expectSuccessPayload(response);

                             if(check[2] !== response.body.data.result) {
                                 console.group();
                                 console.log('expected vs actual', check[2], response.body.data.result);
                                 console.log(name, test);
                                 console.log(check[1]);
                                 console.groupEnd();
                             }

                             jp.expectPayloadDataToNotBeEmptyAndEquals(response, {
                                 result: check[2],
                                 status: check[2] === LaboratoryTest.CHECK_RESULT_INSIDE,
                                 message: check[2] === LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER
                                     ? `The value is below normal levels (${test.goodRangeMin}).`
                                     : (check[2] === LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER
                                     ? `The value is above normal levels. (${test.goodRangeMax}).`
                                     : 'Good news! The value is inside normal levels.')
                             });
                             jp.expectPayloadMetaToBeEmpty(response);
                             done();
                         });
                 });
                 it('check data integrity', function(done) {
                     checkDataIsUntouched(getUrl(), tests, done);
                 });
             });
         });
    };

    const checkDataIsUntouched = (url, tests, done) => {
        chai.request(server)
            .get(url)
            .end(function(error, response) {
                ds.expectRowCount(tests.length);

                const table = ds.getDataSource().get('table');
                tests.forEach((test) => {
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
    };

    describe('with populated source', function() {
        describe('and an existing laboratory id', function() {

            describe('a test with no lower bound using "Antinuclear Antibody"', function() {
                const checks = [
                    ['0', '0', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['negative integer', '-99', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['negative float', '-15.1251362246', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['postive float', '23.102', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['low', '1', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['on upper bound', '320', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['high', '321', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                    ['postive float high', '1024.102', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ];

                const name = 'Antinuclear Antibody';
                checkNoValue(name);
                checkValueBounds(name, checks);
            });

            describe('a test with no upper bound using "Oxygen Saturation Arterial"', function() {

                const checks = [
                    ['0', '0', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['negative integer', '-99', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['negative float', '-15.1251362246', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['postive float', '23.102', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['low', '1', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['on lower bound', '94', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['high', '321', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['postive float high', '1024.102', LaboratoryTest.CHECK_RESULT_INSIDE],
                ];

                const name = 'Oxygen Saturation Arterial';
                checkNoValue(name);
                checkValueBounds(name, checks);
            });

            describe('a test with differing positive float lower and upper bound using "Ionized Calcium"', function() {
                const checks = [
                    ['0', '0', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['integer under', '1', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['integer between', '2', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['integer over', '3', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                    ['float under', '0.9921', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['float between', '1.0300000001', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['float over', '5942.001224', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ];

                const name = 'Ionized Calcium';
                checkNoValue(name);
                checkValueBounds(name, checks);
            });

            describe('a test with differing negative lower and positive upper bound using "CK-MB"', function() {

                const checks = [
                    ['0', '0', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['integer under', '-1024515', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['integer between', '3', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['integer over', '6', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                    ['float under', '-89429.9921', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['float between', '4.99999999999999', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['float over', '5942.001224', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ];

                const name = 'CK-MB';
                checkNoValue(name);
                checkValueBounds(name, checks);
            });

            describe('a test with same lower and upper bound using "Oxygen Saturation Venous"', function() {

                const checks = [
                    ['0', '0', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['integer under', '-1024515', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['integer between', '75', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['integer over', '85', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                    ['float under', '-89429.9921', LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER],
                    ['float between', '75.00000000', LaboratoryTest.CHECK_RESULT_INSIDE],
                    ['float over', '75.00000000000000000001', LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER],
                ];

                const name = 'Oxygen Saturation Venous';
                checkNoValue(name);
                checkValueBounds(name, checks);
            });
        });

        describe('and a laboratory id that does not exist', function() {
            const url = '/api/1.0.0/laboratory-tests/999/check/454';

            it('it should get statusCode = 404', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
                        res.expectStatus404(response);
                        done();
                    });
            });
            it('it should get a JsonPayloadError', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
                        jp.expectErrorPayload(response, 'Laboratory test not found.', 'laboratory-test-404');
                        jp.expectPayloadDataToBeEmpty(response);
                        jp.expectPayloadMetaToBeEmpty(response);
                        done();
                    });
            });
            it('check data integrity', function(done) {
                checkDataIsUntouched(url, tests, done);
            });
        });
    });


});