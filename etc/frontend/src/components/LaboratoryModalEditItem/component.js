import React from 'react';

import LaboratoryModalCreateItem from "../LaboratoryModalCreateItem/component";
import LaboratoryTestForm from "../LaboratoryTestForm/component";
import PropTypes from "prop-types";

/**
 * Extends the `LaboratoryModalCreateItem` modal form and preloads the form with
 * the tests details from the server. When the test data loads from the server
 * the form is hidden from the user and a loading message is shown.
 *
 * @author Oliver Lillie
 */
export default class LaboratoryModalEditItem extends LaboratoryModalCreateItem {
    static propTypes = {
        ...LaboratoryModalCreateItem.propTypes,
        /** This is the id of the lab test to load. **/
        labTestId: PropTypes.number
    };

    static defaultProps = {
        ...LaboratoryModalCreateItem.defaultProps,
        header: 'Edit Laboratory Test',
        description: 'Update the details of the test in the fields below and then click "Update Laboratory Test" to save.',
        saveButtonIcon: 'save',
        saveButtonLabel: 'Update Laboratory Test',
        labTestId:null,
        saveSuccessMessage: 'Lab test updated!'
    };

    /**
     * After the component mounts the data about the lab test is loaded from the
     * API and put into the components state.
     *
     * @author Oliver Lillie
     */
    componentDidMount() {
        if(this.props.labTestId) {
            this.setTestStateFromApi();
        }
    }

    /**
     * Aborts any active XHR from the component when unmounting to prevent any
     * updates to the component after it is no longer mounted.
     *
     * @author Oliver Lillie
     */
    componentWillUnmount() {
        super.componentWillUnmount();

        this.state.xhrControllerLoad.abort();
    }

    /**
     * Updates the initial state of the modal with the default values of the
     * lab test form.
     *
     * @author Oliver Lillie
     * @return {{hasSuccess: boolean, initialValues: {}, isOpen: Boolean, modalTimeout: number, timeouts: Array, isProcessing: boolean, updateSubmitButtonWithResult: boolean, hasError: boolean, statusMessage: null, status: null}}
     */
    getInitialState() {
        const state = super.getInitialState();

        state.xhrControllerLoad = new AbortController();
        state.name = '';
        state.abbrv = '';
        state.unit = '';
        state.goodRangeMin = null;
        state.goodRangeMax = null;
        state.status = 'unloaded';
        state.labTestId = null;

        return state;
    }

    /**
     * Saves the edit of the lab test to the API.
     *
     * If the request is successful then the `props.onSaved` is called with the
     * `json.data` from the request.
     *
     * @author Oliver Lillie
     * @param {Object} values
     * @return {Promise<any>}
     */
    commitForm(values) {
        return new Promise((resolve, reject) => {
            fetch('/api/1.0.0/laboratory-tests/' + this.props.labTestId, {
                method: "PUT",
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
     * Loads the state of the form data from the API and sets the state of the
     * modal as loading to only show the loading throbber and not the form.
     *
     * @author Oliver Lillie
     * @return {Promise<any>}
     */
    loadTestState() {
        this.setState({
            status: 'loading'
        });

        return new Promise((resolve, reject) => {
            fetch('/api/1.0.0/laboratory-tests/' + this.props.labTestId, {
                signal: this.state.xhrControllerLoad.signal
            })
                .then((response) => response.json())
                .then(json => {
                    if(json.status === false) {
                        this.setState({
                            status: 'rejected'
                        });

                        reject(json);
                    } else {
                        resolve(json.data);
                    }
                });
        });
    }

    /**
     * Request the data load and then sets the resolved data into the modals
     * current state.
     *
     * When the state is set the form is then shown.
     *
     * @author Oliver Lillie
     */
    setTestStateFromApi() {
        this.loadTestState().then(
            (test) => {
                this.setState({
                    ...test,
                    status: 'hydrated',
                    labTestId: this.props.labTestId
                });
            },
            (json) => {
                // TODO - or maybe not since this is really just demo code.
            }
        )
    }

    /**
     * Returns the form for the modal.
     *
     * @return {LaboratoryTestForm}
     */
    getContent() {
        return (
            <LaboratoryTestForm
                loading={this.state.status !== 'hydrated'}
                name={this.state.name}
                abbrv={this.state.abbrv}
                unit={this.state.unit}
                goodRangeMin={this.state.goodRangeMin}
                goodRangeMax={this.state.goodRangeMax}
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

