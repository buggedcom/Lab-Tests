import { expect } from "chai";
import LaboratoryTests from '../../models/LaboratoryTests';

const helpers = {
    getDataSource() {
        return LaboratoryTests.getDataSource();
    },

    expectEmptyTable() {
        this.expectRowCount(0);
    },

    expectRowCount(count) {
        expect(this.getDataSource().get('table').value().length).to.be.equal(count);
    },

    getAutoIncrementValue() {
        const source = this.getDataSource();
        return source.get('autoIncrement').value();
    },

    getRow(id) {
        const source = this.getDataSource();
        return source.get('table').find({ id: id }).value();
    },

    getLastInsertedRow() {
        const source = this.getDataSource();
        const lastId = source.get('autoIncrement') - 1;
        return source.get('table').find({ id: lastId }).value();
    }
};

module.exports = helpers;
