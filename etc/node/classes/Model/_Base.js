import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import fs from 'fs';
import path from "path";
import paths from "../../paths";

/**
 * Base accessor class for providing model based access to the datasource.
 *
 * @author Oliver Lillie
 */
class _Base {

    /**
     * Any class that extends this class MUST overwrite this static function and
     * return the name of the datasource that the class is to use.
     *
     * @author Oliver Lillie
     * @return {null|string}
     */
    static getTableReference() {
        return null;
    }

    /**
     * Provides a simple accessor method to get the datasource.
     * It is dependant on the NODE_ENV variable to access to correct data
     * source.
     *
     * @author Oliver Lillie
     * @return {LodashWrapper}
     */
    static getDataSource() {
        const jsonPath = path.join(paths.ETC, 'data', process.env.NODE_ENV, this.getTableReference() + '.json');

        if(!fs.existsSync(jsonPath)) {
            throw new Error(`The json db path "${jsonPath}" for the list does not exist.`);
        }

        const db = lowdb(
            new FileSync(jsonPath)
        );

        db.defaults({
            table: [],
            autoIncrement: 1,
        }).write();

        return db;
    }

}

module.exports = _Base;