import React from 'react';

import Icon from '../Icon/component';

import logo from './terveystalo-logo.svg';
import ekg from './ekg.svg';
import './styles.scss';

/**
 * Renders the header of the app.
 * 
 * @author Oliver Lillie
 * @param {Object} props
 * @return {*}
 * @constructor
 */
const Header = (props) => {
    return (
        <nav className="top-bar">
            <div className="upper" />
            <div className="middle">
                <img src={logo} alt="Terveystalo Logo" />
                <div className="labs">
                    <Icon icon="flask" />
                    <span>Labs</span>
                </div>
            </div>
            <div className="lower">
                <div className="line" />
                <img src={ekg} alt="EKG rhythm" />
            </div>
        </nav>
    );
};

export default Header;