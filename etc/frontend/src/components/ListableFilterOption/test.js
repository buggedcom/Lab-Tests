import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import ListableFilterOption from './component';

configure({ adapter: new Adapter() });

describe(`<ListableFilterOption />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(
            <ListableFilterOption
                prop=""
                label=""
                onClick={() => {}}
            />
        );
        wrapper.unmount();
    });
});
