import React from 'react';
import { shallow } from 'enzyme';
import { IconButton } from '@commercetools-frontend/ui-kit';
import { createMountOptions } from '../../../../test-utils';
import ActionableCell from './actionable-cell';
import styles from './actionable-cell.mod.css';

const createTestProps = props => ({
  onClick: jest.fn(),
  label: 'foo',
  ...props,
});

describe('rendering', () => {
  const props = createTestProps({ value: 'Foo' });
  const wrapper = shallow(<ActionableCell {...props} />, createMountOptions());
  it(`has a cell with the value set to ${props.value}`, () => {
    expect(wrapper.find({ className: styles.text }).text()).toBe(props.value);
  });

  it('contains one IconButton component', () => {
    expect(wrapper).toRender(IconButton.displayName);
  });
});

describe('callbacks', () => {
  const onClick = jest.fn();
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps({ value: 'Foo', onClick });
    wrapper = shallow(<ActionableCell {...props} />, createMountOptions());

    wrapper.find(IconButton.displayName).simulate('click');
  });
  it('triggers onClick event for the click on IconButton', () => {
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
