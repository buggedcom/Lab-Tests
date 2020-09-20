import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from "yup";
import { withFormik } from "formik";

import _Modal from "../_Modal/component";
import FormTableRow from "../FormTableRow/component";

import './styles.scss';

const formikEnhancer = withFormik({
    enableReinitialize: true,

    validateOnBlur: false,

    validateOnChange: false,

    validationSchema: Yup.object().shape({
        test: Yup.number()
            .moreThan(0, 'Please select a laboratory test.')
            .required('Please select a lab test.'),
        value: Yup.number()
            .required('Please enter a value to check.')
            .typeError('The value entered must be a number.')
    }),

    displayName: 'LaboratoryModalPerformChecks', // helps with React DevTools
});

/**
 * Creates an instance of a Modal that contains the form for performing a lab
 * test value check.
 *
 * @author Oliver Lillie
 */
class LaboratoryModalPerformChecks extends _Modal {

    form = React.createRef();

    static propTypes = {
        ..._Modal.propTypes,
        /** Event bubble for when the form is submitted by clicking on the
            modals primary action button. **/
        onSaved: PropTypes.func.isRequired,
        /** The list of available tests to check. **/
        tests: PropTypes.arrayOf(
            PropTypes.shape({
                /** The id of the lab test. **/
                id: PropTypes.number.isRequired,
                /** The abbreviation of the lab test. **/
                abbrv: PropTypes.string,
                /** The name of the lab test. **/
                name: PropTypes.string.isRequired,
            }).isRequired
        )
    };

    static defaultProps = {
        ..._Modal.defaultProps,
        header: 'Check a Lab Result',
        description: 'Select a test from the dropdown and then enter the value of the result to check if the result is "OK" or "outside of" the good range.',
        cancelButtonLabel: 'Close',
        saveButtonIcon: 'equals',
        saveButtonLabel: 'Check Lab Result',
    };


    /**
     * This is a Formik workaround to allow a button outside of the scope of the
     * Formik form to submit the formik form. Not pretty, but it does allow the
     * formik form to work inside a modular modal window.
     *
     * @author Oliver Lillie
     * @see LaboratoryModalPerformChecks.handleModalSubmit
     * @param {Element} submitButton
     */
    registerSubmitElement(submitButton) {
        this.submitButton = submitButton;
    }

    /**
     * This is a Formik workaround to allow a button outside of the scope of the
     * Formik form to submit the formik form. Not pretty, but it does allow the
     * formik form to work inside a modular modal window.
     *
     * @author Oliver Lillie
     * @see LaboratoryModalPerformChecks.registerSubmitElement
     * @param event
     */
    handleModalSubmit(event) {
        this.submitButton.click();
    }

    /**
     * Handles form element blur to bubble error corrections up the component
     * stack.
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
     * Handles the form submission.
     *
     * It first validates the form for missing/incorrect requirements. If the
     * validation fails the modal is set into an error state.
     *
     * If ok it then puts the modal into a processing state and sends the
     * request off to the API for checking of the result. When the result
     * returns, it sets an error state for a value that is outside of the good
     * range, and if the value is inside the good range the modal is entered
     * into a success state. In either case the message that is returned from
     * the server regarding the result is displayed to the user.
     *
     * The modal is not automatically closed since the user might want to
     * perform and additional value test.
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

                this.setModalAsProcessing();
                this.props.setSubmitting(true);
                this.setState({
                    showErrors: false
                });

                const promise = this.submitXhr(values);
                if(promise && typeof promise.then === 'function') {
                    promise.then((data) => {
                        this.props.setSubmitting(false);
                        this.removeModalProcessingState();

                        if(data.status === false) {
                            this.setModalStateAsError(data.message, false);
                        } else {
                            this.setModalStateAsSuccess(data.message, true);
                        }
                    }).catch(() => this.props.setSubmitting(false));
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
     * Submits the value check request to the API.
     *
     * @author Oliver Lillie
     * @param {Object} values The form values.
     * @return {Promise<any>}
     */
    submitXhr(values) {
        return new Promise((resolve, reject) => {
            fetch(`/api/1.0.0/laboratory-tests/${values.test}/check/${values.value}` )
                .then((response) => response.json())
                .then(json => {
                    if(json.status === false) {
                        reject(json);
                    } else {
                        resolve(json.data);
                    }
                });
        });
    }

    /**
     * Sets the fields to touched so that if an error has occured when clicking
     * the submit button formik will show the errors if `touched` is true.
     *
     * @author Oliver Lillie
     * @param {boolean} touched
     */
    setFieldsTouched(touched) {
        this.props.setTouched({
            test: touched,
            value: touched,
        });
    }

    /**
     * Returns a list of class names to be given to the modal.
     *
     * @return {string[]}
     */
    getDerivedModalClassNameList() {
        let classes = super.getDerivedModalClassNameList();

        classes.push('lab-test-perform-check');

        return classes;
    }

    /**
     * Returns a list of class names to be given to the modal overlay.
     *
     * @return {string[]}
     */
    getDerivedModalOverlayClassNameList() {
        let classes = super.getDerivedModalOverlayClassNameList();

        classes.push('lab-test-perform-check');

        return classes;
    }

    /**
     * Returns the select for the select tests form element.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedFormTableTestSelect() {
        const options = this.props.tests.map((test) => {
            return {
                value : test.id,
                label: test.name + (test.abbrv ? ' (' + test.abbrv + ')' : ''),
            };
        });

        options.unshift({
            value: '-1',
            label: 'Please select test...'
        });

        const field = {
            name: 'test',
            label: 'Laboratory Test',
            type: 'select',
            options: options,
            required: true,
        };

        return (
            <FormTableRow
                key={field.name}
                field={field}
                error={this.props.errors[field.name]}
                value={this.props.values[field.name] || ''}
                isSubmitting={this.props.isSubmitting}
                touched={this.props.touched[field.name]}
                onBlur={this.handleFormElementBlur}
            />
        );
    }

    /**
     * Returns the number input for the value to check.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedFormTableCheckValue() {
        const field = {
            name: 'value',
            label: 'Value to Check',
            type: 'number',
            maxLength: 100,
            required: true,
        };

        return (
            <FormTableRow
                key={field.name}
                field={field}
                error={this.props.errors[field.name]}
                value={this.props.values[field.name] || ''}
                isSubmitting={this.props.isSubmitting}
                touched={this.props.touched[field.name]}
                onBlur={this.handleFormElementBlur}
            />
        );
    }

    /**
     * Returns the form content for the modal.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getContent() {
        const {
            errors,
            values,
            isSubmitting,
        } = this.props;

        return (
            <form onSubmit={(event) => this.onSubmitParent(event, errors, values)} ref={this.form}>
                <table>
                    <tbody>
                        {this.getDerivedFormTableTestSelect()}
                        {this.getDerivedFormTableCheckValue()}
                    </tbody>
                </table>

                <button ref={button => this.registerSubmitElement(button)} style={{display: 'none'}} type="submit" disabled={isSubmitting}>
                    Submit
                </button>
            </form>
        );
    }

}


export default formikEnhancer(LaboratoryModalPerformChecks);


