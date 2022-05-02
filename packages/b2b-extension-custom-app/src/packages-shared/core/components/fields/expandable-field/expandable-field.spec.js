import React from 'react';
import { shallow } from 'enzyme';
import { FlatButton } from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../test-utils';
import ThrottledField from '../throttled-field';
import { ExpandableField, RequiredThrottledField } from './expandable-field';

const createTestProps = props => ({
  value: undefined,
  isExpanded: false,
  onToggle: jest.fn(),
  definition: {
    isRequired: false,
  },
  onChange: jest.fn(),
  onBlurValue: jest.fn(),
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  it('is a expandable field with no validation ', () => {
    const props = createTestProps();
    const wrapper = shallow(<ExpandableField {...props} />);

    expect(wrapper.find(ThrottledField).prop('as')).toBe('textarea');
  });

  it('is a expandable field with no expand control available', () => {
    const props = createTestProps();
    const wrapper = shallow(<ExpandableField {...props} />);

    expect(wrapper.find(FlatButton)).toHaveLength(0);
  });

  it('is a expandable field with validation ', () => {
    const props = createTestProps({
      value: 'foo',
      definition: { isRequired: true },
    });
    const wrapper = shallow(<ExpandableField {...props} />);

    expect(wrapper.find(RequiredThrottledField).prop('as')).toBe('textarea');
  });

  it('is a expandable field with one expand control available', () => {
    const props = createTestProps({
      value: 'foo',
      definition: { isRequired: true },
    });
    const wrapper = shallow(<ExpandableField {...props} />);

    expect(wrapper).toRender(FlatButton);
  });
});

describe('callbacks', () => {
  it('calls onToggle function when toggle event', () => {
    const props = createTestProps({
      value: 'foo',
      definition: { isRequired: true },
      onToggle: jest.fn(),
    });
    const wrapper = shallow(<ExpandableField {...props} />);

    wrapper.find(FlatButton).prop('onClick')();
    expect(props.onToggle).toHaveBeenCalledTimes(1);
  });
});
