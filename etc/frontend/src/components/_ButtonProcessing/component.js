import PropTypes from 'prop-types';

import _Button from '../_Button/component';

import './styles.scss';

/**
 * Extends _Button class to provide a button that can be used to indicate a
 * process is underway. When put into processing the button has a processing
 * stripe bar at the bottom.
 *
 * @author Oliver Lillie
 */
export default class _ButtonProcessing extends _Button {
    static propTypes = {
        ..._Button.propTypes,
        /** Determines if the state of the button is in processing mode or not.
         **/
        processing: PropTypes.bool
    };

    static defaultProps = {
        ..._Button.defaultProps,
        processing: false
    };

    /**
     * Extends the classes for the button to added a processing class when
     * `props.processing = true`.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedClassNameList() {
        let classes = super.getDerivedClassNameList();

        classes.push('_Button--stripe');
        if(this.props.processing === true) {
            classes.push('_Button--stripe--processing');
        }

        return classes;
    }

    /**
     * If the button is processing then the button is disabled.
     *
     * @author Oliver Lillie
     * @return {boolean}
     */
    getDerivedDisabledState() {
        if(this.props.processing === true) {
            return true;
        }

        return super.getDerivedDisabledState();
    }
};
