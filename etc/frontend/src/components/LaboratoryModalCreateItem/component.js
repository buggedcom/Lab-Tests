import React from 'react';
import PropTypes from 'prop-types';

import _Modal from "../_Modal/component";
import LaboratoryTestForm from "../LaboratoryTestForm/component";

/**
 * Extends _Modal and uses an empty LaboratoryTestForm component as the value of
 * the modal.
 * 
 * @author Oliver Lillie
 */
export default class LaboratoryModalCreateItem extends _Modal {

    static propTypes = {
        ..._Modal.propTypes,
        /** A callback for the parent component be notified about when a form
            is successfully saved and a new lab test is created. The `json.data`
            value is provided as the main argument. **/
        onSaved: PropTypes.func.isRequired,
        /** The success message given to the modal primary action button when
            a successfull create request is made. **/
        saveSuccessMessage: PropTypes.string
    };

    static defaultProps = {
        ..._Modal.defaultProps,
        header: 'Create Laboratory Test',
        description: 'Fill the requested fields below and click "Save New Lab Test" to add a new laboratory test.',
        saveButtonIcon: 'add',
        saveButtonLabel: 'Save New Lab Test',
        saveSuccessMessage: 'Lab test added ok!'
    };

    /**
     * This is a Formik workaround to allow a button outside of the scope of the
     * Formik form to submit the formik form. Not pretty, but it does allow the
     * formik form to work inside a modular modal window.
     *
     * @author Oliver Lillie
     * @see LaboratoryModalCreateItem.handleModalSubmit
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
     * @see LaboratoryModalCreateItem.registerSubmitElement
     * @param event
     */
    handleModalSubmit(event) {
        this.submitButton.click();
    }

    /**
     * Commits the form values to the API.
     *
     * If the API returns successfully then the `props.onSaved` callback is
     * fired.
     *
     * @param {object} values
     * @return {Promise<any>}
     */
    commitForm(values) {
        return new Promise((resolve, reject) => {
            fetch('/api/1.0.0/laboratory-tests/create', {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow",
                referrer: "no-referrer",
                body: JSON.stringify(values),
            })
                .then((response) => response.json())
                .then(json => {
                    if(json.status === false) {
                        reject(json);
                    } else {
                        resolve(json.data);
                        this.props.onSaved(json.data);
                    }
                });
        });
    }

    /**
     * Handles the submission of the modal window from the click of the positive
     * modal action button - or - submit of manual the formik form.
     *
     * When called the errors passed in are checked, then if ok, the state of
     * the modal is reset and set to processing and the form is commited.
     *
     * If the `commitForm`'s returned promise resolves then the processing state
     * is removed and entered into a success state and the
     * `props.saveSuccessMessage` is shown to the user. After 1.5 seconds the
     * modal self closes.
     *
     * If not succesfull then the modal is set into an error state.
     *
     * @author Oliver Lillie
     * @param {Object} errors
     * @param {Object} values
     * @return {Promise<any>}
     */
    onSubmit(errors, values) {
        return new Promise((resolve, reject) => {
            if(Object.keys(errors).length === 0) {
                this.removeModalState();
                this.setModalAsProcessing();
                this.commitForm(values)
                    .then((json) => {
                        this.removeModalProcessingState();
                        this.setModalStateAsSuccess(this.props.saveSuccessMessage, true);
                        this.delay(
                            () => {
                                this.closeModal();
                            },
                            1500
                        );
                    })
                    .catch((json) => {
                        this.removeModalProcessingState();
                        this.setModalStateAsError(json.error.message, true);
                        reject();
                    });
            } else {
                this.setModalStateAsError('Please fix the errors above', true);
                reject();
            }
        });
    }

    /**
     * Handles the bubbling of no error state from the form to remove any error
     * state from the modal window.
     *
     * @author Oliver Lillie
     */
    handleNoErrorEncountered() {
        this.removeModalState();
    }

    /**
     * Returns the content for the modal.
     *
     * @author Oliver Lillie
     * @return {LaboratoryTestForm}
     */
    getContent() {
        return (
            <LaboratoryTestForm
                onSubmit={this.handleModalSubmit.bind(this)}
                onNoErrorEncountered={this.handleNoErrorEncountered.bind(this)}
                onEncounteredError={this.handleModalSubmit.bind(this)}
                onSubmitParent={this.onSubmit.bind(this)}
                registerSubmitElement={this.registerSubmitElement.bind(this)}
                ref={this.contentRef}
            />
        );
    }

}

