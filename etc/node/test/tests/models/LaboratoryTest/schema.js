import { expect } from "chai";
import LaboratoryTest from '../../../../models/LaboratoryTest';

describe('LaboratoryTest Model', function() {

    describe('schema', function() {

        // property writable nullable visibility cast human _default
        const properties = [
            ['id', false, true, 'protected', null, null],
            ['dateCreated', true, false, 'protected', null, null],
            ['dateUpdated', true, false, 'protected', null, null],
            ['name', true, false, 'public', null, {
                'The name must be between 2 and 255 characters long.' : [123, [], {}, 'a', 'a'.repeat(256)],
                'The name cannot be just whitespace.' : ['aaa'], // this is correct since we are just testing the expected outcomes of the function and when the function is called it has already been passed through other checks
            }],
            ['abbrv', true, true, 'public', null, {
                'The abbreviation must be between 1 and 5 characters long.' : [123, [], {}, '', 'a'.repeat(6)],
                'The abbreviation cannot contain whitespace.' : ['aa'], // this is correct since we are just testing the expected outcomes of the function and when the function is called it has already been passed through other checks
            }],
            ['unit', true, false, 'public', null, {
                'The unit must be between 1 and 20 characters long.' : [123, [], {}, '', 'a'.repeat(21)],
                'The unit cannot be just whitespace.' : ['aa'], // this is correct since we are just testing the expected outcomes of the function and when the function is called it has already been passed through other checks
            }],
            ['goodRangeMin', true, true, 'public', [[null, null], ['', null], ['abc', 'abc'], [123, 123]], {
                'The good range minimum cannot contain white space.' : ['', ' ', ' a ', 'a a'],
                'The good range minimum must be a number or empty.' : [123, 0.124, -99, [], {}], // this is correct since we are just testing the expected outcomes of the function and when the function is called it has already been passed through other checks
            }],
            ['goodRangeMax', true, true, 'public', [[null, null], ['', null], ['abc', 'abc'], [123, 123]], {
                'The good range maximum cannot contain white space.' : ['', ' ', ' a ', 'a a'],
                'The good range maximum must be a number or empty.' : [123, 0.124, -99, [], {}], // this is correct since we are just testing the expected outcomes of the function and when the function is called it has already been passed through other checks
            }],
        ];

        const laboratoryTest = new LaboratoryTest();

        properties.forEach((test) => {
            const [
                property,
                writable,
                nullable,
                visibility,
                cast,
                human,
                _default,
            ] = test;

            describe(`schema().${property}`, function() {

                const schema = laboratoryTest.schema();
                const schemaProperty = schema[property];

                it(`returns property object for '${property}'`, function() {
                    expect(schemaProperty).is.an('object');
                });

                it(`writable = ${writable}`, function() {
                    expect(schemaProperty.writable).is.a('boolean').equal(writable);
                });

                it(`nullable = ${nullable}`, function() {
                    expect(schemaProperty.nullable).is.a('boolean').equal(nullable);
                });

                it(`visibility = ${visibility}`, function() {
                    expect(schemaProperty.visibility).is.a('string').equal(visibility);
                });

                it(`cast output is as expected`, function() {
                    if(cast === null) {
                        expect(schemaProperty.cast).is.null;
                    } else {
                        cast.forEach((check) => {
                            const [input, output] = check;
                            expect(schemaProperty.cast(input)).is.equal(output)
                        });
                    }
                });

                it(`human output is as expected`, function() {
                    if(human === null) {
                        expect(schemaProperty.human).is.null;
                    } else {
                        Object.keys(human)
                            .forEach((output) => {
                                human[output].forEach((input) => expect(schemaProperty.human(input)).is.equal(output));
                            });
                    }
                });

                it(`arg is defined`, function() {
                    expect(schemaProperty.arg).is.not.null;
                });
            });
        });
    });

});