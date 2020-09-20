import express from 'express';
import laboratoryTest from '../../params/laboratoryTest';
import laboratoryTestCheckValue from '../../params/laboratoryTestCheckValue';
import JsonPayload from '../../classes/JsonPayload';
import JsonPayloadError from '../../classes/JsonPayloadError';
import HumanValidationError from '../../classes/HumanValidationError';
import LaboratoryTests from '../../models/LaboratoryTests';
import LaboratoryTest from '../../models/LaboratoryTest';

/**
 * Sets up the `/laboratory-test/*` routes.
 *
 * @author Oliver Lillie
 * @type {Router|router}
 * @version 1.0.0
 */

const router = express.Router();

/**
 * Wires in a param so that any of the routes that utilises the
 * `:laboratoryTest` param placeholder automatically has it loaded into the
 * request object.
 *
 * @author Oliver Lillie
 */
router.param('laboratoryTest', laboratoryTest);
router.param('laboratoryTestCheckValue', laboratoryTestCheckValue);

/**
 * Lists out all the laboratory tests in alphabetical order.
 *
 * @author Oliver Lillie
 */
router.get(
    '/',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        const collection = new LaboratoryTests();

        let data = {};
        collection.load().forEach((test) => {
            data[test.id] = {
                id: test.id,
                name: test.name,
                abbrv: test.abbrv,
                unit: test.unit,
                dateUpdated: test.dateUpdated,
            };
        });

        const sorted = Object.values(data)
            .sort((a, b) => a.name > b.name ? 1 : -1);

        // pagination information (if we were paginating) would be sent through
        // the meta property. But we are not doing that so therefore it is
        // simply left in as an explanation of what would take place.
        let meta = {};

        response.json(
            (new JsonPayload(sorted, meta)).toObject()
        );
    }
);

/**
 * A `/POST` request to `/laboratory-test/create` to create a new test.
 *
 * The following params are expected within the request body:
 * - POST.name
 * - POST.unit
 * - POST.goodRangeMin
 * - POST.goodRangeMax
 *
 * @author Oliver Lillie
 */
router.post(
    '/create',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        let test = null;
        try {
            test = LaboratoryTest.createFromPost(request.body);
        }
        catch (error) {
            if(error instanceof HumanValidationError === true) {
                response.status(422);
                response.json(
                    (new JsonPayloadError(error.message, 'validation-error')).toObject()
                );
                return;
            }

            throw error;
        }

        if(test === null) {
            response.status(400);
            response.json(
                (new JsonPayloadError('Nothing was created.', 'invalid-request')).toObject()
            );
            return;
        }

        test.write();

        response.json(
            (new JsonPayload(test)).toObject()
        );
    }
);

/**
 * A `/GET` request to `/laboratory-test/:laboratoryTest` to load information
 * about the test.
 *
 * @author Oliver Lillie
 */
router.get(
    '/:laboratoryTest',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        if(!request.laboratoryTest) {
            response.status(404);
            response.json(
                (new JsonPayloadError('Laboratory test not found.', 'laboratory-test-404')).toObject()
            );
            return;
        }

        response.json(
            (new JsonPayload(request.laboratoryTest)).toObject()
        );
    }
);

/**
 * A `/PUT` request to `/laboratory-test/:laboratoryTest` update any or multiple
 * properties for the given test.
 *
 * Properties that can be updated are:
 * - POST.name
 * - POST.unit
 * - POST.goodRangeMin
 * - POST.goodRangeMax
 *
 * The updated object is returned from the request.
 *
 * @author Oliver Lillie
 */
router.put(
    '/:laboratoryTest',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        if(!request.laboratoryTest) {
            response.status(404);
            response.json(
                (new JsonPayloadError('Laboratory test not found.', 'laboratory-test-404')).toObject()
            );
            return;
        }

        let hasUpdate = false;
        try {
            hasUpdate = request.laboratoryTest.updateFromPut(
                request.body
            );
        }
        catch (error) {
            if(error instanceof HumanValidationError === true) {
                response.status(422);
                response.json(
                    (new JsonPayloadError(error.message, 'validation-error')).toObject()
                );
                return;
            }

            throw error;
        }

        if(hasUpdate === false) {
            response.status(400);
            response.json(
                (new JsonPayloadError('Nothing was updated.', 'empty-request')).toObject()
            );
            return;
        }

        request.laboratoryTest.write();

        response.json(
            (new JsonPayload(request.laboratoryTest)).toObject()
        );
    }
);

/**
 * A `/DELETE` request to `/laboratory-test/:laboratoryTest` to remove a test
 * from the data store.
 *
 * @author Oliver Lillie
 */
router.delete(
    '/:laboratoryTest',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        if(!request.laboratoryTest) {
            response.status(404);
            response.json(
                (new JsonPayloadError('Laboratory test not found.', 'laboratory-test-404')).toObject()
            );
            return;
        }

        request.laboratoryTest.remove();

        response.json(
            (new JsonPayload()).toObject()
        );
    }
);

/**
 * A `/DELETE` request to `/laboratory-test/:laboratoryTest` to remove a test
 * from the data store.
 *
 * @author Oliver Lillie
 */
router.get(
    '/:laboratoryTest/check/:laboratoryTestCheckValue',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        const laboratoryTest = request.laboratoryTest;

        if(!laboratoryTest) {
            response.status(404);
            response.json(
                (new JsonPayloadError('Laboratory test not found.', 'laboratory-test-404')).toObject()
            );
            return;
        }

        let result = laboratoryTest.checkResult(request.laboratoryTestCheckValue);

        let message = null;
        let status = null;
        if(result === LaboratoryTest.CHECK_RESULT_OUTSIDE_LOWER) {
            message = `The value is below normal levels (${laboratoryTest.goodRangeMin}).`;
            status = false;
        } else if(result === LaboratoryTest.CHECK_RESULT_OUTSIDE_UPPER) {
            message = `The value is above normal levels. (${laboratoryTest.goodRangeMax}).`;
            status = false;
        } else if(result === LaboratoryTest.CHECK_RESULT_INSIDE) {
            message = 'Good news! The value is inside normal levels.';
            status = true;
        } else {
            message = 'An unknown result has been returned?!';
            status = false;
        }

        response.json(
            (new JsonPayload({
                result,
                status,
                message,
            })).toObject()
        );
    }
);

module.exports = router;
