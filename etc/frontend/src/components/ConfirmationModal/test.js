import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import ConfirmationModal from './component';

configure({ adapter: new Adapter() });

describe(`<ConfirmationModal />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<ConfirmationModal onRequestClose={()=>{}} />);
        wrapper.unmount();
    });
});
