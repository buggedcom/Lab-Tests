import ow from 'ow';
import arg from '../Arg';
import _Base from "./_Base";
import Record from "./Record";

/**
 * Simple iteratable datasource wrapper for looping through a tables list.
 * Because this is a simple test there is no pagination of result sets however
 * production code would implement such features as noted throughout the code.
 *
 * A collection can be iterated object via:
 *
 * ```
 * (new Collection()).load().forEach((child) => console.log(child);
 * ```
 *
 * @author Oliver Lillie
 */
class Collection extends _Base {

    /**
     * Provides the child class that is created when the items are added to the
     * collection or iterated over.
     *
     * @author Oliver Lillie
     * @return {Record}
     * @private
     */
    _getChildClass() {
        return Record;
    }

    /**
     * Performs the load of the datasource into a js native array.
     *
     * @author Oliver Lillie
     * @return {Collection}
     */
    load() {
        // whilst in this instance the entire dataset is loaded into the
        // iterator, this would not be done if it were being loaded from a
        // db data source, instead the data would be paginated through result
        // sets and the Symbol iterator function at the end of this class would
        // deal with iteration through these datasets.
        // But since this is really just a demo, this is what we are doing now.
        const dataSource = (this.constructor).getDataSource();
        this._manifest = dataSource.get('table').value() || [];
        this.length = this._manifest.length;

        return this;
    }

    /**
     * Adds a child item into the collcetion and automtically refreshes the
     * iteratable manifest.
     *
     * @author Oliver Lillie
     * @param {*} child Should be an instance of whatever class is returned by
     *  `this._getChildClass()`.
     * @return {Collection}
     */
    add(child) {
        arg(child, ow.object.instanceOf(this._getChildClass()));

        child.write();

        this.load();

        return this;
    }

    /**
     * Truncates the current source by removing everything from the table array.
     *
     * @author Oliver Lillie
     */
    truncate() {
        (this.constructor).getDataSource()
            .set('table', [])
            .set('autoIncrement', 1)
            .write();

        this.load();

        return this;
    }

    /**
     * Returns a test from the collection by reference to the name of the test.
     *
     * @author Oliver Lillie
     * @param name
     * @return {LaboratoryTest|null}
     */
    findByName(name) {
        return this.find((test) => test.name === name);
    }

    /**
     * Alias for Array.prototype.forEach functionality.
     *
     * @author Oliver Lillie
     * @param {Function} callback
     */
    forEach(callback) {
        arg(callback, ow.function);

        this._manifest.forEach(callback);
    }

    /**
     * Alias for Array.prototype.some functionality.
     *
     * @author Oliver Lillie
     * @param {Function} callback
     */
    some(callback) {
        arg(callback, ow.function);

        return this._manifest.some(callback);
    }

    /**
     * Alias for Array.prototype.map functionality.
     *
     * @author Oliver Lillie
     * @param {Function} callback
     */
    map(callback) {
        arg(callback, ow.function);

        return this._manifest.map(callback);
    }

    /**
     * Alias for Array.prototype.filter functionality.
     *
     * @author Oliver Lillie
     * @param {Function} callback
     */
    filter(callback) {
        arg(callback, ow.function);

        return this._manifest.filter(callback);
    }

    /**
     * Alias for Array.prototype.find functionality.
     *
     * @author Oliver Lillie
     * @param {Function} callback
     */
    find(callback) {
        arg(callback, ow.function);

        return this._manifest.find(callback);
    }

    /**
     * Provides access to the given index of the manifest.
     *
     * @author Oliver Lillie
     * @param {number} index
     */
    offsetGet(index) {
        arg(index, ow.number);

        return this._manifest[index] || null;
    }

    /**
     * Returns the objects manifest.
     *
     * @author Oliver Lillie
     * @return {array}
     */
    toArray() {
        return this._manifest;
    }

    /**
     * Provides the objects iterative functionality.
     *
     * @author Oliver Lillie
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
     */
    [Symbol.iterator]() {
        let index = -1;
        let data  = this._manifest;

        return {
            next: () => {
                const recordClass = this._getChildClass().constructor;

                // we are operating under  the assumption that the primary key
                // is always going to be `id` - but obviously typically this
                // would not always be the case in a usual product.
                return {
                    value: new recordClass(data[++index].value()),
                    done: !(index in data)
                }
            }
        };
    };

}

module.exports = Collection;