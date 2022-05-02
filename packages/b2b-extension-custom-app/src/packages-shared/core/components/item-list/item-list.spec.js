import React from 'react';
import { shallow } from 'enzyme';
import {
  PlusBoldIcon,
  CloseBoldIcon,
  IconButton,
} from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../test-utils';
import { ItemList } from './item-list';

const createProps = props => ({
  itemCount: 1,
  onAddItem: jest.fn(),
  onRemoveItem: jest.fn(),
  renderItem: jest.fn(({ index }) => <div id={index} />),
  getKey: jest.fn(({ index }) => index),
  canBeEmpty: false,
  intl: intlMock,
  ...props,
});

describe('rendering', () => {
  it('should call renderItem for each item', () => {
    const props = createProps({ itemCount: 20 });
    shallow(<ItemList {...props} />);
    expect(props.renderItem).toHaveBeenCalledTimes(20);
    // in order to check if renderItem was called with the correct arguments
    // all 20 times, we build list of the arguments passed per call
    const actualRenderItemArgs = props.renderItem.mock.calls.map(
      args => args[0]
    );
    const expectedRenderItemArgs = Array.from({
      length: 20,
    }).map((_, index) => ({ index }));
    expect(actualRenderItemArgs).toEqual(expectedRenderItemArgs);
  });
  it('should grow the items if shouldGrowItems is true', () => {
    const props = createProps({ itemCount: 20 });
    const wrapper = shallow(<ItemList {...props} />);
    expect(wrapper.find({ className: 'item-grow' })).toHaveLength(20);
  });
  it('should call getKey for each item', () => {
    const props = createProps({ itemCount: 20 });
    shallow(<ItemList {...props} />);
    expect(props.renderItem).toHaveBeenCalledTimes(20);
    // in order to check if renderItem was called with the correct arguments
    // all 20 times, we build list of the arguments passed per call
    const actualGetKeyArgs = props.renderItem.mock.calls.map(args => args[0]);
    const expectedGetKeyArgs = Array.from({ length: 20 }).map((_, index) => ({
      index,
    }));
    expect(actualGetKeyArgs).toEqual(expectedGetKeyArgs);
  });
  it('should render the output of renderItem', () => {
    const props = createProps({ itemCount: 20 });
    const wrapper = shallow(<ItemList {...props} />);
    Array.from({ length: 20 }).forEach((_, index) => {
      expect(wrapper.find({ id: index })).toHaveLength(1);
    });
  });
  describe('custom button rendering', () => {
    let props;
    beforeEach(() => {
      props = createProps({ itemCount: 20, shouldRenderButtons: false });
    });
    it('should not render any buttons', () => {
      const wrapper = shallow(<ItemList {...props} />);
      expect(wrapper).not.toRender(IconButton.displayName);
    });
    describe('rendering the items', () => {
      let renderItemArgs;
      beforeEach(() => {
        shallow(<ItemList {...props} />);
        // in order to check if renderItem was called with the correct arguments
        // all 20 times, we build list of the arguments passed per call
        renderItemArgs = props.renderItem.mock.calls.map(args => args[0]);
      });
      it('should pass a addItem callback to the first item', () => {
        const [firstItemArgs] = renderItemArgs;
        expect(firstItemArgs).toEqual({ index: 0, onAddItem: props.onAddItem });
      });
      it('should pass a removeItem callback to all other items', () => {
        const expectedRenderItemArgs = Array.from({
          length: 19,
        }).map((_, index) => ({
          index: index + 1,
          onRemoveItem: props.onRemoveItem,
        }));
        expect(renderItemArgs.slice(1)).toEqual(expectedRenderItemArgs);
      });
      describe('canBeEmpty', () => {
        beforeEach(() => {
          props = createProps({
            shouldRenderButtons: false,
            itemCount: 1,
            canBeEmpty: true,
          });
          shallow(<ItemList {...props} />);
        });
        it('should pass both callbacks to the first item', () => {
          expect(props.renderItem).toHaveBeenCalledWith({
            index: 0,
            onAddItem: props.onAddItem,
            onRemoveItem: props.onRemoveItem,
          });
        });
      });
    });
  });
  describe('default button rendering', () => {
    describe('one item', () => {
      it('should render one plus button', () => {
        const props = createProps();
        const wrapper = shallow(<ItemList {...props} />);
        expect(wrapper).toRender(IconButton.displayName);
        expect(
          wrapper
            .find(IconButton.displayName)
            .at(0)
            .prop('icon')
        ).toEqual(<PlusBoldIcon />);
      });
    });
    describe('multiple items', () => {
      it('should always render one plus button', () => {
        const props = createProps({ itemCount: 20 });
        const wrapper = shallow(<ItemList {...props} />);
        expect(wrapper).toRenderElementTimes(IconButton.displayName, 20);
        expect(
          wrapper
            .find(IconButton.displayName)
            .at(0)
            .prop('icon')
        ).toEqual(<PlusBoldIcon />);
      });
    });
    describe('canBeEmpty', () => {
      it('should render a remove button beside the plus button', () => {
        const props = createProps({ canBeEmpty: true });
        const wrapper = shallow(<ItemList {...props} />);
        expect(wrapper).toRenderElementTimes(IconButton.displayName, 2);
        expect(
          wrapper
            .find(IconButton.displayName)
            .at(0)
            .prop('icon')
        ).toEqual(<PlusBoldIcon />);
        expect(
          wrapper
            .find(IconButton.displayName)
            .at(1)
            .prop('icon')
        ).toEqual(<CloseBoldIcon />);
      });
    });
    it('should render a remove button for each item', () => {
      const props = createProps({ itemCount: 20 });
      const wrapper = shallow(<ItemList {...props} />);
      wrapper
        .find(IconButton.displayName)
        .filter((icon, index) => index !== 0)
        .forEach(icon => expect(icon.prop('classNames').icon).toMatch(/close/));
    });
  });
});

describe('callbacks', () => {
  describe('default buttons', () => {
    it('should call onAddItem when the plus button is pressed', () => {
      const props = createProps({ itemCount: 20 });
      const wrapper = shallow(<ItemList {...props} />);
      wrapper
        .find(IconButton.displayName)
        .at(0)
        .simulate('click');
      expect(props.onAddItem).toHaveBeenCalledTimes(1);
      expect(props.onAddItem).toHaveBeenCalledWith({ index: 0 });
    });
    it('should call onRemoveItem when the remove button is pressed', () => {
      const props = createProps({ itemCount: 20 });
      const wrapper = shallow(<ItemList {...props} />);
      wrapper
        .find(IconButton.displayName)
        .at(5)
        .simulate('click');
      expect(props.onRemoveItem).toHaveBeenCalledTimes(1);
      expect(props.onRemoveItem).toHaveBeenCalledWith({ index: 5 });
      wrapper
        .find(IconButton.displayName)
        .at(15)
        .simulate('click');
      expect(props.onRemoveItem).toHaveBeenCalledTimes(2);
      expect(props.onRemoveItem).toHaveBeenCalledWith({ index: 15 });
    });
  });
});

describe('lifecycle', () => {
  it('should call renderItem when the items count changes', () => {
    const props = createProps({ itemCount: 20 });
    const wrapper = shallow(<ItemList {...props} />);
    expect(props.renderItem).toHaveBeenCalledTimes(20);
    wrapper.setProps({ itemCount: 100 });
    expect(props.renderItem).toHaveBeenCalledTimes(120);
  });
});
