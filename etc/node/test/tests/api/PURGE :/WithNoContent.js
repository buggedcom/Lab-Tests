import chai from "chai";
import chaiHttp from "chai-http";

import jp from "../../../helpers/JsonPayload";
import res from "../../../helpers/Response";
import ds from "../../../helpers/DataSource";
import server from "../../../../server";
import LaboratoryTests from '../../../../models/LaboratoryTests';

chai.use(chaiHttp);

describe('/PURGE /api/1.0.0/laboratory-tests/', function() {

    before(function(done) {
        (new LaboratoryTests()).truncate();
        done();
    });

    afterEach(function(done) {
        (new LaboratoryTests()).truncate();
        done();
    });

    describe('with an empty source', function() {
        const url = '/';

        it('it should get statusCode = 200', function(done) {
            chai.request(server)
                .purge(url)
                .end(function(error, response) {
                    res.expectStatus200(response);
                    done();
                });
        });
        it('it should get a successful but empty JsonPayload', function(done) {
            chai.request(server)
                .purge(url)
                .end(function(error, response) {
                    jp.expectSuccessPayload(response);
                    jp.expectPayloadDataToBeEmpty(response);
                    jp.expectPayloadMetaToBeEmpty(response);
                    done();
                });
        });
        it('the data source should still be empty', function(done) {
            chai.request(server)
                .purge(url)
                .end(function(error, response) {
                    ds.expectEmptyTable();
                    done();
                });
        });
    });

});