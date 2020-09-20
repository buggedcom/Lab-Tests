import { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTests';

describe('LaboratoryTest Model', function() {

   describe('static getTableReference', function() {

       it('returns correct table name', function() {
            expect(LaboratoryTest.getTableReference()).to.be.string('laboratoryTests');
       });

   });

});