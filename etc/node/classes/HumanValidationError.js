class HumanValidationError extends Error {
    constructor(message) {
        super(message);

        Object.setPrototypeOf(this, HumanValidationError.prototype);
    }
}

module.exports = HumanValidationError;