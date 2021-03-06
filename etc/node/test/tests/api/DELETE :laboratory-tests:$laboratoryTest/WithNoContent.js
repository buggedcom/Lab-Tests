import chai from "chai";
import chaiHttp from "chai-http";

import jp from "../../../helpers/JsonPayload";
import res from "../../../helpers/Response";
import ds from "../../../helpers/DataSource";
import server from "../../../../server";
import LaboratoryTests from '../../../../models/LaboratoryTests';

chai.use(chaiHttp);

describe('/DELETE /api/1.0.0/laboratory-tests/:laboratoryTest', function() {

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
        describe('and an laboratory id that would exist had the data been populated', function() {
            const url = '/api/1.0.0/laboratory-tests/3';

            it('it should get statusCode = 404', function(done) {
                chai.request(server)
                    .delete(url)
                    .end(function(error, response) {
                        res.expectStatus404(response);
                        done();
                    });
            });
            it('it should get a JsonPayloadError', function(done) {
                chai.request(server)
                    .delete(url)
                    .end(function(error, response) {
                        jp.expectErrorPayload(response, 'Laboratory test not found.', 'laboratory-test-404');
                        jp.expectPayloadDataToBeEmpty(response);
                        jp.expectPayloadMetaToBeEmpty(response);
                        done();
                    });
            });
            it('the data source should still be empty', function(done) {
                chai.request(server)
                    .delete(url)
                    .end(function(error, response) {
                        ds.expectEmptyTable();
                        done();
                    });
            });
        });

        describe('and a laboratory id that does not exist anywhere', function() {
            const url = '/api/1.0.0/laboratory-tests/123';

            it('it should get statusCode = 404', function(done) {
                chai.request(server)
                    .delete(url)
                    .end(function(error, response) {
                        res.expectStatus404(response);
                        done();
                    });
            });
            it('it should get a JsonPayloadError', function(done) {
                chai.request(server)
                    .delete(url)
                    .end(function(error, response) {
                        jp.expectErrorPayload(response, 'Laboratory test not found.', 'laboratory-test-404');
                        jp.expectPayloadDataToBeEmpty(response);
                        jp.expectPayloadMetaToBeEmpty(response);
                        done();
                    });
            });
            it('the data source should still be empty', function(done) {
                chai.request(server)
                    .delete(url)
                    .end(function(error, response) {
                        ds.expectEmptyTable();
                        done();
                    });
            });
        });
    });


});