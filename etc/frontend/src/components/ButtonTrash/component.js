import _ButtonAction from "../_ButtonAction/component";

import './styles.scss';

/**
 * Extends _ButtonAction to create a button component that has a default icon
 * `"trash"` which changes on hover over to `"trash-open"`. It also removes any
 * default label.
 *
 * @author Oliver Lillie
 */
export default class ButtonTrash extends _ButtonAction {
    static defaultProps = {
        ..._ButtonAction.defaultProps,
        icon: 'trash',
        hoverIcon: 'trash-open',
        label: null
    };

    /**
     * Updates the button classes to contain ButtonTrash classes which give the
     * button special "negative" hover styles to pre-warn a user that they are
     * about to perform a negative action.
     *
     * @author Oliver Lillie
     */
    getDerivedClassNameList() {
        let classes = super.getDerivedClassNameList();

        classes.push('ButtonTrash');

        if(this.props.label) {
            classes.push('ButtonTrash--has-label');
        }

        return classes;
    }
};
