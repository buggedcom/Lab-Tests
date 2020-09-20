import React from 'react';
import ListableItem from "../ListableItem/component";

import './styles.scss';

/**
 * Extends the `ListableItem`component to provide rendering of the lab test
 * abbreviations.
 *
 * @author Oliver Lillie
 */
export default class LaboratoryTestListItem extends ListableItem {

    /**
     * Returns a span for the abbreviation if found in `props.item.abbrv`.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedAbbreviation() {
        if(!this.props.item.abbrv) {
            return null;
        }

        return (
            <span className="abbrv">{this.props.item.abbrv}</span>
        );
    }

    /**
     * Adds the abbreviation into the default rendering of the listable item.
     *
     * @author Oliver Lillie
     * @return {*}
     */
    getDerivedInteriorRendering() {
        return (<>
            {super.getDerivedInteriorRendering()}
            {this.getDerivedAbbreviation()}
        </>);
    }
};
