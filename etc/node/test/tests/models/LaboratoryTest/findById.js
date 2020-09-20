import { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTest';
import * as td from "../../../helpers/TestData";
import LaboratoryTests from "../../../../models/LaboratoryTests";

describe('LaboratoryTest Model', function() {

    const collection = new LaboratoryTests();

    const tests = td.getSetOf3Tests();

    before(function(done) {
        collection.truncate();
        tests.forEach((test) => collection.add(new LaboratoryTest(test)));
        done();
    });

    after(function(done) {
        collection.truncate();
        done();
    });

    describe('static createFromPost', function() {
        const collection = new LaboratoryTests();
        collection.truncate();
        tests.forEach((test) => collection.add(new LaboratoryTest(test)));

        collection.forEach((item) => {
            it(`finding id ${item.id}`, function() {
                const found = LaboratoryTest.findById(item.id);
                expect(found.id).is.equal(item.id);
                expect(found.abbrv).is.equal(item.abbrv);
                expect(found.name).is.equal(item.name);
                expect(found.unit).is.equal(item.unit);
                expect(found.goodRangeMin).is.equal(item.goodRangeMin);
                expect(found.goodRangeMax).is.equal(item.goodRangeMax);
            });
        });

        it('found item is instanceof LaboratoryTest', function() {
            const found = LaboratoryTest.findById(1);
            expect(found.constructor.name).is.equal('LaboratoryTest');
        });

        collection.truncate();

        it('non-existant item returns false', function() {
            const found = LaboratoryTest.findById(9999);
            expect(found).is.false;
        });
   });

});