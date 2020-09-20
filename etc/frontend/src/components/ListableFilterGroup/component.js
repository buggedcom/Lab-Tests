import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListableFilterOption from "../ListableFilterOption/component";

/**
 * Provides a Listable filter group that can be used to control the sort/order
 * of the data.
 *
 * @author Oliver Lillie
 */
export default class ListableFilterGroup extends Component {
    static propTypes = {
        /** The state name used in the parent component state to control the
            parent components list order. **/
        sortRef: PropTypes.string.isRequired,
        /** The header label for the filter group. **/
        label: PropTypes.string.isRequired,
        /** The available sort options for the group. **/
        options: PropTypes.arrayOf(
            PropTypes.shape({
                /** The property that the list will sort by if the option is
                    selected. **/
                prop: PropTypes.string.isRequired,
                /** The label of the sort option. **/
                label: PropTypes.string.isRequired
            })
        ),
        /** The current value of the selected sort option. **/
        selected: PropTypes.string,
        /** The event bubble callback for a change in the selected sort options.
         **/
        onSelectOption: PropTypes.func.isRequired
    };

    /**
     * Binds the event handlers.
     *
     * @author Oliver Lillie
     * @param props
     */
    constructor(props) {
        super(props);

        this.bindEventHandlers();
    }

    /**
     * Binds the event handlers to the component.
     *
     * @author Oliver Lillie
     */
    bindEventHandlers() {
        this.handleOptionSelect = this.handleOptionSelect.bind(this);
    }

    /**
     * Handles the select of an option inside the group and bubbles it up to
     * the parent component through calling `props.onSelectOption`.
     *
     * @author Oliver Lillie
     * @param {string} prop
     */
    handleOptionSelect(prop) {
        this.props.onSelectOption(this.props.sortRef, prop);
    }

    /**
     * Returns the list of available sort options.
     *
     * @author Oliver Lillie
     * @return {ListableFilterOption[]}
     */
    getDerivedOptionList() {
        return this.props.options.map((option) => (
            <ListableFilterOption
                key={option.prop}
                prop={option.prop}
                label={option.label}
                onClick={this.handleOptionSelect}
                selected={this.props.selected === option.prop}
            />
        ));
    }

    render() {
        return (
            <li className="group">
                <label>{this.props.label}</label>
                <ul>
                    {this.getDerivedOptionList()}
                </ul>
            </li>
        );
    }
};