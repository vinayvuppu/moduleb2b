import React from 'react';
import { shallow } from 'enzyme';
import { ButtonCancel, ButtonSave } from '../buttons';
import { SaveToolbar } from './save-toolbar';

const createTestProps = props => ({
  isVisible: true,
  saveLabel: 'Save',
  onSave: jest.fn(),
  onCancel: jest.fn(),
  ...props,
});

describe('rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(<SaveToolbar {...props} />);

  it('contains a ButtonCancel', () => {
    expect(wrapper.find(ButtonCancel)).toHaveLength(1);
  });

  it('contains a ButtonSave', () => {
    expect(wrapper.find(ButtonSave)).toHaveLength(1);
  });

  it(`contains a ButtonSave with label: ${props.saveLabel}`, () => {
    expect(wrapper.find(ButtonSave).prop('label')).toBe(props.saveLabel);
  });

  it('contains a enabled ButtonSave by default when isDisabled not set', () => {
    expect(wrapper.find(ButtonSave).prop('isDisabled')).toBe(false);
  });

  it('contains a disabled ButtonSave', () => {
    wrapper.setProps({ isDisabled: true });
    expect(wrapper.find(ButtonSave).prop('isDisabled')).toBe(true);
  });
});

describe('callbacks', () => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  const props = createTestProps({ onSave, onCancel });
  const wrapper = shallow(<SaveToolbar {...props} />);

  it('calls the onSave method when clicking save button', () => {
    wrapper.find(ButtonSave).simulate('click');
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('calls the onCancel method when clicking cancel button', () => {
    wrapper.find(ButtonCancel).simulate('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
