import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import Listable from './component';

configure({ adapter: new Adapter() });

describe(`<Listable />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(
            <Listable
                data={[]}
                onEditItem={()=>{}}
                onDeleteItem={()=>{}}
                emptyMessage=""
                emptyMessageAddItemDesktop=""
                emptyMessageAddItemResponsive=""
            />
        );
        wrapper.unmount();
    });
});
