import React, { Component } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';

import ButtonSubmit from "../ButtonSubmit/component";
import ButtonCancel from "../ButtonCancel/component";

import './styles.scss';

if (process.env.NODE_ENV !== 'testing') {
    ReactModal.setAppElement('#root');
}

/**
 * Creates a basic modal window for the application with header, main and
 * footer actions. It utilises `react-modal`.
 *
 * @author Oliver Lillie
 */
export default class _ModalSimple extends Component {
    submitButtonRef = React.createRef();

    static propTypes = {
        /** Controls the open and closed state of the modal window. **/
        isOpen: PropTypes.bool,
        /** This sends the signal up the calmlstack that the modal wants to close
            itself. It's neccesary to send the signal up for the parent to
            change the `isOpen` prop of the modal in order to prevent various
            stack looping issues. This might not be the best way to handle this
            and should be re-examined at some point. **/
        onRequestClose: PropTypes.func.isRequired,
        /** This is the text that is entered into the header of the modal window
         **/
        header: PropTypes.string,
        /** This is the content that will be populated into the modal window.
         **/
        description: PropTypes.string,
        /** This is the _Button.label prop of the cancel/close modal button. **/
        cancelButtonLabel: PropTypes.string,
        /** This is the _Button.label prop of the positive modal action button.
         **/
        saveButtonLabel: PropTypes.string,
        /** This is the _Button.icon prop of the positive modal window action
            button. **/
        saveButtonIcon: PropTypes.string,
        /** This is the _Button.hoverIcon prop of the positive modal window
            action button. **/
        saveButtonHoverIcon: PropTypes.string,
        /** This is the _Button.hoverType prop of the positive modal window
            action button. **/
        saveButtonHoverType: PropTypes.oneOf(['positive', 'negative', null]),
    };

    static defaultProps = {
        isOpen: false,
        summary: 'More Information',
        cancelButtonLabel: 'Cancel',
        saveButtonLabel: 'Save',
        saveButtonIcon: 'save',
        saveButtonHoverIcon: null,
        saveButtonHoverType: null,
        description: null
    };

    /**
     * Sets the initial state for `state.isOpen` from the props.
     *
     * @author Oliver Lillie
     * @inheritDoc
     */
    static getDerivedStateFromProps(props, state) {
        return {
            isOpen: props.isOpen
        };
    }

    /**
     * Sets the initial state by calling `_ModalSimple.getInitialState` and
     * binds the modals event handlers.
     *
     * In addition a protected variable `unmounted` is set to determine if the
     * modal window has been removed from the DOM.
     *
     * @author Oliver Lillie
     * @param {*} props
     */
    constructor(props) {
        super(props);

        this.state = this.getInitialState();

        this.bindEventHandlers();

        this.unmounted = false;
    }

    /**
     * Clears any state timeouts that have been created from calling
     * `_ModalSimple.delay` and sets the protected variable `unmounted` to true.
     *
     * @author Oliver Lillie
     */
    componentWillUnmount() {
        this.unmounted = true;
        this.state.timeouts.forEach(clearTimeout);
    }

    /**
     * Binds event handlers.
     *
     * @author Oliver Lillie
     */
    bindEventHandlers() {
        this.closeModal = this.closeModal.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
    }

    /**
     * The modals have their initial states reset at various points and
     * therefore in order to facilitate ease of reset this function returns the
     * initial state of the modal.
     *
     * @author Oliver Lillie
     * @return {{hasSuccess: boolean, initialValues: {}, isOpen: Boolean, modalTimeout: number, timeouts: Array, isProcessing: boolean, updateSubmitButtonWithResult: boolean, hasError: boolean, statusMessage: null, status: null}}
     */
    getInitialState() {
        return {
            timeouts: [],
            status: null,
            isOpen: this.props.isOpen,
            statusMessage: null,
            updateSubmitButtonWithResult: false,
            hasError: false,
            hasSuccess: false,
            isProcessing: false,
            modalTimeout: 150,
            initialValues: {}
        };
    }

