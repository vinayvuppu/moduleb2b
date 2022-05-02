import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip } from '@commercetools-frontend/ui-kit';
import ValidatedItemList from './validated-item-list';

const createTestProps = custom => ({
  itemCount: 2,
  renderItem: jest.fn(index => <div>{index}</div>),
  getKey: jest.fn(index => index),
  onAddItem: jest.fn(),
  onRemoveItem: jest.fn(),
  ...custom,
});

describe('rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(<ValidatedItemList {...props} />);

  it('should render an item list', () => {
    const itemList = wrapper.find('ItemList');
    expect(itemList).toHaveLength(1);
    expect(itemList.props()).toEqual(
      expect.objectContaining({
        itemCount: 2,
        renderItem: expect.any(Function),
        getKey: expect.any(Function),
        onAddItem: expect.any(Function),
        onRemoveItem: expect.any(Function),
      })
    );
  });

  it('should render a tooltip', () => {
    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.props()).toEqual(
      expect.objectContaining({
        isOpen: false,
        title: '',
      })
    );
  });

  it('should display the tooltip only if invalid', () => {
    wrapper.setProps({
      validation: {
        isValid: false,
        message: 'item list invalid',
      },
    });

    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.props()).toEqual(
      expect.objectContaining({
        isOpen: true,
        title: 'item list invalid',
      })
    );
  });
});
