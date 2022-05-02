import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../test-utils';
import { WarningSaveToolbar } from '.';
import WarnOnLeave from '../warn-on-leave';
import SaveToolbar from '../save-toolbar';

const createTestProps = props => ({
  isToolbarVisible: true,
  shouldWarnOnLeave: true,
  onSave: jest.fn(),
  onCancel: jest.fn(),
  onConfirmLeave: jest.fn(),
  intl: intlMock,
  ...props,
});

describe('render', () => {
  const props = createTestProps();
  const wrapper = shallow(<WarningSaveToolbar {...props} />);
  it('contains WarnOnLeave', () => {
    expect(wrapper.find(WarnOnLeave)).toHaveLength(1);
  });
  it('contains SaveToolbar', () => {
    expect(wrapper.find(SaveToolbar)).toHaveLength(1);
  });
});

describe('defaultProps', () => {
  it('contain correct props', () => {
    expect(WarningSaveToolbar.defaultProps).toEqual({
      isToolbarDisabled: false,
      beforeSaveValidator: expect.any(Function),
    });
  });
});

describe('callbacks', () => {
  describe('beforeSaveValidator', () => {
    it('can return false to prevent onSave from running', () => {
      const props = createTestProps({
        onSave: jest.fn(),
        beforeSaveValidator: jest.fn(() => false),
      });
      const wrapper = shallow(<WarningSaveToolbar {...props} />);
      wrapper.find(SaveToolbar).prop('onSave')();
      expect(props.beforeSaveValidator).toHaveBeenCalledTimes(1);
      expect(props.onSave).toHaveBeenCalledTimes(0);
    });

    it('can run true to continue with onSave', () => {
      const props = createTestProps({
        onSave: jest.fn(),
        beforeSaveValidator: jest.fn(() => true),
      });
      const wrapper = shallow(<WarningSaveToolbar {...props} />);
      wrapper.find(SaveToolbar).prop('onSave')();
      expect(props.beforeSaveValidator).toHaveBeenCalledTimes(1);
      expect(props.onSave).toHaveBeenCalledTimes(1);
    });
  });
});

describe('pass-through props', () => {
  const props = createTestProps();
  const wrapper = shallow(
    <WarningSaveToolbar {...props} isToolbarDisabled={true} />
  );
  // WarnOnLeave
  it('passes "shouldWarnOnLeave"', () => {
    expect(wrapper.find(WarnOnLeave).prop('shouldWarn')).toBe(
      props.shouldWarnOnLeave
    );
  });
  // SaveToolbar
  it('passes "isToolbarDisabled"', () => {
    expect(wrapper.find(SaveToolbar).prop('isDisabled')).toBe(true);
  });
  it('passes "isToolbarVisible"', () => {
    expect(wrapper.find(SaveToolbar).prop('isVisible')).toBe(
      props.isToolbarVisible
    );
  });
  it('passes "onCancel"', () => {
    expect(wrapper.find(SaveToolbar).prop('onCancel')).toBe(props.onCancel);
  });
});
