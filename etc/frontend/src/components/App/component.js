import React from 'react';

import Header from "../Header/component";
import LaboratoryTestList from "../LaboratoryTestList/component";

import './styles.scss';

/**
 * A basic component container for the two main parts of this app.
 * Nothing special happens here.
 *
 * @author Oliver Lillie
 */
export default function App() {
    return (<>

        <Header />

        <LaboratoryTestList
            header="Laboratory Tests"
            description="The list below contains the list of laboratory tests that are available. Each can be edited by clicking on the edit button, or deleted by clicking on the trash can icon to remove them from the list."
        />

    </>);
}

