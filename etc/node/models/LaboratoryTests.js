import Collection from "../classes/Model/Collection";
import LaboratoryTest from "./LaboratoryTest";

/**
 * Provides an iterative list of allthe records from inside the
 * /etc/data/laboratoryTests.json data store.
 *
 * @author Oliver Lillie
 */
class LaboratoryTests extends Collection {

    /**
     * @inheritDoc
     * @return {string}
     */
    static getTableReference() {
        return 'laboratoryTests';
    }

    /**
     * @inheritDoc
     * @return {LaboratoryTest}
     * @private
     */
    _getChildClass() {
        return LaboratoryTest;
    }

}

module.exports = LaboratoryTests;