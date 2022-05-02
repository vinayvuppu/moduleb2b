import React from 'react';
import { shallow } from 'enzyme';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../../test-utils';
import { PerPageSwitcher } from './per-page-switcher';

const createTestProps = props => ({
  options: [1, 2, 3, 4, 5],
  perPage: 10,
  itemsOnPage: 50,
  onPerPageChange: jest.fn(),
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<PerPageSwitcher {...props} />);
  });

  it('renders a select component', () => {
    expect(wrapper).toRender(SelectInput);
  });

  it(`has a select with 5 options`, () => {
    expect(wrapper.find(SelectInput)).toHaveProp('options', [
      { label: 1, value: '1' },
      { label: 2, value: '2' },
      { label: 3, value: '3' },
      { label: 4, value: '4' },
      { label: 5, value: '5' },
    ]);
  });
});

describe('callbacks', () => {
  const props = createTestProps();
  const wrapper = shallow(<PerPageSwitcher {...props} />);
  const mockEvent = {
    target: { value: '4' },
  };

  it('selects one page and triggers calls onPerPageChange method', () => {
    wrapper.find(SelectInput).prop('onChange')(mockEvent);
    expect(props.onPerPageChange).toHaveBeenCalledTimes(1);
  });

  it('calls the onPerPageChange with the selected page', () => {
    expect(props.onPerPageChange).toHaveBeenLastCalledWith(4);
  });
});
