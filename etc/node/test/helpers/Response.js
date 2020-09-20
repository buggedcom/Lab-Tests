import { expect } from "chai";

const helpers = {
    expectStatus200(response) {
        this.expectStatus(200, response);
    },

    expectStatus404(response) {
        this.expectStatus(404, response);
    },

    expectStatus(code, response) {
        expect(response).to.have.status(code);
    }
};

module.exports = helpers;
