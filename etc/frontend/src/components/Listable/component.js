import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ListableItem from '../ListableItem/component';

import './style.scss';

/**
 * A component for presenting "listed" data. It takes in data via `props.data`
 * and then creates `ListableItem` components out of the array of data.
 *
 * @author Oliver Lillie
 */
export default class Listable extends Component {
    static propTypes = {
        /** The component that is or extends ListableItem that will be used to
            render the items in the list. **/
        component: PropTypes.func,
        /** The array of objects to be listed. Each MUST have at least `id` and
            `name` properties. **/
        data: PropTypes.arrayOf(
            PropTypes.shape({
                /** The id of the item. **/
                id: PropTypes.number.isRequired,
                /** The name or label of the item. **/
                name: PropTypes.string.isRequired,
                /** Determines if the item can be deleted. If not set the
                    default value is `true`. **/
                deletable: PropTypes.bool,
                /** Determines if the item can be edited.  If not set the
                    default value is `true`. **/
                editable: PropTypes.bool,
            })
        ),
        /** A callback event for when an item has the edit button or name is
            clicked **/
        onEditItem: PropTypes.func.isRequired,
        /** A callback event for when an item has the delete button is clicked
         **/
        onDeleteItem: PropTypes.func.isRequired,
        /** The text to insert into the delete confirmation modal description.
         **/
        confirmDeleteDescription: PropTypes.string,
        /** The text to insert into the delete confirmation modal confirmation.
            button label. **/
        confirmDeleteButtonLabel: PropTypes.string,
        /** The success message to add to the confirmation modal when the
            deletion has been carried out. **/
        deletedSuccessMessage: PropTypes.string,
        /** The message to display when the list is empty. **/
        emptyMessage: PropTypes.string.isRequired,
        /** The message to display to desktop browser size about adding an item.
         **/
        emptyMessageAddItemDesktop: PropTypes.string.isRequired,
        /** The message to display to mobile browser size about adding an item.
         **/
        emptyMessageAddItemResponsive: PropTypes.string.isRequired,
    };

    static defaultProps = {
        component: ListableItem,
        confirmDeleteDescription: 'Please confirm you wish to delete this item.',
        confirmDeleteButtonLabel: 'Delete Item',
        deletedSuccessMessage: 'Item deleted ok',
    };

    /**
     * Binds event handlers.
     *
     * @author Oliver Lillie
     * @param {Object} props
     */
    constructor(props) {
        super(props);

        this.bindEventHandlers();
    }

    /**
     * Binds events handles to the components.
     *
     * @author Oliver Lillie
     */
    bindEventHandlers() {
        this.handleListableItemEdit = this.handleListableItemEdit.bind(this);
        this.handleListableItemDelete = this.handleListableItemDelete.bind(this);
    }

    /**
     * Bubbles the onEditItem request up to the parent component.
     *
     * @author Oliver Lillie
     * @param {number} id
     */
    handleListableItemEdit(id) {
        this.props.onEditItem(id);
    }

    /**
     * Bubbles the onDeleteItem request up to the parent component.
     *
     * @author Oliver Lillie
     * @param {number} id
     */
    handleListableItemDelete(id) {
        return this.props.onDeleteItem(id);
    }

    /**
     * Returns the dervied empty list message.
     *
     * @return {Element}
     */
    getDerivedEmptyMessage() {
        if(this.props.data.length > 0) {
            return null;
        }

        return (<>
            <p className="empty">{this.props.emptyMessage}
                <span className="hide-on-lte-768"><br />{this.props.emptyMessageAddItemDesktop}</span>
                <span className="hide-on-gt-768"><br />{this.props.emptyMessageAddItemResponsive}</span></p>
        </>);
    }

    /**
     * Returns the `ListableItem` (or other dending on `props.component`
     * components.
     *
     * @return {*[]}
     */
    getDerivedItems() {
        const ComponentName = this.props.component;
        return this.props.data.map((item) => {
            return (
                <ComponentName
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    editable={item.editable || true}
                    deletable={item.deletable || true}
                    item={item}
                    onEdit={this.handleListableItemEdit}
                    onDelete={this.handleListableItemDelete}
                    confirmDeleteDescription={this.props.confirmDeleteDescription}
                    confirmDeleteButtonLabel={this.props.confirmDeleteButtonLabel}
                    deletedSuccessMessage={this.props.deletedSuccessMessage}
                />
            );
        });
    }

    render() {
        return (<>
            {this.getDerivedEmptyMessage()}
            <ul>
                {this.getDerivedItems()}
            </ul>
        </>);
    }
}


