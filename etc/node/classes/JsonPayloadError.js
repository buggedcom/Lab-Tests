import JsonPayload from './JsonPayload';
import Generic from './JsonPayloadError/Generic';
import ow from 'ow';
import arg from './Arg';

/**
 * Class JsonPayloadError
 *
 * Creates an instance of JsonPayload that is given an error with a specific
 * error message and error code.
 *
 * @author Oliver Lillie
 */
class JsonPayloadError extends JsonPayload{

    /**
     * JsonPayloadError constructor.
     *
     * @access public
     * @author Oliver Lillie
     *
     * @param {string} errorMessage The public message of the error.
     * @param {string} errorCode The associated error code of the message.
     *
     * @throws \InvalidArgumentException
     */
    constructor(errorMessage, errorCode) {
        arg(errorMessage, ow.string.minLength(5));
        arg(errorCode, ow.string.minLength(1));

        super({}, {});

        this.error = new Generic(errorMessage, errorCode);
    }

}

module.exports = JsonPayloadError;