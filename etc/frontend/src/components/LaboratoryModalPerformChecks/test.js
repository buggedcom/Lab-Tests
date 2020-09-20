import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryModalPerformChecks from './component';

configure({ adapter: new Adapter() });

describe(`<LaboratoryModalPerformChecks />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<LaboratoryModalPerformChecks onRequestClose={()=>{}} onSaved={()=>{}} />);
        wrapper.unmount();
    });
});
