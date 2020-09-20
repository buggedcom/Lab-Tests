import PropTypes from 'prop-types';

import _ButtonProcessing from '../_ButtonProcessing/component';

import './styles.scss';

/**
 * Extends _ButtonProcessing in order to provide "action" buttons , eg primary
 * and "secondary" which are used to associate highlighting and priority to
 * buttons.
 *
 * @author Oliver Lillie
 */
export default class _ButtonAction extends _ButtonProcessing {
    static propTypes = {
        ..._ButtonProcessing.propTypes,
        /** The type of action this should be. Primary is highlighted. Secondary
            if bordered and has a background of the same colour as the page.
            Transparent is the same as secondary except without a border. **/
        type: PropTypes.oneOf(['primary', 'secondary', 'transparent']),
        /** This determines the hover state of the button. A positive button
            makes the button highlight in a positive, ie green manour. A
            negative button has a "red" hover style to associate with a negative
            action. The distinction when used throughout an application is
            fairly obvious and aids the user from accidentally making a mistake.
         **/
        hoverType: PropTypes.oneOf(['positive', 'negative', null])
    };

    static defaultProps = {
        ..._ButtonProcessing.defaultProps,
        type: 'primary',
        hoverType: null
    };

    /**
     * Extends the classes of the button and adds class names for the
     * `prop.type` and the `prop.hoverType` values.
     *
     * @author Oliver Lillie
     */
    getDerivedClassNameList() {
        let classes = super.getDerivedClassNameList();

        classes.push('_ButtonAction', '_ButtonAction--' + this.props.type);

        if(this.props.hoverType !== null) {
            classes.push('_ButtonAction--hoverType-' + this.props.hoverType);
        }

        return classes;
    }
};
