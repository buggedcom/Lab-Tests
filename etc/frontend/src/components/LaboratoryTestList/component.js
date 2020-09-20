import React, { Component } from 'react';
import PropTypes from "prop-types";

import LaboratoryModalCreateItem from '../LaboratoryModalCreateItem/component';
import LaboratoryModalEditItem from '../LaboratoryModalEditItem/component';
import LaboratoryModalPerformChecks from '../LaboratoryModalPerformChecks/component';
import LaboratoryTestListSortByFilterGroup, { defaultOption as defaultSortKey } from "../LaboratoryTestListSortByFilterGroup/component";
import LaboratoryTestListOrderByFilterGroup, { defaultOption as defaultOrderBy, props as orderByProps } from "../LaboratoryTestListOrderByFilterGroup/component";
import Listable from '../Listable/component';
import Button from "../_Button/component";
import ButtonAdd from "../ButtonAdd/component";
import Icon from "../Icon/component";
import LaboratoryTestListItem from "../LaboratoryTestListItem/component";

import './styles.scss';

/**
 * This is the main app component that lists out the data and sets up the
 * display logic of the main listing of tests, main actions, and list filters.
 *
 * Whilst this code is really just doing the lab tests the component is setup
 * in a more generic way since it could easily be extended further to be more of
 * a generic list compoment.
 *
 * @author Oliver Lillie
 */
export default class LaboratoryTestList extends Component {

    /** A reference used for toggling the responsive hide/show of the filters
        menu. **/
    filters = React.createRef();

    static propTypes = {
        /** The header of the list page. **/
        header: PropTypes.string.isRequired,
        /** The list can optionally have a description at the top of the page.
            If provided it is entered into a `<details>` element. **/
        description: PropTypes.string,
        /** If description is set, then this is the associated `<summary>`
            content. **/
        summary: PropTypes.string,
    };

    static defaultProps = {
        summary: 'More Information',
        description: null,
    };

