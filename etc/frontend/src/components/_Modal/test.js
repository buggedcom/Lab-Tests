import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import _Modal from './component';

configure({ adapter: new Adapter() });

describe(`<_Modal />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<_Modal onRequestClose={()=>{}} />);
        wrapper.unmount();
    });
});
