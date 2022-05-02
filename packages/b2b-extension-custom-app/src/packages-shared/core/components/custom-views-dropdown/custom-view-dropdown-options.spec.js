import React from 'react';
import { shallow } from 'enzyme';
import { Text, AccessibleButton } from '@commercetools-frontend/ui-kit';
import {
  SelectableOption,
  SelectedOption,
} from './custom-views-dropdown-options';

const TestComponent = () => <div>{'test'}</div>;
TestComponent.displayName = 'TestComponent';

describe('<SelectedOption>', () => {
  const createTestProps = customProps => ({
    children: <TestComponent />,
    isDisabled: false,
    isDirty: false,
    isOpen: false,
    onClick: jest.fn(),
    name: 'test name',
    ...customProps,
  });

  describe('rendering', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SelectedOption {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('when disabled', () => {
      beforeEach(() => {
        props = createTestProps({ isDisabled: true });
        wrapper = shallow(<SelectedOption {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should supply a secondary tone to the <Text.Detail>', () => {
        expect(wrapper.find(Text.Detail)).toHaveProp('tone', 'secondary');
      });
    });

    describe('when immutable', () => {
      beforeEach(() => {
        props = createTestProps({ isImmutable: true });
        wrapper = shallow(<SelectedOption {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should supply a `isItalic` to the <Text.Detail>', () => {
        expect(wrapper.find(Text.Detail)).toHaveProp('isItalic', true);
      });
    });
  });

  describe('callbacks', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SelectedOption {...props} />);
    });

    describe('when clicking on <AccessibleButton>', () => {
      beforeEach(() => {
        wrapper.find(AccessibleButton).prop('onClick')();
      });

      it('should invoke `onClick`', () => {
        expect(props.onClick).toHaveBeenCalled();
      });
    });
  });
});

describe('<SelectableOption>', () => {
  const createTestProps = customProps => ({
    children: <TestComponent />,
    isDisabled: false,
    isDirty: false,
    onClick: jest.fn(),
    name: 'test name',
    ...customProps,
  });

  describe('rendering', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SelectableOption {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    describe('when disabled', () => {
      beforeEach(() => {
        props = createTestProps({ isDisabled: true });
        wrapper = shallow(<SelectableOption {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should supply a secondary tone to the <Text.Detail>', () => {
        expect(wrapper.find(Text.Detail)).toHaveProp('tone', 'secondary');
      });
    });

    describe('when immutable', () => {
      beforeEach(() => {
        props = createTestProps({ isImmutable: true });
        wrapper = shallow(<SelectableOption {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should supply a `isItalic` to the <Text.Detail>', () => {
        expect(wrapper.find(Text.Detail)).toHaveProp('isItalic', true);
      });
    });

    describe('when active', () => {
      beforeEach(() => {
        props = createTestProps({ isActive: true });
        wrapper = shallow(<SelectableOption {...props} />);
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should supply a `isBold` to the <Text.Detail>', () => {
        expect(wrapper.find(Text.Detail)).toHaveProp('isBold', true);
      });
    });
  });

  describe('callbacks', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<SelectableOption {...props} />);
    });

    describe('when clicking on <AccessibleButton>', () => {
      beforeEach(() => {
        wrapper.find(AccessibleButton).prop('onClick')();
      });

      it('should invoke `onClick`', () => {
        expect(props.onClick).toHaveBeenCalled();
      });
    });
  });
});
