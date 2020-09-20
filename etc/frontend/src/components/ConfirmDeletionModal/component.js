import ConfirmationModal from "../ConfirmationModal/component";

import './styles.scss';
import PropTypes from "prop-types";

/**
 * Extends the ConfirmationModal component to provide a modal that is styled in
 * the form of a "negative" feedback modal, ie in your face and different than
 * normal modals so that the user is immediately alerted to a change in tone of
 * the modal.
 *
 * The prop defaults are same, however they should really be overriden by props
 * for user clarity.
 *
 * @author Oliver Lillie
 */
export default class ConfirmDeletionModal extends ConfirmationModal {

    static propTypes = {
        ...ConfirmationModal.propTypes,
        /** This is the message that is displayed via
            `_ModalSimple.setModalStateAsSuccess` when a deletion has been
            performed and the result from the server is ok. **/
        deletedSuccessMessage: PropTypes.string,
        /** This is the callback to the parent component that is triggered
            when the user confirms that they want to delete the item by clicking
            the positive action button in the modal window. The function must
            return a promise. If the promise resolves with a message when the
            deletion has successfully completed then that message is used
            instead of `props.deletedSuccessMessage`. If the request is not
            successful then the promise should be rejected with a message to be
            displayed to the user. **/
        onConfirm: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ...ConfirmationModal.defaultProps,
        header: 'Confirm Deletion',
        description: 'Please confirm you wish to delete this item.',
        cancelButtonLabel: 'Cancel',
        saveButtonIcon: 'trash',
        saveButtonHoverIcon: 'trash-open',
        saveButtonLabel: 'Delete Item',
        deletedSuccessMessage: 'Item deleted'
    };

    /**
     * Updates the modal's overlay class list with `ConfirmDeletionModal` for
     * styling purposes.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedModalOverlayClassNameList() {
        let classes = super.getDerivedModalClassNameList();

        classes.push('ConfirmDeletionModal');

        return classes;
    }

    /**
     * Updates the modal class list with `ConfirmDeletionModal` for styling
     * purposes.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedModalClassNameList() {
        let classes = super.getDerivedModalClassNameList();

        classes.push('ConfirmDeletionModal');

        return classes;
    }

    /**
     * Handles the clicking of the positive action button (ie the confirm delete
     * button). If the `state.isProcessing` is not already true then the modal
     * has its current state reset and set to processing. The `props.onConfirm`
     * is then called to send the request to the parent component.
     *
     * That request must return a promise. The promise can optionally resolve
     * or must reject with a message to be presented to the user. If it is
     * resolved with no message then the `props.deletedSuccessMessage` will be
     * used instead.
     *
     * If resolved then the modal is put into a successfull sate via
     * `_ModalSimple.setModalStateAsSuccess`, otherwise it will be put into an
     * error state with `_ModalSimple.setModalStateAsError`.
     *
     * If resolved the modal will self close after 1.5 seconds.
     *
     * @param event
     */
    handleModalSubmit(event) {
        // prevent double clicking
        if(this.state.isProcessing) {
            return;
        }

        this.removeModalState();
        this.setModalAsProcessing();

        this.props.onConfirm().then(
            (message) => {
                this.removeModalProcessingState();
                this.setModalStateAsSuccess(message || this.props.deletedSuccessMessage, true);
                this.delay(
                    () => {
                        this.closeModal();
                    },
                    1500
                );
            },
            (message) => {
                this.removeModalProcessingState();
                this.setModalStateAsError(message, true);
            }
        )
    }


}

