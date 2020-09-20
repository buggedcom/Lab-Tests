import _Base from './_Base';
import ow from 'ow';
import HumanValidationError from '../HumanValidationError';
import LogicError from '../LogicError';

/**
 * This is the base model class for interacting records with the datasource via
 * lowdb. It provides some basic model schema validation to take the pain away
 * from creating a more "Active Record" type model solution.
 *
 * Any class that extends this should provide both a static function
 * `getTableReference` to reference the datasource table to be used when the
 * record is reading/writing.
 *
 * Additionally each class can extend/replace the default property schemas found
 * within this file by extending `schema` and chaining the `super` method calls.
 *
 * @author Oliver Lillie
 * @property id
 * @property dateCreated
 * @property dateUpdated
 */
class Record extends _Base {

    /**
     * Datasource filter function to find a specific record in the related table
     * by the given id.
     *
     * @author Oliver Lillie
     * @param {int} id
     * @return {false|*} Returns a hydrated record object if the id is found,
     *  otherwise false is returned when no match occurs.
     */
    static findById(id) {
        const row = this.getDataSource().get('table').find({
            id: id
        }).value();

        if(typeof row === 'undefined') {
            return false;
        }

        return new this(row);
    }

    /**
     * Handles the creation of a new record from a /POST request.
     *
     * The following things are ensured not to happen:
     * - the `postData` object cannot have any non-schema contained keys.
     * - the `postData` object can only contain values that have a `"public"`
     *   visibility value in the schema.
     * - all the required properties must have a value.
     * - all of the values must pass the validation.
     *
     * If any of the errors are encountered above then a HumanValidationError
     * error is thrown to be caught in the router.
     *
     * If everything is ok, then a new instance of the record is returned with
     * the property/value pairs from the `postData` object set into it.
     *
     * @author Oliver Lillie
     * @param {Object} postData
     * @throws HumanValidationError
     * @return {Record}
     */
    static createFromPost(postData) {
        const record = new this();

        const schema = record.schema();
        const postDataKeys = Object.keys(postData);

        if(postDataKeys.length === 0) {
            // security logging and hack detection would be implemented here in
            // order to actively track people who are "testing" the system.
            throw new HumanValidationError('The request cannot be empty.');
        }

        // the ensure that all fields being sent have public visibility and
        // there is not data that is trying to update private/protected fields.
        // If there
        const hasNonSchemaProperties = postDataKeys.filter((property) => typeof schema[property] === 'undefined');
        if(hasNonSchemaProperties.length > 0) {
            // security logging and hack detection would be implemented here in
            // order to actively track people who are "testing" the system.
            throw new HumanValidationError(`The following properties do not exist in the object and should be dropped from the request: ${hasNonSchemaProperties.join(', ')}.`);
        }

        // the ensure that all fields being sent have public visibility and
        // there is not data that is trying to update private/protected fields.
        // If there
        const hasNonPublicPropertyUpdates = postDataKeys.filter((property) => {
            const propertySchema = schema[property];
            if(typeof propertySchema.visibility !== 'undefined' && propertySchema.visibility !== 'public') {
                return true;
            }
        });
        if(hasNonPublicPropertyUpdates.length > 0) {
            // security logging and hack detection would be implemented here in
            // order to actively track people who are "testing" the system.
            throw new HumanValidationError(`The following properties are read only and cannot be written to: ${hasNonPublicPropertyUpdates.join(', ')}.`);
        }

        // next ensure that all the required properties have been sent to create
        // a new instance of the record. If there is some missing then feed back
        // a human error to the router to pick up.
        const hasEmptyRequiredProperties = postDataKeys.filter((property) => {
            const propertySchema = schema[property];
            if(propertySchema.required === true) {
                if(postData[property] === null && propertySchema.nullable === false) {
                    return true;
                }
                if(typeof postData[property] === 'undefined') {
                    return true;
                }
            }
        });
        if(hasEmptyRequiredProperties.length > 0) {
            throw new HumanValidationError(`The following properties are required and must be set: ${hasEmptyRequiredProperties.join(', ')}.`);
        }

        postDataKeys.forEach((property) => {
            record[property] = postData[property];
        });

        return record;
    }

