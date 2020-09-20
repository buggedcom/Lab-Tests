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

    const doMultiPutTest = function(properties, expectedSavedValue) {
        const url = '/api/1.0.0/laboratory-tests/2';
        const postData = properties;

        expectedSavedValue = typeof expectedSavedValue === 'undefined' ? value : expectedSavedValue;

        it('it should get statusCode = 200', function(done) {
            chai.request(server)
                .put(url)
                .send(postData)
                .end(function(error, response) {
                    res.expectStatus(200, response);
                    done();
                });
        });
        it('it should get a successful JsonPayload', function(done) {
            const rowBefore = ds.getRow(2);

            chai.request(server)
                .put(url)
                .send(postData)
                .end(function(error, response) {
                    const rowAfter = ds.getRow(2);

                    jp.expectSuccessPayload(response);
                    jp.expectPayloadDataToNotBeEmptyAndEquals(
                        response,
                        Object.assign(rowBefore, expectedSavedValue, { dateUpdated: rowAfter.dateUpdated })
                    );
                    jp.expectPayloadMetaToBeEmpty(response);
                    done();
                });
        });
        it('the data source should be updated', function(done) {
            chai.request(server)
                .put(url)
                .send(postData)
                .end(function(error, response) {
                    const rowAfter = ds.getRow(2);
                    Object.keys(expectedSavedValue).forEach(
                        (property) => expect(rowAfter[property]).is.equal(expectedSavedValue[property])
                    );

                    done();
                });
        });
        it('the data source should still contain the same data as inital setup except updated test', function(done) {
            chai.request(server)
                .get(url)
                .end(function(error, response) {
                    const table = ds.getDataSource().get('table');
                    tests.filter((test, index) => index !== 0).forEach((test, index) => {
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

    describe('valid requests', function() {

        describe('Single property PUTs', function() {

            const tests = [
                [{name:'Labtest 1234'}],
                [{abbrv:'abbrv'}],
                [{unit:'mgram'}],
                [{goodRangeMin:0}],
                [{goodRangeMin:-999}],
                [{goodRangeMin:-0.51}],
                [{goodRangeMin:1243142}],
                [{goodRangeMin:5.23}],
                [{goodRangeMin:''}, {goodRangeMin:null}],
                [{goodRangeMax:0}],
                [{goodRangeMax:-24}],
                [{goodRangeMax:-1.56}],
                [{goodRangeMax:4681}],
                [{goodRangeMax:1999.24156}],
                [{goodRangeMax:''}, {goodRangeMax:null}],
            ];

            tests.forEach((test) => {
                describe(JSON.stringify(test[0]) + (test[1] ? ' = ' + JSON.stringify(test[1]) : ''), function() {
                    doMultiPutTest(test[0], test[1] || test[0]); // if there is no expected value then the input is what is expected.
                });
            });
        });

        describe('Multiple property PUTs', function() {

            const tests = [
                [{name:'Labtest 1234', abbrv:'abbrv'}],
                [{abbrv:'abbrv', name:'Labtest 1234'}],
                [{name:'Labtest 1234', abbrv:'abbrv', unit:'rocks'}],
                [{unit:'gulps', goodRangeMin:-999}],
                [{goodRangeMin:-0.51, goodRangeMax:1999.24156}],
                [{goodRangeMin:1243142, unit:'litres'}],
                [{goodRangeMin:5.23, name:'Labtest 1234', unit:'mgram'}],
                [{goodRangeMin:'', unit:'mgram41'}, {goodRangeMin:null, unit:'mgram41'}],
                [{name:'Labtest 1234', abbrv:'abbrv', unit:'gulps', goodRangeMin:0, goodRangeMax:2436}],
            ];

            tests.forEach((test) => {
                describe(JSON.stringify(test[0]) + (test[1] ? ' = ' + JSON.stringify(test[1]) : ''), function() {
                    doMultiPutTest(test[0], test[1] || test[0]); // if there is no expected value then the input is what is expected.
                });
            });
        });
    });

});