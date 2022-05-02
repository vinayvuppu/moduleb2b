import React from 'react';
import { shallow } from 'enzyme';
import FormBox from './form-box';

const createTestProps = customProps => ({
  width: 'single',
  ...customProps,
});

describe('rendering', () => {
  const ChildComponent = () => <div>{'Foo'}</div>;

  describe('by default', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <FormBox {...props}>
          <ChildComponent />
        </FormBox>
      );
    });

    it('should output correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render children', () => {
      expect(wrapper).toRender(ChildComponent);
    });

    it('should not apply a warning class name', () => {
      expect(wrapper).not.toHaveClassName('has-warning');
    });

    it('should apply the `single-width` class name', () => {
      expect(wrapper).toHaveClassName('single-width-form-box');
    });
  });

  describe('when `double`', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ width: 'double' });
      wrapper = shallow(
        <FormBox {...props}>
          <ChildComponent />
        </FormBox>
      );
    });

    it('should output correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should apply the `double-width` class name', () => {
      expect(wrapper).toHaveClassName('double-width-form-box');
    });
  });
  describe('when `single`', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ width: 'single' });
      wrapper = shallow(
        <FormBox {...props}>
          <ChildComponent />
        </FormBox>
      );
    });

    it('should apply the `single-width` class name', () => {
      expect(wrapper).toHaveClassName('single-width-form-box');
    });
  });
  describe('when `full`', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps({ width: 'full' });
      wrapper = shallow(
        <FormBox {...props}>
          <ChildComponent />
        </FormBox>
      );
    });

    it('should output correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should apply the `full-width` class name', () => {
      expect(wrapper).toHaveClassName('full-width-form-box');
    });
  });

  describe('when `hasWarning` being `true`', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({ hasWarning: true });
      wrapper = shallow(
        <FormBox {...props}>
          <ChildComponent />
        </FormBox>
      );
    });

    it('should output correct tree', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should apply the `hasWarning` class name', () => {
      expect(wrapper).toHaveClassName('has-warning');
    });
  });
});
