import chai from "chai";
import chaiHttp from "chai-http";

import jp from "../../../helpers/JsonPayload";
import res from "../../../helpers/Response";
import ds from "../../../helpers/DataSource";
import server from "../../../../server";
import LaboratoryTests from '../../../../models/LaboratoryTests';

chai.use(chaiHttp);

describe('/GET /api/1.0.0/laboratory-tests/:laboratoryTest', function() {

    const collection = new LaboratoryTests();

    before(function(done) {
        collection.truncate();
        done();
    });

    afterEach(function(done) {
        collection.truncate();
        done();
    });

    describe('with no data in the source', function() {
        describe('and an laboratory id that would exist had the data been populated', function() {
            const url = '/api/1.0.0/laboratory-tests/3';

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
            it('the data source should still contain the same number of rows', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
                        ds.expectEmptyTable();
                        done();
                    });
            });
        });

        describe('and a laboratory id that does not exist anywhere', function() {
            const url = '/api/1.0.0/laboratory-tests/999';

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
            it('the data source should still contain the same number of rows', function(done) {
                chai.request(server)
                    .get(url)
                    .end(function(error, response) {
                        ds.expectEmptyTable();
                        done();
                    });
            });
        });
    });


});