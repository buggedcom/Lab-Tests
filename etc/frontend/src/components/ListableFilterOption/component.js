import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * A internal compoment for `ListableFilterGroup` that represents a sorting
 * option that a parent component can be sorted by.
 *
 * @author Oliver Lillie
 */
export default class ListableFilterOption extends Component {
    static propTypes = {
        /** The property the parent list of objects to be sorted by if this
            option is selected. **/
        prop: PropTypes.string.isRequired,
        /** The label of the option. **/
        label: PropTypes.string.isRequired,
        /** Determines if the option is currently selected. **/
        selected: PropTypes.bool,
        /** Handles the event bubble up to `ListableFilterGroup` when the option
            becomes selected by a user. **/
        onClick: PropTypes.func.isRequired,
    };

    static defaultProps = {
        selected: false,
    };

    /**
     * Binds the events handlers.
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.bindEventHandlers();
    }

    /**
     * Binds the event handlers for option clicking to bubble back up to the
     * parent `ListableFilterGroup`.
     */
    bindEventHandlers() {
        this.handleClick = this.handleClick.bind(this);
    }

    /**
     * Handles the click of the option.
     *
     * @author Oliver Lillie
     * @param event
     */
    handleClick(event) {
        this.props.onClick(this.props.prop, event);
    }

    /**
     * Returns the derived class name depending if it has been selected or not.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedClassName() {
        if(this.props.selected === true) {
            return 'selected';
        }

        return null;
    }

    render() {
        return (
            <li className={this.getDerivedClassName()}
                onClick={this.handleClick}
            >{this.props.label}</li>
        );
    }
};