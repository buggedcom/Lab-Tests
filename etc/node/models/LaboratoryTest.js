import Record from "../classes/Model/Record";
import NotContainsWhiteSpace from '../classes/Ow/NotContainsWhiteSpace';
import NotWhiteSpace from '../classes/Ow/NotWhiteSpace';
import ow from "ow";
import "str-trim";
import BigNumber from 'bignumber.js';

/**
 * Provides model record for crud operations for interacting with the
 * `laboratoryTests` data source.
 *
 * @author Oliver Lillie
 * @property name
 * @property unit
 * @property abbrv
 * @property goodRangeMin
 * @property goodRangeMax
 */
class LaboratoryTest extends Record {

    /**
     * Static constants used to return values from the LaboratoryTest.checkValue
     * method depending on the outcome of the result.
     *
     * If the result is outside and below the goodRangeMin lower bound (if it is
     * set) then CHECK_RESULT_OUTSIDE_LOWER is returned.
     *
     * If the result is outside and above the goodRangeMax lower bound (if it is
     * set) then CHECK_RESULT_OUTSIDE_LOWER is returned.
     *
     * If the result is inside the goodRangeMin and goodRangeMax bounds then
     * CHECK_RESULT_INSIDE is returned.
     *
     * @type {string}
     */
    static CHECK_RESULT_OUTSIDE_LOWER = 'outside-lower';
    static CHECK_RESULT_OUTSIDE_UPPER = 'outside-upper';
    static CHECK_RESULT_INSIDE = 'inside';

    /**
     * @inheritDoc
     * @return {string}
     */
    static getTableReference() {
        return 'laboratoryTests';
    }

    /**
     * @inheritDoc
     * @return {{dateCreated: {default: null, visibility: string, arg: NumberPredicate}, id: {nullable: boolean, visibility: string, arg: AnyPredicate<number|null>, writable: boolean}, dateUpdated: {default: null, visibility: string, arg: NumberPredicate}} & {goodRangeMin: {cast: (function(*=): *), nullable: boolean, arg: NumberPredicate}, abbrv: {default: null, nullable: boolean, arg: StringPredicate, human: string}, unit: {nullable: boolean, arg: StringPredicate, human: string, required: boolean}, goodRangeMax: {cast: (function(*=): *), nullable: boolean, arg: NumberPredicate}, name: {default: null, arg: StringPredicate, human: string, required: boolean}}}
     */
    schema() {
        const castRange = (value) => {
            if(value === null || value === ''){
                return null;
            }

            // if the value is not a number or string then we do not
            // want to cast it to a number so the value fails
            // the arg validation.
            // fyi isNaN('   ') === false. FML.
            if(isNaN(value) === true || String(value).match(/[^0-9\-\.]/) !== null || ['number', 'string'].indexOf(typeof value) === -1) {
                return value;
            }

            return Number(value);
        };

        return Object.assign(
            super.schema(),
            {
                name: Record.createSchemaObject({
                    arg: ow.string.minLength(2).maxLength(255).is(NotWhiteSpace),
                    human:(value) => {
                        if(typeof value !== 'string' || value.length < 2 || value.length > 255) {
                            return 'The name must be between 2 and 255 characters long.';
                        }
                        return 'The name cannot be just whitespace.';
                    },
                    required: true,
                    default: null
                    // there propbably be some unique prop that get's checked
                    // here when creating a new test, however I thnk that is
                    // overkill for this json test code. but it would be
                    // something like `unique: true` that the Record class
                    // would process.
                }),

                abbrv: Record.createSchemaObject({
                    arg: ow.string.minLength(1).maxLength(5).is(NotContainsWhiteSpace),
                    human:(value) => {
                        if(typeof value !== 'string' || value.length < 1 || value.length > 5) {
                            return 'The abbreviation must be between 1 and 5 characters long.';
                        }
                        return 'The abbreviation cannot contain whitespace.';
                    },
                    nullable: true,
                    default: null
                }),

                unit: Record.createSchemaObject({
                    arg: ow.string.minLength(1).maxLength(20).is(NotWhiteSpace),
                    human:(value) => {
                        if(typeof value !== 'string' || value.length < 1 || value.length > 20) {
                            return 'The unit must be between 1 and 20 characters long.';
                        }
                        return 'The unit cannot be just whitespace.';
                    },
                    required: true,
                    nullable: false
                }),

                goodRangeMin: Record.createSchemaObject({
                    arg: ow.number.is(NotContainsWhiteSpace),
                    nullable: true,
                    human:(value) => {
                        const type = typeof value;
                        if(type === 'string') {
                            if(value.trim() === '' || value.match(/\s+/) !== null) {
                                return 'The good range minimum cannot contain white space.';
                            }
                        }
                        return 'The good range minimum must be a number or empty.';
                    },
                    cast: castRange
                }),

                goodRangeMax: Record.createSchemaObject({
                    arg: ow.number.is(NotContainsWhiteSpace),
                    nullable: true,
                    human:(value) => {
                        const type = typeof value;
                        if(type === 'string') {
                            if(value.trim() === '' || value.match(/\s+/) !== null) {
                                return 'The good range maximum cannot contain white space.';
                            }
                        }
                        return 'The good range maximum must be a number or empty.';
                    },
                    cast: castRange
                })
            }
        );
    }

    /**
     * Checks the given value against the "good value" range of the test to
     * check the results outcome.
     *
     * If the test has a lower bound (goodRangeMin) and the value is less, then
     * LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER is returned.
     *
     * If the test has an upper bound (goodRangeMax) and the value is more, then
     * LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER is returned.
     *
     * Otherwise LaboratoryTest.CHECK_RESULT_INSIDE is returned indicating that
     * the value is inside the good range.
     *
     * This function utilises BigNumber in order to preserve precision for high
     * precision floats so it will accuratly detect this example:
     *
     * 75.000000000000000000000000001 > 75.0000000000000000000000000001
     *
     * @author Oliver Lillie
     * @link http://mikemcl.github.io/bignumber.js
     * @param {string|number} value
     * @return {string}
     */
    checkResult(value) {
        // note the importance of BigNumber here to preserver float/double
        // precision when working with very high precision
        BigNumber.config({ DECIMAL_PLACES: 24 });

        const compare = new BigNumber(value);

        if(this.goodRangeMin !== null) {
            const min = new BigNumber(this.goodRangeMin);
            if(compare.isLessThan(min) === true) {
                return LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER;
            }
        }

        if(this.goodRangeMax !== null) {
            const max = new BigNumber(this.goodRangeMax);
            if(compare.isGreaterThan(max) === true) {
                return LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER;
            }
        }

        return LaboratoryTest.CHECK_RESULT_INSIDE;
    }

}

module.exports = LaboratoryTest;