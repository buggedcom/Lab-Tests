import ow from 'ow';
import arg from './Arg';
import _Abstract from './JsonPayloadError/_Abstract';

/**
 * JsonPayload provides a uniform way of returning json data back to the
 * browser.
 *
 * @author Oliver Lillie
 * @property {boolean} status The status property signals the return response
 *  status. It is a boolean value and if true means that the request completed
 *  succesfully.
 * @property {*} data This is generally an array but can contain any value
 *  that is to be returned by the request. However if it is an object, said
 *  object must implement the JsonPayloadDataInterface to be accepted.
 * @property {array} meta Any specifically non requested data that the request
 *  may want to return can be contained in this array. It ideally should be key
 *  => value pairs, however there is no strict structure imposed on the value.
 * @property {array} misc Holds miscellaneous data as key=>value pairs.
 * @property {_Abstract} error This is the error object to be
 *  returned. Each error object must implement the JsonPayloadErrorInterface to
 *  be set. Also note that by setting an error you automatically are setting
 *  status to false.
 */
class JsonPayload {

    /**
     * Public constructed of the JsonPayload object.
     *
     * @access public
     * @author Oliver Lillie
     *
     * @param {*} data The main data to be returned by the payload object
     *  can be set here or later on through setting json.data = data;
     * @param {*} meta Any related meta.
     *
     * @throws \InvalidArgumentException
     */
    constructor(data, meta) {
        // no argument validation here since the data and meta are validated
        // through the setter functions.
           
        this.status = true;
        this.error = null;
        this.data = data || {};
        this.meta = meta || {};
    }

    /**
     * The status property signals the return response status.
     * It is a boolean value and if true means that the request completed
     * succesfully.
     *
     * @author Oliver Lillie
     * @access private
     * @type {boolean}
     * @default true
     */
    set status(status) {
        arg(status, ow.boolean);

        this._status = status;
    }

    get status() {
        return this._status;
    }

    /**
     * This is the error object to be returned. Each error object must implement
     * the JsonPayloadErrorInterface to be set. Also not that by setting an
     * error you automatically are setting status to false.
     *
     * @author Oliver Lillie
     * @access private
     * @type {Object|null}
     * @default null
     */
    set error(error) {
        arg(error, ow.any(
            ow.null,
            ow.object.instanceOf(_Abstract)
        ));

        this._error = error;

        this.status = !error;
    }

    get error() {
        return this._error;
    }

    /**
     * This is generally an array but can contain any value that is to be
     * returned by the request. However if it is an object, said object must
     * have a method encodeForJson to correctly work.
     *
     * @author Oliver Lillie
     * @access private
     * @type {Object|Array|null}
     * @default array()
     */
    set data(data) {
        arg(data, ow.any(
            ow.object,
            ow.array,
            ow.null
        ));

        this._data = data;
    }

    get data() {
        return this._data;
    }

    /**
     * Any specifically non requested data that the request may want to return
     * can be contained in this array. It ideally should be key => value pairs,
     * however there is no strict structure imposed on the value.
     *
     * @author Oliver Lillie
     * @access private
     * @type {Object|Array}
     * @default array()
     */
    set meta(meta) {
        arg(meta, ow.any(
            ow.object,
            ow.array
        ));

        this._meta = meta;
    }

    get meta() {
        return this._meta;
    }

    /**
     * Process a value and converts it from object or an array of objects to the
     * encoded for json array.
     *
     * @author Oliver Lillie
     *
     * @param {*} data
     *
     * @return {array|null}
     */
    _valueToArray(data) {
        // data could be any value type so no validation.

        if(data instanceof Object === true && typeof data.encodeForJson === 'function') {
            data = data.encodeForJson();
        } else if(data instanceof Array === true) {
            data = this._recursiveArrayEncodeForJson(data);
        }

        return data;
    }

    /**
     * Returns the payload as a raw js object.
     *
     * @access public
     * @return {Object}
     * @author Oliver Lillie
     */
    toObject() {
        return {
            status: this._status,
            error: this._valueToArray(this._error),
            data: this._valueToArray(this._data),
            meta: this._valueToArray(this._meta)
        };
    }

    /**
     * Recurses through an array of objects attempting to encode each object for
     * json.
     *
     * @access public
     * @author: Oliver Lillie
     *
     * @param {*} data An array of data to encode for json.
     *
     * @return {array}
     */
    _recursiveArrayEncodeForJson(data) {
        // data could be any value type so no validation.

        if(data instanceof Array === false) {
            return data;
        }

        return data.map(
            (value) => this._valueToArray(value)
        );
    }

    /**
     * Returns the json encoded JsonPayload string.
     *
     * @see JsonPayload.__toString
     * @access public
     * @return {string}
     * @author Oliver Lillie
     */
    toJson() {
        return JSON.stringify(this.toObject());
    }

}

module.exports = JsonPayload;