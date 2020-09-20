import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/component';

import './styles.scss';

/**
 * Base component class for buttons within the app.
 *
 * @author Oliver Lillie
 */
export default class _Button extends Component {
    static propTypes = {
        /** Disables the button as per `button[disabled]`. **/
        disabled: PropTypes.bool,
        /** Controls the label of the button. **/
        label: PropTypes.string,
        /** If set then this is the icon (from /components/Icon/selection.json) to be used inside the button. **/
        icon: PropTypes.string,
        /** If set then when the button is hovered over the icon prop is updated to this icon. **/
        hoverIcon: PropTypes.string,
        /** The onClick handler for the button. **/
        onClick: PropTypes.func.isRequired,
        /** The size of the button. **/
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        /** The theme of the button. **/
        theme: PropTypes.oneOf(['primary', 'secondary', 'transparent']),
        /** Sets the button to be shown as a button that has errored. **/
        hasError: PropTypes.bool,
        /** Sets the button to be shown as a button that has success. **/
        hasSuccess: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        label: null,
        icon: null,
        hoverIcon: null,
        size: 'medium',
        theme: 'primary',
        hasError: false,
        hasSuccess: false
    };

    /**
     * Sets the `state.activeIcon` to the value from `props.icon`.
     *
     * @author Oliver Lillie
     * @param {*} props
     */
    constructor(props) {
        super(props);

        this.state = {
            activeIcon: props.icon
        };

        this.bindEventHandlers();
    }

    /**
     * Binds the components event handlers to the class.
     *
     * @author Oliver Lillie
     */
    bindEventHandlers() {
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
    }

    /**
     * Handles the buttons onClick event and bubbles it to the `onClick` prop.
     * The props `onClick` scope is bound to the button.
     *
     * @author Oliver Lillie
     * @param event
     */
    handleClick(event) {
        if(this.props.disabled) {
            return;
        }

        if(typeof this.props.onClick !== 'undefined') {
            this.props.onClick.bind(this)(event);
        }
    }

    /**
     * Handles the mouse out event, which if using `props.hoverIcon` updates the
     * `state.activeIcon`.
     *
     * @author Oliver Lillie
     */
    handleMouseOut() {
        if(!this.props.icon || !this.props.hoverIcon) {
            return;
        }

        this.setState({
            activeIcon: this.props.icon
        });
    }

    /**
     * Handles the mouse over event, which if using `props.hoverIcon` updates
     * the `state.activeIcon`.
     *
     * @author Oliver Lillie
     */
    handleMouseOver() {
        if(!this.props.icon || !this.props.hoverIcon) {
            return;
        }
        this.setState({
            activeIcon: this.props.hoverIcon
        });
    }

    /**
     * Returns a list of class names that is to be added to the buttons class
     * attribute.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedClassNameList() {
        let classes = ['_Button', '_Button--size-' + this.props.size];

        let theme = '_Button--theme-' + this.props.theme;
        classes.push(theme);

        const icon = this.getDerivedIconValue();
        if(icon) {
            classes.push('_Button--icon-' + icon);
        } else {
            classes.push('_Button--no-icon');
        }

        if(this.props.hasError === true) {
            theme += '--errored';
        } else if(this.props.hasSuccess === true) {
            theme += '--success';
        }
        classes.push(theme);

        return classes;
    }

    /**
     * Returns a space seperated list of class names to be added to the
     * `className` property of the button.
     *
     * @see this.getDerivedClassNameList
     * @author Oliver Lillie
     * @return {string}
     */
    getDerivedClassName() {
        return this.getDerivedClassNameList().join(' ');
    }

    /**
     * This function is for child classes to overload in order to provide an
     * icon that is used as the default icon if the `props.icon` value is set
     * to `true`.
     *
     * @author Oliver Lillie
     * @return {null}
     */
    getDefaultTrueIcon() {
        return null;
    }

    /**
     * Returns the icon that should be used by the button, if any.
     *
     * @author Oliver Lillie
     * @return {null|string}
     */
    getDerivedIconValue() {
        if(this.state.activeIcon === null) {
            return null;
        }

        let icon;
        if(this.state.activeIcon === true) {
            icon = this.getDefaultTrueIcon();
        } else {
            icon = this.state.activeIcon;
        }

        if(!icon) {
            return null;
        }

        return icon;
    }

    /**
     * Returns the Icon component if an icon is being used in the button.
     * Otherwise null returns.
     *
     * @author Oliver Lillie
     * @return {null|Icon}
     */
    getDerivedIcon() {
        const icon = this.getDerivedIconValue();
        if(!icon) {
            return null;
        }

        return (
            <Icon className={'icon-' + icon} icon={icon} />
        );
    }

    /**
     * Returns the disabled state of the button. This function is designed to be
     * overloaded by child classes in case addition props determine the disabled
     * state of the button.
     *
     * @author Oliver Lillie
     * @return {Boolean}
     */
    getDerivedDisabledState() {
        return this.props.disabled;
    }

    /**
     * @author Oliver Lillie
     * @return {*}
     */
    render() {
        return (
            <button
                className={this.getDerivedClassName()}
                disabled={this.getDerivedDisabledState()}
                onClick={this.handleClick}
                onMouseOut={this.handleMouseOut}
                onMouseOver={this.handleMouseOver}
            >
                {this.getDerivedIcon()}
                <span>{this.props.label}</span>
            </button>
        );
    }
};
