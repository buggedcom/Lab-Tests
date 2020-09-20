import chai, { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTest';
import * as td from "../../../helpers/TestData";
import LaboratoryTests from "../../../../models/LaboratoryTests";
import * as ds from "../../../helpers/DataSource";

describe('LaboratoryTest Model', function() {

    const collection = new LaboratoryTests();

    before(function(done) {
        collection.truncate();
        done();
    });

    afterEach(function(done) {
        collection.truncate();
        done();
    });

    describe('static createFromPost', function() {
        it('should throw HumanValidationError if the postData contains non-schema properties', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    waß: 'ist daß?'
                })
            }).to.throw('The following properties do not exist in the object and should be dropped from the request: waß');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if the postData contains properties that are not publicly visible (ie property.visibility != "public")', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    id: 'this is protected'
                })
            }).to.throw('The following properties are read only and cannot be written to: id');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if the postData is empty', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({})
            }).to.throw('The request cannot be empty.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if the postData has empty required properties', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: null,
                    unit: null,
                })
            }).to.throw('The following properties are required and must be set: name, unit.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if the postData.name is empty', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: null,
                    unit: 'unit',
                })
            }).to.throw('The following properties are required and must be set: name.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if the postData.unit is empty', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: 'name',
                    unit: null,
                })
            }).to.throw('The following properties are required and must be set: unit.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if name fails validation', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: 'n',
                    abbrv: null,
                    unit: 'unit',
                })
            }).to.throw('The name must be between 2 and 255 characters long.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if abbrv fails validation', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: 'name',
                    abbrv: 'abcdefghijklmnop',
                    unit: 'unit',
                })
            }).to.throw('The abbreviation must be between 1 and 5 characters long.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if unit fails validation', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: 'name',
                    abbrv: null,
                    unit: 'unitunitunitunitunitunitunitunitunitunitunitunit',
                })
            }).to.throw('The unit must be between 1 and 20 characters long.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if goodRangeMin fails validation', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: 'name',
                    abbrv: null,
                    unit: 'unitunitunitunitunitunitunitunitunitunitunitunit',
                    goodRangeMin: 'asv'
                })
            }).to.throw('The unit must be between 1 and 20 characters long.');
            ds.expectRowCount(0);
        });

        it('should throw HumanValidationError if goodRangeMax fails validation', function() {
            chai.expect(function() {
                LaboratoryTest.createFromPost({
                    name: 'name',
                    abbrv: null,
                    unit: 'unitunitunitunitunitunitunitunitunitunitunitunit',
                    goodRangeMax: 'asv'
                })
            }).to.throw('The unit must be between 1 and 20 characters long.');
            ds.expectRowCount(0);
        });

        it('should return an instance of LaboratoryTest', function() {
            const test = LaboratoryTest.createFromPost(td.getOneTest());
            expect(test.constructor.name).is.equal('LaboratoryTest');
        });

        it('id should be null in returned instance', function() {
            const test = LaboratoryTest.createFromPost(td.getOneTest());
            expect(test.id).is.undefined;
            ds.expectRowCount(0);
        });
        
        it('the returned LaboratoryTest contains the correct data', function() {
            const data = td.getOneTest();
            const test = LaboratoryTest.createFromPost(data);
            expect(test.abbrv).is.equal(data.abbrv);
            expect(test.name).is.equal(data.name);
            expect(test.unit).is.equal(data.unit);
            expect(test.goodRangeMin).is.equal(data.goodRangeMin);
            expect(test.goodRangeMax).is.equal(data.goodRangeMax);
        });
    });

});