import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import FormTableRow from './component';

configure({ adapter: new Adapter() });

describe(`<FormTableRow />`, function () {
    it('renders without crashing', function () {
        const wrapper = shallow(
            <FormTableRow
                field={{id:"", name:"", label:""}}
            />
        );
        wrapper.unmount();
    });
});
