import _ButtonAction from "../_ButtonAction/component";

/**
 * Extends _ButtonAction to create a button component that has a default icon
 * `"save"`.
 *
 * @author Oliver Lillie
 */
export default class ButtonSubmit extends _ButtonAction {
    static defaultProps = {
        ..._ButtonAction.defaultProps,
        icon: 'save',
    };
};
