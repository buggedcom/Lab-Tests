import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import App from './component';

configure({ adapter: new Adapter() });

describe(`<App />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<App />);
        wrapper.unmount();
    });
});