    /**
     * Creates a schema object popuated with default values.
     *
     * @author Oliver Lillie
     * @param {*} obj
     * @return {any}
     * @private
     */
    static createSchemaObject(obj) {
        const defaults = {
            arg:null,
            writable:true,
            nullable:false,
            visibility:'public',
            cast:null,
            human:null,
            default:null,
        };

        return Object.assign(defaults, obj);
    }

    /**
     * Defines the basic schema properties into the object. And if data has not
     * been specified as the argument `data` then the default data will be
     * created for the instance based of the schema specifications.
     *
     * @author Oliver Lillie
     * @param {Object|undefined} data
     */
    constructor(data) {
        super();

        this._defineSchemaProperties();

        if(data) {
            this.hydrate(data);
        }
    }

    /**
     * This provides the default schema for a record in a datasource.
     * Child classes can easy extend this schema to allow easy CRUD api
     * features.
     *
     * Schema objects can take the following properties:
     * - arg        {ow} This allows the specification of `ow` argument
     *              validation chains to validate the properties value when it
     *              is being set.
     * - writable   {boolean} Determines if once the initial value is set away
     *              from null that the value can then be changed. Defaults to
     *              `true`.
     * - nullable   {boolean} Determines if the value can be nulled without
     *              having to specify that it can in the arg validation list.
     *              Defaults to `false`.
     * - visibility {string} Either `"public"`, `"protected"` or `"private"`. If
     *              the value is set to `"public"` then the value is returned in
     *              any /GET requests and is allowed to be updated in /PUT or
     *              /POST requests. If set to `"protected"` then the value is
     *              returned in the /GET requests but is not allowed to be
     *              updated in /POST or /PUT requests. If set to `"private"`
     *              then the value is neither exposed nor settable.
     * - cast       {Function} A callback to allow the casting of a value from
     *              a crud function to make sure the string based input value
     *              is in the right format for validation.
     * - human      {string|Function} If provided and any validation errors
     *              occur then this is the error that will be returned to the
     *              user. It should say what the expected format of the value
     *              is. If nothing is provided then the error message form any
     *              `arg` validation failure is returned so it's fairly
     *              important that anything that is `public` has a human error
     *              message so the end user is not confused. If the property has
     *              complex validation then you can use a function as a callback
     *              to generated an error message instead. The callback must
     *              return a string.
     * - default    If provided this is the default value of any property when
     *              an new instance is created.
     *
     * @author Oliver Lillie
     * @return {{dateCreated: {default: null, visibility: string, arg: NumberPredicate}, id: {nullable: boolean, visibility: string, arg: AnyPredicate<number | null>, writable: boolean}, dateUpdated: {default: null, visibility: string, arg: NumberPredicate}}}
     */
    schema() {
        return {
            id: Record.createSchemaObject({
                writable: false,
                nullable: true,
                arg: ow.any(ow.number.greaterThan(0), ow.null),
                visibility: 'protected'
            }),

            dateCreated: Record.createSchemaObject({
                arg: ow.number,
                visibility: 'protected',
                default: null
            }),

            dateUpdated: Record.createSchemaObject({
                arg: ow.number,
                visibility: 'protected',
                default: null
            })
        };
    }

