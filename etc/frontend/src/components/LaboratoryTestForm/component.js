import React, { Component } from 'react';
import PropTypes from "prop-types";
import * as Yup from 'yup';
import { withFormik } from "formik";

import Icon from '../Icon/component';
import FormTableRow from "../FormTableRow/component";

import './styles.scss';

/**
 * Adds a special validation method for checking that the goodRangeMax is
 * greater than the goodRangeMin value if set.
 *
 * @author Oliver Lillie
 */
Yup.addMethod(
    Yup.number,
    'ifNotNullThenGreaterThanRefWhenRefHasValue',
    function(ref, msg) {
        return this.test({
            name: 'ifNotNullThenGreaterThanRefWhenRefHasValue',
            exclusive: false,
            // eslint-disable-next-line
            message: msg || '${path} must be greater than ${reference}',
            params: {
                reference: ref.path
            },
            test: function(value) {
                return typeof this.resolve(ref) === 'undefined'
                    || typeof value === 'undefined'
                    || value === null
                    || value >= this.resolve(ref)
            }
        })
    }
);

const formikEnhancer = withFormik({
    enableReinitialize: true,

    mapPropsToValues(props) {
        return {
            name: props.name,
            abbrv: props.abbrv,
            unit: props.unit,
            goodRangeMin: props.goodRangeMin,
            goodRangeMax: props.goodRangeMax,
        };
    },

    validateOnBlur: true,

    validateOnChange: false,

    validationSchema: Yup.object().shape({
        name: Yup.string()
            .strict(true)
            .trim()
            .min(2, 'The name of the test must be at least 2 characters long.')
            .max(255, 'The name of the test must be at less than 255 characters in length.')
            .required('The name of the test is required!'),
        abbrv: Yup.string()
            .strict(true)
            .trim()
            .min(1, 'The abbreviation of the test must be at least 1 character long.')
            .max(5, 'The abbreviation of the test must be at less than 5 characters in length.')
            .required('The abbreviation of the test is required!'),
        unit: Yup.string()
            .strict(true)
            .trim()
            .min(1, 'The unit of measurement for the test must be at least 1 characters long.')
            .max(20, 'The unit of measurement for the test must be at less than 20 characters in length.')
            .required('The unit of measurement for the test is required!'),
        goodRangeMin: Yup.number()
            .typeError('The minimum bounds of the "good value" range must be a number.'),
        goodRangeMax: Yup.number()
            .ifNotNullThenGreaterThanRefWhenRefHasValue(Yup.ref('goodRangeMin'), 'The maximum bounds of the "good value" must be greater than or equal to the minimum bounds value.')
            .typeError('The maximum bounds of the "good value" range must be a number.'),
    }),

    displayName: 'LaboratoryTestForm', // helps with React DevTools
});

/**
 * Creates the lab test form which is used by both the
 * `LaboratoryModalCreateItem` and `LaboratoryModalEditItem` components.
 *
 * @author Oliver Lillie
 */
class LaboratoryTestForm extends Component {

    form = React.createRef();

    static propTypes = {
        /** Determines if the form is loading. This is only used when the data
            to prepoulate the form is loaded from the server. **/
        loading: PropTypes.bool,
        /** The message to display when loading data from the server. **/
        loadingMessage: PropTypes.string,
        /** The name value to fill the form with initially. **/
        name: PropTypes.string,
        /** The abbreviation value to fill the form with initially. **/
        abbrv: PropTypes.string,
        /** The unit value to fill the form with initially. **/
        unit: PropTypes.string,
        /** The good range min value to fill the form with initially. **/
        goodRangeMin: PropTypes.number,
        /** The good range max value to fill the form with initially. **/
        goodRangeMax: PropTypes.number,
        // onSubmit: PropTypes.func.isRequired,
        /** The callback that will bubble the form submission event back up
            to the parent component. **/
        onSubmitParent: PropTypes.func.isRequired,
        /** The callback that will bubble that there are no errors encountered
            in the form back up to the parent component. **/
        onNoErrorEncountered: PropTypes.func,
        /** The callback that will bubble that there are errors encountered in
            the form back up to the parent component. **/
        onErrorEncountered: PropTypes.func,
        /** The api function to "hack": formik into accepting form submissions
            from outside of formik. **/
        registerSubmitElement: PropTypes.func.isRequired
    };

    static defaultProps = {
        loading: false,
        loadingMessage: 'Loading data, please wait.',
        name: '',
        abbrv: '',
        unit: '',
        goodRangeMin: null,
        goodRangeMax: null,
        onNoErrorEncountered: () => {},
        onErrorEncountered: () => {},
    };

