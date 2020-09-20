import React from 'react';
import PropTypes from 'prop-types';
import IcomoonReact from 'icomoon-react';

import iconSet from './selection.json';
import './styles.scss';

/**
 * Creates a component wrapper for the IcomoonReact component and provides
 * additional functionality of being able to provide both a `props.className`
 * and `props.spin` value.
 *
 * `props.spin` adds a class to spin the icon - basically used for loading
 * spinners.
 *
 * @author Oliver Lillie
 * @param {string|null} color
 * @param {string|number} size
 * @param {string} icon
 * @param {boolean} spin
 * @param className
 * @return {*}
 * @constructor
 */
const Icon = ({ color, size, icon, spin, className }) => {
    return (
        <IcomoonReact
            iconSet={iconSet}
            color="rgba(0, 0, 0)"
            size={size}
            icon={icon}
            className={(spin ? 'spin' : '') + ' ' + className}
        />
    );
};

Icon.propTypes = {
    /** Any class to be added to the icon. **/
    className: PropTypes.string,
    /** The name of any icon in `./selection.json`. **/
    icon: PropTypes.string.isRequired,
    /** The hard coded size of the icon. Should raelly be set via css classes
        using `font-size`. **/
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /** If true, then the component is given a `"spin"` class which spins the
        icon. **/
    spin: PropTypes.bool
};

Icon.defaultProps = {
    className: '',
    size: '1em',
    spin: false
};

export default Icon;