    /**
     * Used to delay function calls by x millisecs.
     *
     * The timeouts created from calling this function are tracked and when the
     * component is unmounted the setTimeouts are canceled. This is to prevent
     * any updates to the component from setTimeouts when the modal becomes
     * unmounted.
     *
     * @author Oliver Lillie
     * @param {Function} fn
     * @param {number} millisecs
     */
    delay(fn, millisecs) {
        if(this.unmounted === true) {
            return;
        }
        
        this.state.timeouts.push(
            setTimeout(() => {
                if(this.unmounted) {
                    return;
                }
                fn();
            }, millisecs)
        );
    }

    /**
     * This handles the submit of a modal button and is called from the positive
     * modal window action.
     *
     * This should be extended by any child class.
     *
     * @author Oliver Lillie
     * @param {Event} event
     */
    handleModalSubmit(event) {
        // to be overridden by child classes.
        this.setModalStateAsSuccess(null, true);

        this.delay(
            () => {
                this.closeModal();
            },
            1500
        );
    }

    /**
     * Closes the modal window -ish. It sets the internal state of the window,
     * but then fires of a call to `props.onRequestClose` callback to get the
     * parent to change the `prop.isOpen` value of the modal. The callback is
     * done in a delay in order to all the css transitions to fade out the modal
     * before calling the parent. This is because the parent will usually remove
     * the component node instead of just setting the props.isOpen value and if
     * the component were just removed there would be no smooth transition out.
     *
     * @author Oliver Lillie
     * @param event
     */
    closeModal(event) {
        this.setState({
            status: 'closed'
        });

        // in order to accomodate the transitions for the close of the modal
        // windows, we need to request the close of the modal in a short delay
        // in the amount that corresponds to the transition animation length
        // so the dialog is animated out before removal
        this.delay(
            () => {
                this.setState({
                    status: null
                });
                this.props.onRequestClose(event);
            },
            150
        );
    }

    /**
     * Sets the internal state of the modal as in an error state. The message is
     * shown next to the positive action button. If the
     * `updateSubmitButtonWithResult` is set to true then the the styles of the
     * primary positive action button is updated to also be in an error state.
     *
     * @author Oliver Lillie
     * @param {string} message
     * @param {boolean|undefined} updateSubmitButtonWithResult
     */
    setModalStateAsError(message, updateSubmitButtonWithResult) {
        this.setState({
            statusMessage: message,
            updateSubmitButtonWithResult: updateSubmitButtonWithResult,
            hasError: true,
        });
    }

    /**
     * Sets the internal state of the modal as in a success state. The message
     * is shown next to the positive action button. If the
     * `updateSubmitButtonWithResult` is set to true then the the styles of the
     * primary positive action button is updated to also be in a success state.
     *
     * @author Oliver Lillie
     * @param {string} message
     * @param {boolean|undefined} updateSubmitButtonWithResult
     */
    setModalStateAsSuccess(message, updateSubmitButtonWithResult) {
        this.removeModalState();
        this.setState({
            statusMessage: message,
            hasSuccess: true,
            updateSubmitButtonWithResult: updateSubmitButtonWithResult,
            modalTimeout: 1500
        });
    }

    /**
     * Removes any error or success state (from
     * _ModalSimple.setModalSuccessState or _ModalSimple.setModalStateAsError)
     * from the modal window, including any message put next to the primary
     * positive action button.
     *
     * @author Oliver Lillie
     */
    removeModalState() {
        this.setState({
            updateSubmitButtonWithResult: false,
            statusMessage: null,
            hasError: false,
            hasSuccess: false,
        });
    }

    /**
     * Sets the modal's state as processing. This should be called when any form
     * or XHR triggered from the modal when the modal is submitting. It updates
     * the primary positive action button and puts it in a processing state.
     *
     * @author Oliver Lillie
     */
    setModalAsProcessing() {
        this.setState({
            isProcessing: true
        });
    }

