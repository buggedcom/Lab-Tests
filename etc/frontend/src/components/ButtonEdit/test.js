import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import ButtonEdit from './component';

configure({ adapter: new Adapter() });

describe(`<ButtonEdit />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<ButtonEdit onClick={()=>{}} />);
        wrapper.unmount();
    });

    const props = {
        disabled: false,
        label: null,
        icon: "edit",
        hoverIcon: null,
        size: 'medium',
        theme: 'primary',
        hasError: false,
        hasSuccess: false,
        type: "primary",
        hoverType: null,
    };
    Object.keys(props).forEach((property) => {
        const defaultValue = props[property];
        it(`"${property}" default value = ${JSON.stringify(defaultValue)}`, function () {
            const props = mount(<ButtonEdit onClick={()=>{}} />).props();
            expect(props[property]).to.be.equal(defaultValue)
        });
    });

    it('has button', function () {
        const wrapper = shallow(<ButtonEdit onClick={()=>{}} />);
        expect(wrapper.find('button')).to.have.length(1);
        wrapper.unmount();
    });

    it('no icon has no svg', function () {
        const wrapper = shallow(<ButtonEdit onClick={()=>{}} />);
        expect(wrapper.find('svg')).to.have.length(0);
        wrapper.unmount();
    });

});
