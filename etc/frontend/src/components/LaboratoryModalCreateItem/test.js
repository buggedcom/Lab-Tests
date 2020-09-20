import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryModalCreateItem from './component';

configure({ adapter: new Adapter() });

describe(`<LaboratoryModalCreateItem />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<LaboratoryModalCreateItem onRequestClose={()=>{}} onSaved={()=>{}} />);
        wrapper.unmount();
    });
});
