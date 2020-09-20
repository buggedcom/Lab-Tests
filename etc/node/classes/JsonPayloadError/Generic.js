import _Abstract from './_Abstract';
import LogicError from '../LogicError';

/**
 * Class Generic
 *
 * A generic json payload error class.
 *
 * @author Oliver Lillie
 */
class Generic extends _Abstract {

    /**
     * Returns the error message.
     *
     * @author Oliver Lillie
     * @access public
     * @return {string}
     * @throws {LogicError}
     */
    getErrorMessage() {
        if (!this._arguments[0]) {
            throw new LogicError('The error message must be set as the first argument of the class constructor.');
        }
        return this._arguments[0];
    }

    /**
     * Returns the error code.
     *
     * @author Oliver Lillie
     * @access public
     * @return {string}
     * @throws {LogicError}
     */
    getErrorCode() {
        if (!this._arguments[1]) {
            throw new LogicError('The error code must be set as the second argument of the class constructor.');
        }
        return this._arguments[1];
    }

}

module.exports = Generic;
