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

describe('/GET /api/1.0.0/laboratory-tests/', function() {

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
        const url = '/api/1.0.0/laboratory-tests/';

        it('it should get statusCode = 200', function(done) {
            chai.request(server)
                .get(url)
                .end(function(error, response) {
                    res.expectStatus200(response);
                    done();
                });
        });
        it('it should get a successful JsonPayload that contains a list of all the tests', function(done) {
            chai.request(server)
                .get(url)
                .end(function(error, response) {
                    let expectedData = {};
                    collection.forEach((test) => {
                        return expectedData[test.id] = {
                            id: test.id,
                            name: test.name,
                            abbrv: test.abbrv,
                            unit: test.unit,
                            dateUpdated: test.dateUpdated,
                        };
                    });
                    jp.expectSuccessPayload(response);
                    jp.expectPayloadDataToNotBeEmpty(response);
                    response.body.data.forEach((test) => {
                        expect(expectedData[test.id]).to.not.be.undefined;
                        expect(test.id).is.a('number').is.equal(expectedData[test.id].id);
                        expect(test.name).is.a('string').is.equal(expectedData[test.id].name);
                        expect(test.abbrv).to.satisfy((s) => {
                            return s === null || typeof s === 'string';
                        }).is.equal(expectedData[test.id].abbrv);
                        expect(test.unit).is.a('string').is.equal(expectedData[test.id].unit);
                        expect(test.dateUpdated).is.a('number').is.equal(expectedData[test.id].dateUpdated);
                    });
                    jp.expectPayloadMetaToBeEmpty(response);
                    done();
                });
        });
        it('the data source should still contain the same tests', function(done) {
            chai.request(server)
                .get(url)
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