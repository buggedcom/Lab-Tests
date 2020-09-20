import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { expect } from 'chai';

import ButtonSubmit from './component';

configure({ adapter: new Adapter() });

describe(`<ButtonSubmit />`, function () {
    it('renders without crashing', function () {
        const wrapper = mount(<ButtonSubmit onClick={()=>{}} />);
        wrapper.unmount();
    });

    const props = {
        disabled: false,
        label: null,
        icon: "save",
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
            const props = mount(<ButtonSubmit onClick={()=>{}} />).props();
            expect(props[property]).to.be.equal(defaultValue)
        });
    });

    it('has button', function () {
        const wrapper = shallow(<ButtonSubmit onClick={()=>{}} />);
        expect(wrapper.find('button')).to.have.length(1);
        wrapper.unmount();
    });

    it('no icon has no svg', function () {
        const wrapper = shallow(<ButtonSubmit onClick={()=>{}} />);
        expect(wrapper.find('svg')).to.have.length(0);
        wrapper.unmount();
    });

});

