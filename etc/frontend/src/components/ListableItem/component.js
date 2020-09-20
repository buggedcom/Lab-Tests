import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ButtonEdit from '../ButtonEdit/component';
import ButtonTrash from '../ButtonTrash/component';

import './styles.scss';
import ConfirmDeletionModal from "../ConfirmDeletionModal/component";

/**
 * An internal base component for `Listable` to present data within a list. It
 * can be used on its own, however it has very basic presentation and should be
 * extended by a child class for better ui experience.
 *
 * @author Oliver Lillie
 */
export default class ListableItem extends Component {
    static propTypes = {
        /** The id of the related item to allow edit and delete etc. **/
        id: PropTypes.number.isRequired,
        /** The name of the item being presented. **/
        name: PropTypes.string.isRequired,
        /** Any other associated data for the item. This would typically be used
            by any class extending this component. **/
        item: PropTypes.object.isRequired,
        /** Determines if the item is editable. If true then an edit button is
            shown that when clicked triggers the `props.onEdit` callback. **/
        editable: PropTypes.bool.isRequired,
        /** Determines if the item is deletable. If true then an delete button
            is shown that when clicked triggers the `props.onDelete` callback.
         **/
        deletable: PropTypes.bool.isRequired,
        /** The callback for bubbling the edit request up to the parent
            components **/
        onEdit: PropTypes.func.isRequired,
        /** The callback for bubbling the delete request up to the parent
            components after a confirmation of deletion has taken place. **/
        onDelete: PropTypes.func.isRequired,
        /** The description to be entered into the `ConfirmDeletionModal` when
            the delete button is clicked. **/
        confirmDeleteDescription: PropTypes.string.isRequired,
        /** The confirm delete button label of the `ConfirmDeletionModal` when
            the delete button is clicked. **/
        confirmDeleteButtonLabel: PropTypes.string.isRequired,
        /** The message shown to the user when the item is successfully deleted.
         **/
        deletedSuccessMessage: PropTypes.string.isRequired,
    };

    static defaultProps = {
        abbrv: null,
    };

    /**
     * Binds the event handlers and sets up the initial state.
     *
     * Additionally sets a protected `unmounted` property used to determine if
     * the component has been unmounted from the DOM.
     *
     * @param {Object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            confirmDeleteIsTransitioning: false,
            confirmDelete: false,
            timeouts: [],
        };

        this.bindEventHandlers();

        this.unmounted = false;
    }

    /**
     * Sets the protected property `unmounted` so that any delayed actions are
     * not triggered on the unmounted component which causes errors.
     *
     * @author Oliver Lillie
     */
    componentWillUnmount() {
        this.unmounted = true;
        this.state.timeouts.forEach(clearTimeout);
    }

    /**
     * Binds the event handles to the component.
     *
     * @author Oliver Lillie
     */
    bindEventHandlers() {
        this.handleEditOnClick = this.handleEditOnClick.bind(this);
        this.handleDeleteOnClick = this.handleDeleteOnClick.bind(this);
        this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
        this.handleDeleteConfirmation = this.handleDeleteConfirmation.bind(this);
    }

    /**
     * Used to delay function calls by x millisecs.
     *
     * The timeouts created from calling this function are tracked and when the
     * component is unmounted the setTimeouts are canceled. This is to prevent
     * any updates to the component from setTimeouts when the modal becomes
     * unmounted.
     *
     * @author Oliver Lillie
     * @param {Function} fn
     * @param {number} millisecs
     */
    delay(fn, millisecs) {
        if(this.unmounted === true) {
            return;
        }

        this.state.timeouts.push(
            setTimeout(() => {
                if(this.unmounted) {
                    return;
                }
                fn();
            }, millisecs)
        );
    }

    /**
     * Handles the edit onclick event bubble.
     *
     * @author Oliver Lillie
     */
    handleEditOnClick() {
        this.props.onEdit(this.props.id);
    }

    /**
     * Handles the delete onclick confirmation modal open.
     *
     * @author Oliver Lillie
     */
    handleDeleteOnClick() {
        this.setState({
            confirmDeleteIsTransitioning: true,
            confirmDelete: true
        });
    }

