import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import _ModalSimple from './component';

configure({ adapter: new Adapter() });

describe(`<_ModalSimple />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(
            <_ModalSimple
                onRequestClose={()=>{}}
                description=""
            />
        );
        wrapper.unmount();
    });
});
