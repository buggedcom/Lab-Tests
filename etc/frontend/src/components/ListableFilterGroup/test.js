import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import ListableFilterGroup from './component';

configure({ adapter: new Adapter() });

describe(`<ListableFilterGroup />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(
            <ListableFilterGroup
                sortRef=""
                label=""
                options={[]}
                onSelectOption={() => {}}
            />
        );
        wrapper.unmount();
    });
});
