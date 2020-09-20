import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import ListableItem from './component';
import LaboratoryTestListItem from "../LaboratoryTestListItem/test";

configure({ adapter: new Adapter() });

describe(`<ListableItem />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(
            <ListableItem
                id={0}
                name=""
                item={{}}
                editable={true}
                deletable={true}
                onEdit={() => {}}
                onDelete={() => {}}
                confirmDeleteDescription=""
                confirmDeleteButtonLabel=""
                deletedSuccessMessage=""
            />
        );
        wrapper.unmount();
    });
});