    /**
     * Handles the confirmation of deletion event bubble.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    handleDeleteConfirmation() {
        return this.props.onDelete(this.props.id);
    }

    /**
     * Closes the confirmation of deletion modal but is put into a timeout
     * before finally setting the closed state so that the modal has time to
     * transition out nicely before being removed.
     *
     * @author Oliver Lillie
     */
    closeConfirmationModal() {
        this.setState({
            confirmDelete: false
        });

        this.delay(
            () => {
                this.setState(
                    {
                        editModalIsTransitioning: false,
                    }
                );
            },
            300
        );
    }

    /**
     * Returns the truncated name of the test so that the confirmation button in
     * the delet econfirmation modal doesn't get too big. Could possibly be done
     * by css truncation in the future.
     *
     * @author Oliver Lillie
     * @param {number} length The length to truncate to.
     * @return {string}
     */
    getDerivedTruncatedName(length) {
        if(this.props.name.length > length) {
            return this.props.name.slice(0, length) + "...";
        }
        return this.props.name;
    }

    /**
     * Returns the `ConfirmDeletionModal` component if the current state allows
     * it. This is to allow the modal to exist when transitioning from a open ->
     * closed state.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedConfirmationDeletionModal() {
        if(!this.state.confirmDelete && !this.state.confirmDeleteIsTransitioning) {
            return null;
        }

        return (
            <ConfirmDeletionModal
                description={this.props.confirmDeleteDescription.replace('%NAME%', this.props.name)}
                saveButtonLabel={this.props.confirmDeleteButtonLabel.replace('%NAME%', this.getDerivedTruncatedName(document.documentElement.classList.contains('lte-375') === true ? 23 : 30))}
                isOpen={this.state.confirmDelete}
                onRequestClose={this.closeConfirmationModal}
                deletedSuccessMessage={this.props.deletedSuccessMessage}
                onConfirm={this.handleDeleteConfirmation}
                saveButtonHoverType="negative"
            />
        );
    }

    /**
     * Returns a `ButtonEdit` component to be shown if the item allows editing
     * via `props.editable`
     *
     * @author Oliver Lillie
     * @return {ButtonEdit|null}
     */
    getDerivedEditButton() {
        if(this.props.editable === false) {
            return null;
        }

        return (
            <ButtonEdit
                label="Edit"
                icon="edit"
                size="small"
                theme="secondary"
                onClick={this.handleEditOnClick}
            />
        );
    }

    /**
     * Returns a `ButtonTrash` component to be shown if the item allows deleting
     * via `props.deletable`.
     *
     * @author Oliver Lillie
     * @return {ButtonTrash|null}
     */
    getDerivedDeleteButton() {
        if(this.props.editable === false) {
            return null;
        }

        return (
            <ButtonTrash
                size="small"
                theme="secondary"
                onClick={this.handleDeleteOnClick}
            />
        );
    }

    /**
     * Returns a list of classes to be applied to the list item node depending
     * on whether or not it is deletable or editable.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedClassList() {
        let classes = ['listable-item'];

        if(this.props.deletable === true) {
            classes.push('listable-item--deletable');
        }

        if(this.props.editable === true) {
            classes.push('listable-item--editable');
        }

        return classes;
    }

    /**
     * Returns the classes to be added to the list item node.
     *
     * @author Oliver Lillie
     * @return {string}
     */
    getDerivedClassName() {
        return this.getDerivedClassList().join(' ');
    }

    /**
     * Returns the intertior of the list item which should typically be extended
     * by any parent class in order to provide extra details rendering.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedInteriorRendering() {
        return (
            <span
                className="name"
                onClick={this.props.editable && this.handleEditOnClick}
            >{this.props.name}</span>
        );
    }

    render() {
        return (<>
            <li className={this.getDerivedClassName()} key={this.props.id}>
                {this.getDerivedEditButton()}
                {this.getDerivedInteriorRendering()}
                {this.getDerivedDeleteButton()}
            </li>

            {this.getDerivedConfirmationDeletionModal()}

        </>); 
    }
};