    /**
     * Sets the inital state and binds the event handlers.
     *
     * @author Oliver Lillie
     * @param {Object} props
     */
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            sortKey: defaultSortKey,
            orderBy: defaultOrderBy,
            processingAdd: false,
            performChecksModalIsOpen: false,
            createModalIsOpen: false,
            editModalIsOpen: false,
            labTestId: false,
            list: []
        };

        this.bindEventHandlers();
    }

    /**
     * Loads up the list data from the API when the component has mounted.
     *
     * @author Oliver Lillie
     */
    componentDidMount() {
        this.setListStateFromApi();
    }

    /**
     * Binds all the event handlers.
     *
     * @author Oliver Lillie
     */
    bindEventHandlers() {
        this.closeCreateItemModalEditor = this.closeCreateItemModalEditor.bind(this);
        this.closeEditItemModalEditor = this.closeEditItemModalEditor.bind(this);

        this.handleResponsiveHeaderClick = this.handleResponsiveHeaderClick.bind(this);
        this.handleResponsiveFilterNavClick = this.handleResponsiveFilterNavClick.bind(this);
        this.handleResponsiveScrollerClick = this.handleResponsiveScrollerClick.bind(this);

        this.handleSort = this.handleSort.bind(this);

        this.handleButtonAddTest = this.handleButtonAddTest.bind(this);
        this.handleLabTestCreated = this.handleLabTestCreated.bind(this);

        this.handleOnEditItem = this.handleOnEditItem.bind(this);
        this.handleOnDeleteItem = this.handleOnDeleteItem.bind(this);
        this.handleLabTestUpdated = this.handleLabTestUpdated.bind(this);

        this.handleButtonPerformChecks = this.handleButtonPerformChecks.bind(this);
        this.closePerformChecksModalEditor = this.closePerformChecksModalEditor.bind(this);
    }

    /**
     * Requests the lab tests list data from the API and returns that data in
     * a resolved promise.
     *
     * The promise is rejected if the API returns a `json.status` = false
     * result.
     *
     * @return {Promise<any>}
     */
    loadListState() {
        return new Promise((resolve, reject) => {
            fetch('/api/1.0.0/laboratory-tests')
                .then((response) => response.json())
                .then(json => {
                    if(json.status === false) {
                        reject(json);
                    } else {
                        resolve(json.data);
                    }
                });
        });
    }

    /**
     * Request the list data to be loaded and then after that resolves it sets
     * it into the components state.
     *
     * @author Oliver Lillie
     */
    setListStateFromApi() {
        this.loadListState().then(
            (list) => {
                this.setState({
                    list,
                    loading: false,
                });
            },
            (json) => {
                // TODO - or not, this is just demo code.
            }
        )
    }

    /**
     * Handles the click of the header. When at or below the `lte-600`
     * breakpoint, the click toggles the filters `open` class to hide show the
     * filters menu.
     *
     * @author Oliver Lillie
     */
    handleResponsiveHeaderClick() {
        if(document.documentElement.classList.contains('lte-600')) {
             this.filters.current.classList.toggle('open');
        }
    }

    /**
     * When at or below the `lte-600` and the nav is open, any click on it,
     * including the filter options will close the menu again. Whilst this is
     * "kinda ok" user experience, in a proper user facing app more attention
     * would be paid to the responsive menu including swiping events etc.
     *
     * @author Oliver Lillie
     */
    handleResponsiveFilterNavClick() {
        if(document.documentElement.classList.contains('lte-600')) {
             this.filters.current.classList.toggle('open');
        }
    }

    /**
     * When clicking anywhere in the scroller, and at the `lte-600` breakpoint
     * any open menu is closed.
     *
     * @author Oliver Lillie
     */
    handleResponsiveScrollerClick() {
        if(document.documentElement.classList.contains('lte-600')) {
             this.filters.current.classList.remove('open');
        }
    }

    /**
     * Handles the click of the "Add Test" secondary action.
     *
     * @author Oliver Lillie
     */
    handleButtonAddTest() {
        this.openCreateItemModalEditor().then(
            () => {
                this.setState({
                    processingAdd: false
                });
            }
        );
    }

    /**
     * Handles the click of the "Perform Checks..." primary action.
     *
     * @author Oliver Lillie
     */
    handleButtonPerformChecks() {
        this.openPerformChecksModalEditor();
    }

    /**
     * Handles the event when a lab test has been created from a "create item"
     * modal. It pushes the data into the `state.list` array which rebuilds the
     * list.
     *
     * @author Oliver Lillie
     * @param {Object} object
     */
    handleLabTestCreated(object) {
        const list = this.state.list;
        list.push(object);

        this.setState({
            list: list
        });
    }

    /**
     * Handles the event when a lab test has been updated from the edit modal.
     * The existing test in `state.list` is found and replaced which in turn
     * causes the list to re-render.
     *
     * @author Oliver Lillie
     * @param {Object} object
     */
    handleLabTestUpdated(object) {
        const list = this.state.list;
        const index = list.findIndex((item) => item.id === object.id);
        list.splice(index, 1, object);

        this.setState({
            list: list
        });
    }

    /**
     * Handles the "edit" click, either from the edit button in the list items
     * or clicking on the name of the test in the list item and opens up the
     * editor modal.
     *
     * @author Oliver Lillie
     * @param {number} labTestId
     */
    handleOnEditItem(labTestId) {
        this.setState({
            editingLabTestId: labTestId
        }, () => {
            this.openEditItemModalEditor();
        });
    }

    /**
     * Handles the delete API request of a lab test which is called after the
     * user has confirmed that they want to delete the test.
     *
     * The actual remove item is done in a delay in order to prevent the
     * deletion of the test item from removing the confirmation modal before it
     * has shown the deletion message and faded nicely away.
     *
     * @author Oliver Lillie
     * @param {number} labTestId
     * @return {Promise<any>}
     */
    handleOnDeleteItem(labTestId) {
        return new Promise((resolve, reject) => {
            fetch('/api/1.0.0/laboratory-tests/' + labTestId, {
                method: 'DELETE'
            })
                .then((response) => response.json())
                .then(json => {
                    if(json.status === false) {
                        reject(json.error.message);
                    } else {
                        // this is done in a set timeout to ensure that the fade
                        // out animation of the modal is not affected by react
                        // removing the modal node when the list item is removed
                        setTimeout(() => {
                            this.removeItemFromDataAndUpdateState(labTestId);
                        }, 1900);
                        resolve();
                    }
                });
        });
    }

    /**
     * Finds and removes the related lab test from `state.list` which causes the
     * list to refresh.
     *
     * @author Oliver Lillie
     * @param {number} labTestId
     */
    removeItemFromDataAndUpdateState(labTestId) {
        const list = this.state.list;
        const index = list.findIndex((item) => item.id === labTestId);
        list.splice(index, 1);

        this.setState({
            list: list
        });
    }

    /**
     * Handles the sort state change from the filters.
     *
     * @author Oliver Lillie
     * @param {string} sortRef
     * @param {string} value
     */
    handleSort(sortRef, value) {
        this.setState({
            [sortRef]: value
        });
    }

    /**
     * Sorts an array of objects by a key in ascending order.
     *
     * @author Oliver Lillie
     * @param {string} sortKey
     * @param {object} a
     * @param {object} b
     * @return {number}
     */
    sortByKeyAscending(sortKey, a, b) {
        let va = (a[sortKey] === null) ? "" : "" + a[sortKey];
        let vb = (b[sortKey] === null) ? "" : "" + b[sortKey];
        if(va > vb) {
            return 1;
        }
        return -1;
    }

    /**
     * Sorts an array of objects by a key in descending order.
     *
     * @author Oliver Lillie
     * @param {string} sortKey
     * @param {object} a
     * @param {object} b
     * @return {number}
     */
    sortByKeyDescending(sortKey, a, b) {
        let va = (a[sortKey] === null) ? "" : "" + a[sortKey];
        let vb = (b[sortKey] === null) ? "" : "" + b[sortKey];
        if(va < vb) {
            return 1;
        }
        return -1;
    }

    /**
     * Opens up the create item modal by setting state, which returns a promise
     * that resolves after the state has been set.
     *
     * @author Oliver Lillie
     * @return {Promise<any>}
     */
    openCreateItemModalEditor() {
        return new Promise((resolve) => {
            this.setState(
                {
                    createModalIsOpen: true,
                    processingAdd: true
                },
                resolve
            );
        });
    }

    /**
     * Closes the create item modal by setting state.
     *
     * @author Oliver Lillie
     */
    closeCreateItemModalEditor() {
        this.setState({
            createModalIsOpen: false
        });
    }

    /**
     * Opens the edit item editor by setting state, which returns a promise that
     * resolves after the state has been set.
     *
     * @author Oliver Lillie
     * @return {Promise<any>}
     */
    openEditItemModalEditor() {
        return new Promise((resolve) => {
            this.setState(
                {
                    editModalIsOpen: true
                },
                resolve
            );
        });
    }

    /**
     * Closes the edit item modal by setting state.
     *
     * @author Oliver Lillie
     */
    closeEditItemModalEditor() {
        this.setState({
            editModalIsOpen: false
        });
    }

    /**
     * Opens the perform checks modal editor by setting state, which returns a
     * promise that resolves after the state has been set.
     *
     * @return {Promise<any>}
     */
    openPerformChecksModalEditor() {
        return new Promise((resolve) => {
            this.setState(
                {
                    performChecksModalIsOpen: true
                },
                resolve
            );
        });
    }

    /**
     * Closes the perform checks modal by setting state.
     *
     * @author Oliver Lillie
     */
    closePerformChecksModalEditor() {
        this.setState({
            performChecksModalIsOpen: false
        });
    }

    /**
     * Returns the derived class name of the list based of the loadig/loaded
     * `state.status` of the component.
     *
     * @author Oliver Lillie
     * @return {string}
     */
    getDerivedClassName() {
        let classes = ['list'];

        if(this.state.loading) {
            classes.push('loading');
        } else {
            classes.push('loaded');
        }

        return classes.join(' ');
    }

    /**
     * Returns the sorted list of lab tests.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedList() {
        const sortKey = this.state.sortKey;
        const orderBy = this.state.orderBy;
        const sortFunction = orderBy === orderByProps.ASC ? 'sortByKeyAscending' : 'sortByKeyDescending';

        return this.state.list.sort((a, b) => this[sortFunction](sortKey, a, b));
    }

    /**
     * Returns the `LaboratoryModalCreateItem` component if
     * `state.createModalIsOpen` is true, since there is no point rendering it
     * unless it is required.
     *
     * @author Oliver Lillie
     * @return {LaboratoryModalCreateItem|null}
     */
    getDerivedModalCreateItem() {
        if(!this.state.createModalIsOpen) {
            return null;
        }

        return (
            <LaboratoryModalCreateItem
                isOpen={this.state.createModalIsOpen}
                onRequestClose={this.closeCreateItemModalEditor}
                onSaved={this.handleLabTestCreated}
                saveButtonHoverType="positive"
            />
        );
    }

    /**
     * Returns the `LaboratoryModalEditItem` component if
     * `state.editModalIsOpen` is true, since there is no point rendering it
     * unless it is required.
     *
     * @author Oliver Lillie
     * @return {LaboratoryModalEditItem|null}
     */
    getDerivedModalEditItem() {
        if(!this.state.editModalIsOpen) {
            return null;
        }

        return (
            <LaboratoryModalEditItem
                isOpen={this.state.editModalIsOpen}
                labTestId={this.state.editingLabTestId}
                onRequestClose={this.closeEditItemModalEditor}
                onSaved={this.handleLabTestUpdated}
                saveButtonHoverType="positive"
            />
        );
    }

    /**
     * Returns the `LaboratoryModalPerformChecks` component if
     * `state.performChecksModalIsOpen` is true, since there is no point
     * rendering it unless it is required.
     *
     * @author Oliver Lillie
     * @return {LaboratoryModalPerformChecks|null}
     */
    getDerivedModalPerformChecks() {
        if(!this.state.performChecksModalIsOpen) {
            return null;
        }

        return (
            <LaboratoryModalPerformChecks
                isOpen={this.state.performChecksModalIsOpen}
                tests={this.state.list}
                onRequestClose={this.closePerformChecksModalEditor}
                onSaved={this.handleLabTestUpdated}
                saveButtonHoverType="positive"
            />
        );
    }

    /**
     * Returns the derived disabled state value of the perform checks primary
     * action.
     *
     * @author Oliver Lillie
     * @return {null|Button}
     */
    getDerivedPerformChecksActionButton() {
        if(this.state.list.length === 0) {
            return null;
        }

        return (
            <Button
                label="Perform Checks..."
                icon="flask-bubbles"
                processing={this.state.processingAdd}
                onClick={this.handleButtonPerformChecks}
            />
        );
    }

    render() {
        return (<>
            <nav ref={this.filters}
                 onClick={this.handleResponsiveFilterNavClick}
                 className="filters"
            >
                <div className="container">
                    <ul>
                        <LaboratoryTestListSortByFilterGroup
                            onSelectOption={this.handleSort}
                            selected={this.state.sortKey}
                        />

                        <LaboratoryTestListOrderByFilterGroup
                            onSelectOption={this.handleSort}
                            selected={this.state.orderBy}
                        />
                        
                    </ul>
                </div>
            </nav>

            <section>
                <header>
                    <h1 onClick={this.handleResponsiveHeaderClick}><span>{this.props.header}</span></h1>

                    <span className="actions">
                        {this.getDerivedPerformChecksActionButton()}
                        <ButtonAdd
                            label="Add New Lab Test"
                            processing={this.state.processingAdd}
                            onClick={this.handleButtonAddTest}
                            theme="secondary"
                        />
                    </span>

                </header>

                <div className="scroller"
                     onClick={this.handleResponsiveScrollerClick}
                >
                
                    <details>
                        <summary>
                            <Icon icon="info" />
                            {this.props.summary}
                        </summary>
                        <p>{this.props.description}</p>
                    </details>

                    <main className={this.getDerivedClassName()}>

                        <Listable
                            component={LaboratoryTestListItem}
                            data={this.getDerivedList()}
                            emptyMessage="There are no laboratory tests."
                            emptyMessageAddItemDesktop="You can add a new test by clicking the &quot;Add New Lab Test&quot; to the top right of the page."
                            emptyMessageAddItemResponsive="You can add a new test by clicking the plus icon at the bottom right of the page."
                            onEditItem={this.handleOnEditItem}
                            onDeleteItem={this.handleOnDeleteItem}
                            confirmDeleteDescription="Are you sure you want to delete the '%NAME%' lab test?"
                            confirmDeleteButtonLabel="Delete '%NAME%'"
                            deletedSuccessMessage="Lab test deleted ok!"
                        />

                    </main>

                </div>

            </section>

            {this.getDerivedModalCreateItem()}

            {this.getDerivedModalEditItem()}

            {this.getDerivedModalPerformChecks()}

        </>);
    }
}

