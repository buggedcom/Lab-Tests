import React  from 'react';
import ReactModal from 'react-modal';

import _ModalSimple from "../_ModalSimple/component";
import ButtonSubmit from "../ButtonSubmit/component";
import ButtonCancel from "../ButtonCancel/component";
import Icon from "../Icon/component";

if (process.env.NODE_ENV !== 'testing') {
    ReactModal.setAppElement('#root');
}

/**
 * Extends _ModalSimple to provide slightly more complex functionality in
 * Modals. The description is treated as a `<details>` HTML5 element instead of
 * providing the content, allowing easy additions of more information summaries
 * at the top of complex modal forms. Because of this it also adds a summary
 * propType which is treated as the related `<summary>` HTML5 element content.
 *
 * Content is then derived by extending this modal in child classes and
 * overriding the `getContent` function to allow the child classes to interally
 * specify the content of the modal.
 *
 * @author Oliver Lillie
 */
export default class _Modal extends _ModalSimple {
    /** Provides a reference for any content node created in `getContent` **/
    contentRef = React.createRef();

    /**
     * This should return the content for the modal and should be overloaded by
     * any child class.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getContent() {
        return (
            <></>
        );
    }

    /**
     * Builds the `<details><summary>` HTML5 nodes based of if a
     * `props.description` has been given. If it hasn't the modal window does
     * not contain a more information summary at the top of the modal.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedDetails() {
        if(!this.props.description) {
            return null;
        }

        return (
            <details>
                <summary>
                    <Icon icon="info"/>
                    <span>{this.props.summary}</span>
                </summary>
                <p>{this.props.description}</p>
            </details>
        );
    }

    /**
     * Returns a list of classes to be given to the modal window.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedModalClassNameList() {
        let classes = super.getDerivedModalClassNameList();

        classes.push('_Modal');

        return classes;
    }


    /**
     * Returns a list of classes to be given to the modal window's overlay.
     *
     * @author Oliver Lillie
     * @return {string[]}
     */
    getDerivedModalOverlayClassNameList() {
        let classes = super.getDerivedModalOverlayClassNameList();

        classes.push('_Modal--overlay');

        return classes;
    }

    render() {
        // if the state of the component is not open then there is no point
        // rendering anything into the DOM yet, so short circuit here.
        if(!this.state.isOpen) {
            return null;
        }

        return (
            <ReactModal
                isOpen={this.state.isOpen}
                contentLabel={this.props.header}
                onRequestClose={this.closeModal}
                shouldCloseOnOverlayClick={false}
                className={this.getDerivedModalClassName()}
                overlayClassName={this.getDerivedModalOverlayClassName()}
                closeTimeoutMS={this.state.modalTimeout}
            >
                <section>
                    <header>{this.props.header}</header>
                    <main>
                        {this.getDerivedDetails()}
                        {this.getContent()}
                    </main>
                    <footer>
                        <div className="buttons buttons--left">
                            <ButtonCancel
                                label={this.props.cancelButtonLabel}
                                theme="transparent"
                                onClick={this.closeModal}
                            />
                        </div>
                        <div className="buttons buttons--right">
                            <span className={this.getDerivedStatusMessageClassName()}>{this.state.statusMessage}</span>
                            <ButtonSubmit
                                ref={this.submitButtonRef}
                                hoverType={this.props.saveButtonHoverType}
                                hasError={this.state.hasError && this.state.updateSubmitButtonWithResult}
                                hasSuccess={this.state.hasSuccess && this.state.updateSubmitButtonWithResult}
                                label={this.props.saveButtonLabel}
                                icon={this.state.hasSuccess && this.state.updateSubmitButtonWithResult ? 'tick' : this.props.saveButtonIcon}
                                processing={this.state.isProcessing}
                                onClick={this.handleModalSubmit}
                            />
                        </div>
                    </footer>
                </section>
            </ReactModal>
        );
    }
}