    /**
     * Returns a property object for adding to the record class by
     * `Object.defineProperties`. The options are configured via the properties
     * schema settings provided by `this.schema()`.
     *
     *
     * @author Oliver Lillie
     * @param {string} property
     * @param {Object} propertySchema
     * @return {*}
     * @private
     */
    _getPropertySchemaDefinition(property, propertySchema) {
        // convert a variety of values into a callback for accessing a human
        // error message. If no error message exists then the call will return
        // null which will default to the ArgumentError.message being returned.
        const humanErrorType = typeof propertySchema.human;
        const humanError = humanErrorType === 'undefined'
            ? () => null
            : (humanErrorType === 'function'
            ? propertySchema.human
            : () => propertySchema.human);

        return {
            configurable: false,
            enumerable: !!propertySchema.enumerable,
            get() {
                return this['_' + property];
            },
            set(value) {
                if(propertySchema.writable === false && !propertySchema.nullable) {
                    throw new Error(`The property "${this['_' + property]}" is not writable and cannot be updated. "${value}" given.`);
                }

                if(typeof propertySchema.cast === 'function') {
                    value = propertySchema.cast(value);
                }

                if((value !== null || propertySchema.nullable === false) && !!propertySchema.arg) {
                    try{
                        // important that this is `ow` and not `arg` since `arg` is
                        // disabled in production environments
                        ow(value, propertySchema.arg);
                    } catch(ArgumentError) {
                        throw new HumanValidationError(humanError(value) || ArgumentError.message);
                    }
                }

                this['_' + property] = value;
            },
        }
    }

    /**
     * Processes the property schema's as defined in `this.schema()` and creates
     * new properties on the object based on those schemas.
     *
     * @author Oliver Lillie
     * @private
     */
    _defineSchemaProperties() {
        const schema = this.schema();

        let properties = {};
        Object.keys(schema).forEach(
            (property) => {
                properties[property] = this._getPropertySchemaDefinition(property, schema[property]);
            }
        );

        Object.defineProperties(this, properties);
    }

    /**
     * Hydrates the record object with data from an input object. Because of the
     * "magic" nature of the schema properties when values are hydrated into the
     * record they are validated for sanity.
     *
     * Any "gaps" in property/value pairs from the input object will be filled
     * by the property defaults set in the schema.
     *
     * @author Oliver Lillie
     * @param {Object} object
     */
    hydrate(object) {
        object = Object.assign(this._createDefaultDataFromSchema(), object);

        Object.keys(object).forEach((key) => {
            this[key] = object[key];
        });
    }

    /**
     * Ensures that the required fields have a value.
     *
     * A LogicError is thrown if a property does not have a value but is
     * required.
     *
     * @author Oliver Lillie
     * @throws LogicError
     * @private
     */
    _ensureRequiredFieldsHaveValue() {
        const schema = this.schema();

        // check that there are no properties missing any required values.
        const hasMissingFields = Object.keys(schema).filter((key) => {
            const propertySchema = schema[key];
            if(propertySchema.required === true) {
                // however if the field is nullable and the value held is null
                // this is allowed in order to allow null values to be treated
                // as a value.
                if(this[key] === null && propertySchema.nullable === false) {
                    return true;
                }
                if(typeof this[key] === 'undefined') {
                    return true;
                }
            }
        });

        if(hasMissingFields.length > 0) {
            throw new LogicError(`Object "${this.constructor.name}" has properties that are required but not set. The following fields are required: ${hasMissingFields.join(', ')}`);
        }
    }

    /**
     * Handles the adding of the record into the data source.
     *
     * The id is automatically given the current `autoIncrement` id held in the
     * data store, as well as the `dateCreated` and `dateUpdated` properties
     * having their value updated to the current timestamp.
     *
     * The autoIncrement value is also incremented within the datastore for the
     * next insert.
     *
     * @author Oliver Lillie
     * @private
     */
    _insert() {
        const dataSource = (this.constructor).getDataSource();

        // updating the autoincrementing id is not exactly atomic but it will
        // do for this test code considering there will not be multiple users
        // running the code at once.
        const autoIncrement = dataSource.get('autoIncrement').value();
        dataSource.set('autoIncrement', autoIncrement + 1).write();

        this.id = autoIncrement;

        this.dateCreated =
        this.dateUpdated = parseInt(Date.now().toString(), 10);

        dataSource.get('table')
            .push(this.toObject())
            .write();
    }

    /**
     * Handles the updating of an existing record into the datasource.
     *
     * The `dateUpdated` property is updated to the current timestamp before the
     * record updates are written.
     *
     * @author Oliver Lillie
     * @private
     */
    _update() {
        const dataSource = (this.constructor).getDataSource();

        this.dateUpdated = parseInt(Date.now().toString(), 10);

        // whilst this find -> assign -> write is not atomically safe and should
        // be checked, for the sake of this test code I'm only mentioning that
        // it would be done for production ready code.
        dataSource.get('table')
            .find({ id: this.id })
            .assign(this.toObject())
            .write();
    }

