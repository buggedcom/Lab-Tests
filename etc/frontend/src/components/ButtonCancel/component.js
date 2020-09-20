import _Button from "../_Button/component";

/**
 * Extends _Button to create a button component that has no default icon but
 * a default label of `"Cancel"`.
 *
 * @author Oliver Lillie
 */
export default class ButtonCancel extends _Button {
    static defaultProps = {
        ..._Button.defaultProps,
        label: 'Cancel',
        icon: null
    };
};
