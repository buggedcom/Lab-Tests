import { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTest';
import * as td from "../../../helpers/TestData";

describe('LaboratoryTest Model', function() {

    beforeEach(function(done) {
        LaboratoryTest.getDataSource()
            .set('table', [])
            .set('autoIncrement', 1)
            .write();
        done();
    });

    after(function(done) {
        LaboratoryTest.getDataSource()
            .set('table', [])
            .set('autoIncrement', 1)
            .write();
        done();
    });

    describe('static getDataSource', function() {

       it('return is instance of LodashWrapper', function() {
           const source = LaboratoryTest.getDataSource();
           expect(source.constructor.name).is.equal('LodashWrapper');
       });

       it('data source is empty by default', function() {
           const source = LaboratoryTest.getDataSource();
           expect(source.get('table').value().length).to.be.equal(0);
           expect(source.get('autoIncrement').value()).to.be.equal(1);
       });

       it('data source is updated after LaboratoryTest.write()', function() {
           const data = td.getOneTest();
           const test = new LaboratoryTest(data);
           test.write();

           const source = LaboratoryTest.getDataSource();
           expect(source.get('table').value().length).to.be.equal(1);
           expect(source.get('autoIncrement').value()).to.be.equal(2);
       });

       it('data source initantised before is NOT updated after LaboratoryTest.write()', function() {
           const source = LaboratoryTest.getDataSource();

           const data = td.getOneTest();
           const test = new LaboratoryTest(data);
           test.write();

           expect(source.get('table').value().length).to.be.equal(0);
           expect(source.get('autoIncrement').value()).to.be.equal(1);
       });

       it('data source initantised before is NOT updated after LaboratoryTest.write() but is on source.read()', function() {
           const source = LaboratoryTest.getDataSource();

           const data = td.getOneTest();
           const test = new LaboratoryTest(data);
           test.write();

           source.read();

           expect(source.get('table').value().length).to.be.equal(1);
           expect(source.get('autoIncrement').value()).to.be.equal(2);
       });

       it('futzing with source.read()', function() {
           const source = LaboratoryTest.getDataSource();

           const data1 = td.getOneTest();
           const test1 = new LaboratoryTest(data1);
           test1.write();

           source.read();

           const data2 = td.getOneTest();
           const test2 = new LaboratoryTest(data2);
           test2.write();

           expect(source.get('table').value().length).to.be.equal(1);
           expect(source.get('autoIncrement').value()).to.be.equal(2);
       });

   });

});