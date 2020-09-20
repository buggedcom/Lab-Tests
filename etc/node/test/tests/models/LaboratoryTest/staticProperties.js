import { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTest';

describe('LaboratoryTest Model', function() {

   describe('static properties', function() {

       it('CHECK_RESULT_OUTSIDE_LOWER', function() {
            expect(LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER).to.be.string('outside-lower');
       });

       it('CHECK_RESULT_OUTSIDE_UPPER', function() {
            expect(LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER).to.be.string('outside-upper');
       });

       it('CHECK_RESULT_INSIDE', function() {
            expect(LaboratoryTest.CHECK_RESULT_INSIDE).to.be.string('inside');
       });

   });

});