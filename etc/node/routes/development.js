import express from 'express';
import td from "../test/helpers/TestData";
import JsonPayload from '../classes/JsonPayload';
import LaboratoryTests from '../models/LaboratoryTests';
import LaboratoryTest from '../models/LaboratoryTest';

const router = express.Router();

/**
 * A get request for populating the dev environment with tests.
 *
 * @author Oliver Lillie
 */
router.put(
    '/populate',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        const collection = new LaboratoryTests();

        const tests = td.getSetOf7Tests();
        tests.forEach((test) => collection.add(new LaboratoryTest(test)));

        let data = {};
        collection.load().forEach((test) => {
            data[test.id] = {
                name: test.name,
                abbrv: test.abbrv,
                id: test.id,
            };
        });

        const sorted = Object.values(data)
            .sort((a, b) => a.name > b.name ? 1 : -1)
            .map((test) => {
                return {id: test.id, name: test.name, abbrv: test.abbrv}
            });

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
 * A `/PURGE` request to `/laboratory-test/` to truncate the data store.
 *
 * @author Oliver Lillie
 */
router.purge(
    '/',
    function(request, response, next) {
        response.set("Content-Type", "application/json; charset=utf-8");

        // typically there would be an escallated privilege checking here but
        // since we are classing this as a dev script there really is no point

        const collection = new LaboratoryTests();
        collection.truncate();

        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.json(
            (new JsonPayload()).toObject()
        );
    }
);


module.exports = router;
