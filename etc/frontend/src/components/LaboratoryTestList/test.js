import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryTestList from './component';
import LaboratoryTestListItem from "../LaboratoryTestListItem/test";

configure({ adapter: new Adapter() });

describe(`<LaboratoryTestList />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(
            <LaboratoryTestList
                header=""
                description=""
                summary=""
            />
        );
        wrapper.unmount();
    });
});