    /**
     * Removes the processing state added from _ModalSimple.setModalAsProcessing
     *
     * @author Oliver Lillie
     */
    removeModalProcessingState() {
        this.setState({
            isProcessing: false
        });
    }

    /**
     * Buils the status message (from setting a success or error state) class
     * list.
     *
     * @author Oliver Lillie
     * @return {string}
     */
    getDerivedStatusMessageClassName() {
        let classes = ['status-message'];

        if(this.state.hasError === true) {
            classes.push('status-message--error');
        } else if(this.state.hasSuccess === true) {
            classes.push('status-message--success');
        } else {
            classes.push('status-message--hidden');
        }

        return classes.join(' ');
    }

    /**
     * Returns an array of classes that the modal dialog should be given.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedModalClassNameList() {
        let classes = ['_ModalSimple'];

        if(this.state.hasSuccess === true) {
            classes.push('_ModalSimple--state-success');
        }

        classes.push('_ModalSimple--status-' + (this.state.status || 'none'));

        return classes;
    }

    /**
     * Returns the modal classes by calling
     * _ModalSimple.getDerivedModalClassNameList and then joining the results.
     *
     * @author Oliver Lillie
     * @return {string}
     */
    getDerivedModalClassName() {
        return this.getDerivedModalClassNameList().join(' ');
    }

    /**
     * Returns an array of classes that the modal overlay should be given.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedModalOverlayClassNameList() {
        let classes = ['_ModalSimple__Overlay'];

        if(this.state.hasSuccess === true) {
            classes.push('_ModalSimple__Overlay--state-success');
        }

        classes.push('_ModalSimple__Overlay--status-' + (this.state.status || 'none'));

        return classes;
    }

    /**
     * Returns the modals overlay classes by calling
     * _ModalSimple.getDerivedModalOverlayClassNameList and then joining the
     * results.
     *
     * @author Oliver Lillie
     * @return {string}
     */
    getDerivedModalOverlayClassName() {
        return this.getDerivedModalOverlayClassNameList().join(' ');
    }

    /**
     * Splits `props.description` by line breaks and adds <br> breaks in place
     * to allow simple formatting.
     *
     * @author Oliver Lillie
     * @return {*[]}
     */
    getDerivedDescription() {
        return this.props.description.split(/(?:\r\n|\r|\n)/g).map((item, key) => {
            return (
                <span key={key}>{item}<br/></span>
            );
        });
    }

    render() {
        return (
            <ReactModal
                isOpen={this.state.isOpen}
                contentLabel={this.props.header}
                onRequestClose={this.closeModal}
                shouldCloseOnOverlayClick={false}
                className={this.getDerivedModalClassName()}
                overlayClassName={this.getDerivedModalOverlayClassName()}
                closeTimeoutMS={this.state.modalTimeout}
            >
                <section>
                    <header>{this.props.header}</header>
                    <main>
                        {this.getDerivedDescription()}
                    </main>
                    <footer>
                        <div className="buttons buttons--left">
                            <ButtonCancel
                                label={this.props.cancelButtonLabel}
                                theme="transparent"
                                onClick={this.closeModal}
                            />
                        </div>
                        <div className="buttons buttons--right">
                            <span className={this.getDerivedStatusMessageClassName()}>{this.state.statusMessage}</span>
                            <ButtonSubmit
                                ref={this.submitButtonRef}
                                hoverType={this.props.saveButtonHoverType}
                                hoverIcon={this.props.saveButtonHoverIcon}
                                hasError={this.state.hasError && this.state.updateSubmitButtonWithResult}
                                hasSuccess={this.state.hasSuccess && this.state.updateSubmitButtonWithResult}
                                label={this.props.saveButtonLabel}
                                icon={this.state.hasSuccess ? 'tick' : this.props.saveButtonIcon}
                                processing={this.state.isProcessing}
                                onClick={this.handleModalSubmit}
                            />
                        </div>
                    </footer>
                </section>
            </ReactModal>
        );
    }
}
