import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryTestListSortByFilterGroup from './component';

configure({ adapter: new Adapter() });

describe(`<LaboratoryTestListSortByFilterGroup />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<LaboratoryTestListSortByFilterGroup onSelectOption={()=>{}} />);
        wrapper.unmount();
    });
});