    /**
     * Writes the record to the datastore. If the record currently has an id
     * then the record is treated as needing updating vs, not having it, in
     * which case the value is updated instead.
     *
     * @author Oliver Lillie
     * @return {Record}
     */
    write() {
        this._ensureRequiredFieldsHaveValue();

        if(!this.id) {
            this._insert();
        } else {
            this._update();
        }

        return this;
    }

    /**
     * Updates a record based on input data from a /PUT request.
     *
     * Only properties with public visibility can be updated.
     *
     * If an error is encountered in the validation of any property value then
     * a HumanValidationError error is thrown to be caught in the router.
     *
     * @author Oliver Lillie
     * @param {Object} putData Data from `request.body`
     * @throws HumanValidationError
     * @return {boolean} Returns true if the value has been found to be
     *  updateable.
     */
    updateFromPut(putData) {
        const schema = this.schema();

        let hasUpdate = false;
        Object.keys(schema).forEach((property) => {
            if(typeof putData[property] === 'undefined') {
                // security/hack logging detection would be implemented here
                // in order to actively track people who are "testing" the
                // system.
                return;
            }

            // we only want to accept from a PUT those properties which are
            // exposed as public properties, therefore we filter out protected
            // or private properties.
            const propertySchema = schema[property];
            if(typeof propertySchema.visibility !== 'undefined' && propertySchema.visibility !== 'public') {
                // security/hack logging detection would be implemented here
                // in order to actively track people who are "testing" the
                // system.
                return;
            }

            this[property] = putData[property];

            hasUpdate = true;
        });

        return hasUpdate;
    }

    /**
     * Handles the removing of the record from its' related datasource.
     *
     * @author Oliver Lillie
     */
    remove() {
        if(!this.id) {
            throw new Error(`Unable to remove an instance of "${this.constructor.name}" because the instance has no id.`);
        }

        (this.constructor).getDataSource().get('table').remove({
            id: this.id
        }).write();
    }

    /**
     * Process the schema objects from `this.schema()` and sets a property/value
     * pair in the returned object with either the declared default value or
     * the other related schema settings.
     *
     * @author Oliver Lillie
     * @private
     */
    _createDefaultDataFromSchema() {
        const schema = this.schema();

        let data = {};
        Object.keys(schema).forEach((property) => {
            const propertySchema = schema[property];
            if(typeof propertySchema.visibility !== 'undefined' && propertySchema.visibility !== 'public') {
                return;
            }

            let value;
            if(typeof propertySchema.default !== 'undefined') {
                value = propertySchema.default;
            } else if(propertySchema.nullable === true) {
                value = null;
            } else {
                value = '';
            }

            data[property] = value;
        });

        return data;
    }

    /**
     * Converts the record into a plain js object.
     *
     * IMPORTANT: This does not pay respect to the properties schema visibility
     * setting. If you need a plain js object that has paid attention to not
     * return `private` properties then you should instead call
     * `this.encodeForJson()`
     *
     * @author Oliver Lillie
     * @return {Object}
     */
    toObject() {
        let data = {};
        Object.keys(this.schema()).forEach((property) => data[property] = this[property]);

        return data;
    }

    /**
     * Handles encoding of the record object for insertion into the JsonPayload
     * object. Only `public` or `protected` values are return in the return
     * object. `private` properties are ommitted.
     *
     * @author Oliver Lillie
     * @return {Object}
     */
    encodeForJson() {
        let data = {};

        const schema = this.schema();
        Object.keys(schema).forEach((property) => {
            // we only want to encode public (which is default if not specified)
            // or protected schema properties. Therefore when encoding for json
            // we don't want to expose any private values in the api request.
            const propertySchema = schema[property];
            if(typeof propertySchema.visibility === 'undefined' || ['public', 'protected'].indexOf(propertySchema.visibility) >= 0) {
                data[property] = this[property]
            }
        });

        return data;
    }

}

module.exports = Record;