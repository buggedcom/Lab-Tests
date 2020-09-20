import _ModalSimple from "../_ModalSimple/component";

/**
 * Extends the _ModalSimple modal component to provide a simple confirmation
 * style modal. It is designed to be extended however provides some sane-ish
 * defaults for header, description and button labels etc.
 *
 * @author Oliver Lillie
 */
export default class ConfirmationModal extends _ModalSimple {

    static defaultProps = {
        ..._ModalSimple.defaultProps,
        header: 'Confirm Action',
        description: 'Please confirm you wish do this action.',
        cancelButtonLabel: 'No',
        saveButtonIcon: 'tick',
        saveButtonLabel: 'Yes'
    };

    /**
     * Updates the modal class list with `ConfirmationModal` for styling
     * purposes.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedModalClassNameList() {
        let classes = super.getDerivedModalClassNameList();

        classes.push('ConfirmationModal');

        return classes;
    }

}

