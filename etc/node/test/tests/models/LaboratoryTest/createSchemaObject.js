import { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTest';

describe('LaboratoryTest Model', function() {

    describe('static createSchemaObject', function() {

        it('if empty object supplied then default object is returned', function() {
            const object = LaboratoryTest.createSchemaObject({});
            expect(object.arg).is.equal(null);
            expect(object.writable).is.equal(true);
            expect(object.nullable).is.equal(false);
            expect(object.visibility).is.equal('public');
            expect(object.cast).is.equal(null);
            expect(object.human).is.equal(null);
            expect(object.default).is.equal(null);
        });

        const valueOverload = 'quickly quickly catchy monkey';
        const properties = ['arg', 'writable', 'nullable', 'visibility', 'cast', 'human', 'default'];
        properties.forEach((property) => {
            it(`${property} should return as expected without affecting others`, function() {
                const object = LaboratoryTest.createSchemaObject({[property]: valueOverload});
                expect(object.arg).is.equal(property === 'arg' ? valueOverload : null);
                expect(object.writable).is.equal(property === 'writable' ? valueOverload : true);
                expect(object.nullable).is.equal(property === 'nullable' ? valueOverload : false);
                expect(object.visibility).is.equal(property === 'visibility' ? valueOverload : 'public');
                expect(object.cast).is.equal(property === 'cast' ? valueOverload : null);
                expect(object.human).is.equal(property === 'human' ? valueOverload : null);
                expect(object.default).is.equal(property === 'default' ? valueOverload : null);
            });
        });


   });

});