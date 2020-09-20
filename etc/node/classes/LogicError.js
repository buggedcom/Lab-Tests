/**
 * Class LogicError
 *
 * For errors resulting from programming logic flaws.
 *
 * @author Oliver Lillie
 */
class LogicError extends Error {
    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, LogicError.prototype);
    }
}

module.exports = LogicError;