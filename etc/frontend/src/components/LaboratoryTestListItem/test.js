import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryTestListItem from './component';

configure({ adapter: new Adapter() });

describe(`<LaboratoryTestListItem />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(
            <LaboratoryTestListItem
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
