/**
 * JsonPayloadErrorInterface interface provides structure for creating reusable
 * errors and specific codes.
 *
 * @author Oliver Lillie
 * @property {array} _arguments A container for all the arguments supplied to
 *  the abstract contstructor.
 */
class _Abstract {

    constructor() {
        this._arguments = [...arguments];
    }

    /**
     * Returns the error message.
     *
     * @author Oliver Lillie
     * @access public
     * @return {string|null}
     */
    getErrorMessage() {
        return null;
    }

    /**
     * Returns the error code.
     *
     * @author Oliver Lillie
     * @access public
     * @return {string|null}
     */
    getErrorCode() {
        return null;
    }

    /**
     * The encode for json function should be used to return the object data
     * in a format that can be json encoded back into the json payload.
     *
     * @author Oliver Lillie
     * @access public
     * @return {array}
     */
    encodeForJson() {
        return {
            message: this.getErrorMessage(),
            code: this.getErrorCode()
        };
    }

}

module.exports = _Abstract;