import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import Icon from './component';

configure({ adapter: new Adapter() });

describe(`<Icon />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<Icon icon="flask" />);
        wrapper.unmount();
    });
});
