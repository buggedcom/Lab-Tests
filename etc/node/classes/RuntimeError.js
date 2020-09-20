/**
 * Class RuntimeError
 *
 * For errors resulting from runtime errors.
 *
 * @author Oliver Lillie
 */
class RuntimeError extends Error {
    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, RuntimeError.prototype);
    }
}

module.exports = RuntimeError;