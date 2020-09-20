import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import LaboratoryTestForm from './component';

configure({ adapter: new Adapter() });

describe(`<LaboratoryTestForm />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<LaboratoryTestForm onSubmitParent={()=>{}} registerSubmitElement={()=>{}} />);
        wrapper.unmount();
    });
});