    /**
     * Binds the event handles and sets the intial state.
     *
     * @author Oliver Lillie
     */
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showErrors: false,
            submitting: false,
        };

        this.bindEventHandlers();
    }

    /**
     * Binds the event handles to the component.
     *
     * @author Oliver Lillie
     */
    bindEventHandlers() {
        this.onSubmitParent = this.onSubmitParent.bind(this);
        this.handleFormElementBlur = this.handleFormElementBlur.bind(this);
    }

    /**
     * Handles the form element blur event to bubble up if there were/are errors
     * or not in the form.
     *
     * @author Oliver Lillie
     */
    handleFormElementBlur() {
        if(Object.keys(this.props.errors).length === 0) {
            this.props.onNoErrorEncountered();
        } else {
            this.props.onErrorEncountered();
        }
    }

    /**
     * Performs the validation of the form.
     *
     * If the validation fails then the form is forced into an error state to
     * show the error to the user by forcing the touched value inside formic.
     *
     * If the validation passes then the modal is put into a processing state
     * and the `props.onSubmitParent` callback is called. The promise returned
     * by the call, when resolved or rejected takes the modal out of a
     * processing state.
     *
     * @author Oliver Lillie
     * @param {Event} event
     * @param {Object} errors
     * @param {Object} values
     */
    onSubmitParent(event, errors, values) {
        event.preventDefault();

        this.props.validateForm().then(
            () => {
                if(Object.keys(this.props.errors).length > 0) {
                    this.setFieldsTouched(true);
                    this.setState({
                        showErrors: true
                    });
                    return;
                }

                this.props.setSubmitting(true);
                this.setState({
                    showErrors: false
                });

                const promise = this.props.onSubmitParent(errors, values);
                if(promise && typeof promise.then === 'function') {
                    promise.then(() => this.props.setSubmitting(false))
                        .catch(() => this.props.setSubmitting(false));
                } else {
                    this.props.setSubmitting(false);
                }
            },
            () => {
                this.setState({
                    showErrors: true
                })
            }
        ).catch(
            () => {
            }
        );
    }

    /**
     * Updates the fields, inside the form, `touched` value.
     *
     * @author Oliver Lillie
     * @param {boolean} touched
     */
    setFieldsTouched(touched) {
        const obj = {};
        this.getFieldComponents().forEach((field) => obj[field.name] = touched);
        this.props.setTouched(obj);
    }

    /**
     * Returns the list of fields for the lab test form.
     *
     * @author Oliver Lillie
     * @return {*[]}
     */
    getFieldComponents() {
        return [
            {
                name: 'name',
                label: 'Test name',
                type: 'text',
                hint: 'This is the full name of the test, but without any abbreviation.',
                minLength: 2,
                maxLength: 255,
                required: true,
                pattern: null
            },
            {
                name: 'abbrv',
                label: 'Abbreviation for test',
                hint: 'This must be the officially recognised abbreviation for the test.',
                type: 'text',
                minLength: 1,
                maxLength: 5,
                required: true,
                pattern: null
            },
            {
                name: 'unit',
                label: 'Unit of measurement',
                hint: 'eg. mmol/l, %, g/l etc',
                type: 'text',
                minLength: 1,
                maxLength: 20,
                required: true,
                pattern: null
            },
            {
                name: 'goodRangeMin',
                label: 'Min. bound for "good value"',
                hint: 'Only enter the numeric value, do not enter the unit of measurement.\nIf there is no minimum bound, leave empty.',
                type: 'number',
                minLength: null,
                maxLength: 100,
                required: false
            },
            {
                name: 'goodRangeMax',
                label: 'Max. bound for "good value"',
                hint: 'Only enter the numeric value, do not enter the unit of measurement.\nIf there is no maximum bound, leave empty.',
                type: 'number',
                minLength: null,
                maxLength: 100,
                required: false
            }
        ];
    }

    /**
     * Returns the `FormTableRow` components ready to put into the form.
     *
     * @author Oliver Lillie
     * @return {*[]}
     */
    getFields() {
        return this.getFieldComponents().map((field) => {
            return (
                <FormTableRow
                    key={field.name}
                    field={field}
                    error={this.props.errors[field.name]}
                    value={this.props.values[field.name] === null ? '' : this.props.values[field.name]}
                    isSubmitting={this.props.isSubmitting}
                    touched={this.props.touched[field.name]}
                    forceShowError={this.state.showErrors}
                    onBlur={this.handleFormElementBlur}
                />
            )
        });
    }

    /**
     * Returns the classes to be added to the form div wrapper.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedClassName() {
        let classes = ['lab-test-form'];

        if(this.props.loading) {
            classes.push('lab-test-form--loading');
        } else {
            classes.push('lab-test-form--loaded');
        }

        return classes.join(' ');
    }

    render() {
        const {
            errors,
            values,
            isSubmitting,
            registerSubmitElement
        } = this.props;

        return (
            <div className={this.getDerivedClassName()}>
                <div className="loader">
                    <span>{this.props.loadingMessage}</span>
                    <Icon icon="spinner" spin={true} />
                </div>

                <form onSubmit={(event) => this.onSubmitParent(event, errors, values)} ref={this.form}>
                    <table>
                        <tbody>
                            {this.getFields()}
                        </tbody>
                    </table>
                    
                    <button ref={button => registerSubmitElement(button)} style={{display: 'none'}} type="submit" disabled={isSubmitting}>
                        Submit
                    </button>
                </form>
            </div>
        );
    }
}

export default formikEnhancer(LaboratoryTestForm);

