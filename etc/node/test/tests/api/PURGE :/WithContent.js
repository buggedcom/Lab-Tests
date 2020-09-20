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

describe('/PURGE /api/1.0.0/laboratory-tests/', function() {

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
        it('the data source should be empty', function(done) {
            chai.request(server)
                .purge(url)
                .end(function(error, response) {
                    ds.expectEmptyTable();
                    done();
                });
        });
    });


});