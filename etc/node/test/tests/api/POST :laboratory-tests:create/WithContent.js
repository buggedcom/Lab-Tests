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

describe('/POST /api/1.0.0/laboratory-tests/create', function() {

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
        const url = '/api/1.0.0/laboratory-tests/create';
        const postData = {
            name: 'LDL-Cholestrol',
            abbrv: 'LDL',
            unit: 'mmol/l',
            goodRangeMin: 10,
            goodRangeMax: 25,
        };

        it('it should get statusCode = 200', function(done) {
            chai.request(server)
                .post(url)
                .send(postData)
                .end(function(error, response) {
                    res.expectStatus200(response);
                    done();
                });
        });
        it('it should get a successful JsonPayload that contains the LaboratoryTest data', function(done) {
            chai.request(server)
                .post(url)
                .send(postData)
                .end(function(error, response) {
                    const row = ds.getLastInsertedRow();

                    jp.expectSuccessPayload(response);
                    jp.expectPayloadDataToNotBeEmptyAndEquals(
                        response,
                        Object.assign({
                            id: row.id,
                            dateCreated: row.dateCreated,
                            dateUpdated: row.dateUpdated,
                        }, postData)
                    );
                    jp.expectPayloadMetaToBeEmpty(response);
                    done();
                });
        });
        it('the data source should contain another test', function(done) {
            chai.request(server)
                .post(url)
                .send(postData)
                .end(function(error, response) {
                    ds.expectRowCount(tests.length + 1);
                    done();
                });
        });
        it('the test data should match the input', function(done) {
            chai.request(server)
                .post(url)
                .send(postData)
                .end(function(error, response) {
                    const row = ds.getLastInsertedRow();

                    expect(row.name).is.a('string').is.equal(postData.name);
                    expect(row.unit).is.a('string').is.equal(postData.unit);
                    expect(row.abbrv).is.a('string').is.equal(postData.abbrv);
                    expect(row.goodRangeMin).is.a('number').is.equal(postData.goodRangeMin);
                    expect(row.goodRangeMax).is.a('number').is.equal(postData.goodRangeMax);

                    done();
                });
        });
        it('the test data datasource autoIncrement has been updated', function(done) {
            const autoIncrementValueBefore = ds.getAutoIncrementValue();

            chai.request(server)
                .post(url)
                .send(postData)
                .end(function(error, response) {
                    const autoIncrementValueAfter = ds.getAutoIncrementValue();

                    expect(autoIncrementValueAfter).is.a('number').is.greaterThan(autoIncrementValueBefore);
                    expect(autoIncrementValueAfter).is.a('number').is.equal(autoIncrementValueBefore + 1);

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