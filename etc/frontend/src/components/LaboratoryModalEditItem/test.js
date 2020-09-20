import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryModalEditItem from './component';

configure({ adapter: new Adapter() });

describe(`<LaboratoryModalEditItem />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<LaboratoryModalEditItem onRequestClose={()=>{}} onSaved={()=>{}} />);
        wrapper.unmount();
    });
});
