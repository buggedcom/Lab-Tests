import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import ConfirmDeletionModal from './component';

configure({ adapter: new Adapter() });

describe(`<ConfirmDeletionModal />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<ConfirmDeletionModal onRequestClose={()=>{}} onConfirm={()=>{}} />);
        wrapper.unmount();
    });
});
