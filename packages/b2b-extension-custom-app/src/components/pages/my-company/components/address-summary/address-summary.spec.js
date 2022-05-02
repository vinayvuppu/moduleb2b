import React from 'react';
import { shallow } from 'enzyme';
import AddressSummary from './address-summary';

const createTestProps = props => ({
  address: {
    firstName: 'John',
    lastName: 'Doe',
    phone: '1234568',
    email: 'foo@bar.com',
    company: 'commercetools',
    city: 'Munich',
    region: 'Bavaria',
    country: 'DE',
  },
  ...props,
});

const addressSimpleFields = [
  {
    field: 'firstName',
    value: 'John',
    index: 12,
  },
  {
    field: 'lastName',
    value: 'Doe',
    index: 13,
  },
  {
    field: 'company',
    value: 'commercetools',
    index: 16,
  },
  {
    field: 'city',
    value: 'Munich',
    index: 18,
  },
  {
    field: 'postalCode',
    value: '12345',
    index: 19,
  },
  {
    field: 'additionalAddressInfo',
    value: 'Some additional address info',
    index: 23,
  },
];

describe('render', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<AddressSummary {...props} />);
  });
  it('should output snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  addressSimpleFields.forEach(({ field, value, index }) => {
    describe(`${field}`, () => {
      describe('when a value is set', () => {
        beforeEach(() => {
          props = createTestProps({
            address: { [field]: value, country: 'DE' },
          });
          wrapper = shallow(<AddressSummary {...props} />);
        });
        it(`should render the ${field} value`, () => {
          expect(wrapper.find('TextDetail').at(index)).toHaveProp(
            'children',
            value
          );
        });
      });
      describe('when no value is set', () => {
        beforeEach(() => {
          props = createTestProps({
            address: { [field]: undefined, country: 'DE' },
          });
          wrapper = shallow(<AddressSummary {...props} />);
        });
        it('should render the hyphen (`-`) as a fallback value', () => {
          expect(wrapper.find('TextDetail').at(index)).toHaveProp(
            'children',
            '-'
          );
        });
      });
    });
  });
  describe('address', () => {
    describe('when no street and no street number available', () => {
      beforeEach(() => {
        props = createTestProps({
          address: {
            streetName: undefined,
            streetNumber: undefined,
            country: 'DE',
          },
        });
        wrapper = shallow(<AddressSummary {...props} />);
      });
      it('should render the hyphen (`-`) value', () => {
        expect(wrapper.find('TextDetail').at(17)).toHaveProp('children', '-');
      });
    });

    describe('when only street name available', () => {
      beforeEach(() => {
        props = createTestProps({
          address: {
            streetName: 'street road',
            streetNumber: undefined,
            country: 'DE',
          },
        });
        wrapper = shallow(<AddressSummary {...props} />);
      });
      it('should return the street name as address value', () => {
        expect(wrapper.find('TextDetail').at(17)).toHaveProp(
          'children',
          'street road'
        );
      });
    });
    describe('when street and street number available', () => {
      beforeEach(() => {
        props = createTestProps({
          address: {
            streetName: 'street road',
            streetNumber: '155',
            country: 'DE',
          },
        });
        wrapper = shallow(<AddressSummary {...props} />);
      });
      it('should return the street name and number as address value', () => {
        expect(wrapper.find('TextDetail').at(17)).toHaveProp(
          'children',
          'street road 155'
        );
      });
    });
  });

  describe('region/state', () => {
    describe('when no region and no state available', () => {
      beforeEach(() => {
        props = createTestProps({
          address: { region: undefined, state: undefined, country: 'DE' },
        });
        wrapper = shallow(<AddressSummary {...props} />);
      });
      it('should render the hyphen (`-`) value', () => {
        expect(wrapper.find('TextDetail').at(20)).toHaveProp('children', '-');
      });
    });

    describe('when region available', () => {
      beforeEach(() => {
        props = createTestProps({
          address: {
            region: 'Comunitat Valenciana',
            state: undefined,
            country: 'DE',
          },
        });
        wrapper = shallow(<AddressSummary {...props} />);
      });
      it('should return the region value', () => {
        expect(wrapper.find('TextDetail').at(20)).toHaveProp(
          'children',
          'Comunitat Valenciana'
        );
      });
    });

    describe('when state available', () => {
      beforeEach(() => {
        props = createTestProps({
          address: { region: undefined, state: 'Texas', country: 'DE' },
        });
        wrapper = shallow(<AddressSummary {...props} />);
      });
      it('should return the state value', () => {
        expect(wrapper.find('TextDetail').at(20)).toHaveProp(
          'children',
          'Texas'
        );
      });
    });
  });
});
