import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '@commercetools-local/test-utils';
import { CaretDownIcon, CaretUpIcon } from '@commercetools-frontend/ui-kit';
import { CustomViewsDropdownChevron } from './custom-views-dropdown-chevron';

const createTestProps = customProps => ({
  onClick: jest.fn(),
  isDisabled: false,
  isOpen: false,
  // injectIntl
  intl: intlMock,
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomViewsDropdownChevron {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render <CaretDownIcon>', () => {
    expect(wrapper).toRender(CaretDownIcon);
  });

  describe('when open', () => {
    beforeEach(() => {
      props = createTestProps({
        isOpen: true,
      });
      wrapper = shallow(<CustomViewsDropdownChevron {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render <CaretUpIcon>', () => {
      expect(wrapper).toRender(CaretUpIcon);
    });
  });

  describe('when disabled', () => {
    beforeEach(() => {
      props = createTestProps({
        isDisabled: true,
      });
      wrapper = shallow(<CustomViewsDropdownChevron {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should supply neutral60 color to <CaretDownIcon>', () => {
      expect(wrapper.find(CaretDownIcon)).toHaveProp('color', 'neutral60');
    });
  });
});
