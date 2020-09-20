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

    describe('with populated source', function() {
        describe('and an existing id', function() {
            const url = '/api/1.0.0/laboratory-tests/3';
            const postData = {
                goodRangeMin: 130,
                goodRangeMax: 148,
            };

            it('it should get statusCode = 200', function(done) {
                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        res.expectStatus200(response);
                        done();
                    });
            });
            it('it should get a successful JsonPayload with updated details', function(done) {
                const rowBeforeUpdate = ds.getRow(3);

                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        const rowAfterUpdate = ds.getRow(3);

                        jp.expectSuccessPayload(response);
                        jp.expectPayloadDataToNotBeEmptyAndEquals(
                            response,
                            Object.assign(rowBeforeUpdate, {dateUpdated: rowAfterUpdate.dateUpdated}, postData)
                        );
                        jp.expectPayloadMetaToBeEmpty(response);
                        done();
                    });
            });
            it('the test count in the data source should still be the same as initially', function(done) {
                chai.request(server)
                    .get(url)
                    .send(postData)
                    .end(function(error, response) {
                        ds.expectRowCount(tests.length);
                        done();
                    });
            });
            it('the data source should still contain the same data as inital setup except updated test', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
                        const table = ds.getDataSource().get('table');
                        tests.filter((test, index) => index !== 2).forEach((test, index) => {
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

        describe('and a laboratory id that does not exist anywhere', function() {
            const url = '/api/1.0.0/laboratory-tests/999';
            const postData = {
                name: 'LDL-Cholestrol',
                abbrv: 'LDL',
                unit: 'mmol/l',
                goodRangeMin: 10,
                goodRangeMax: 25,
            };

            it('it should get statusCode = 404', function(done) {
                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        res.expectStatus404(response);
                        done();
                    });
            });
            it('it should get a JsonPayloadError', function(done) {
                chai.request(server)
                    .put(url)
                    .send(postData)
                    .end(function(error, response) {
                        jp.expectErrorPayload(response, 'Laboratory test not found.', 'laboratory-test-404');
                        jp.expectPayloadDataToBeEmpty(response);
                        jp.expectPayloadMetaToBeEmpty(response);
                        done();
                    });
            });
            it('the data source should still be the same as initially', function(done) {
                chai.request(server)
                    .get(url)
                    .send(postData)
                    .end(function(error, response) {
                        ds.expectRowCount(tests.length);
                        done();
                    });
            });
            it('the data source should still contain the same data as inital setup', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
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
            });
        });

    });


});