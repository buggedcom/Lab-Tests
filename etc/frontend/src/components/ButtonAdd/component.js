import _ButtonAction from "../_ButtonAction/component";

/**
 * Extends _ButtonAction to create a button component that has a default icon
 * `"add"`.
 *
 * @author Oliver Lillie
 */
export default class ButtonAdd extends _ButtonAction {
    static defaultProps = {
        ..._ButtonAction.defaultProps,
        icon: 'add'
    };
};
