import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryTestListOrderByFilterGroup from './component';

configure({ adapter: new Adapter() });

describe(`<LaboratoryTestListOrderByFilterGroup />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<LaboratoryTestListOrderByFilterGroup onSelectOption={()=>{}} />);
        wrapper.unmount();
    });
});
