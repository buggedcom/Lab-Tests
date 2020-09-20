import chai, {expect} from "chai";
import chaiHttp from "chai-http";

import jp from "../../../helpers/JsonPayload";
import res from "../../../helpers/Response";
import ds from "../../../helpers/DataSource";
import server from "../../../../server";
import LaboratoryTests from '../../../../models/LaboratoryTests';

chai.use(chaiHttp);

describe('/POST /api/1.0.0/laboratory-tests/create', function() {

    const collection = new LaboratoryTests();

    beforeEach(function(done) {
        collection.truncate();
        done();
    });

    after(function(done) {
        collection.truncate();
        done();
    });

    describe('with no data in the source', function() {
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
        it('the data source should no longer be empty', function(done) {
            chai.request(server)
                .post(url)
                .send(postData)
                .end(function(error, response) {
                    ds.expectRowCount(1);
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
                    expect(row.abbrv).is.a('string').is.equal(postData.abbrv);
                    expect(row.unit).is.a('string').is.equal(postData.unit);
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
    });


});