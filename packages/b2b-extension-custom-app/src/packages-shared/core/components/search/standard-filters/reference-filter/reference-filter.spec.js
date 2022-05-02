import React from 'react';
import { shallow } from 'enzyme';
import createReferenceSingleFilter, {
  defaultRenderInput,
} from './reference-filter';

const createTestProps = custom => ({
  value: '',
  onUpdateFilter: jest.fn(),
  ...custom,
});

const ReferenceSingleFilter = createReferenceSingleFilter({
  loadItems: jest.fn(),
  mapItemToOption: jest.fn(),
});

describe('rendering', () => {
  const props = createTestProps();
  const wrapper = shallow(<ReferenceSingleFilter {...props} />);

  it('should render a single filter', () => {
    expect(wrapper.find('SingleFilter')).toHaveLength(1);
    expect(wrapper.find('SingleFilter').props()).toEqual({
      renderInput: expect.any(Function),
      value: props.value,
      onUpdateValue: props.onUpdateFilter,
    });
  });

  it('should render a SingleFilter with the disabled value set to `false` by default', () => {
    expect(ReferenceSingleFilter.defaultProps.disabled).toBe(false);
  });

  it('should call defaultRenderInput with correct props', () => {
    const renderInputMock = jest.fn();
    const renderInputProps = { value: 0, onUpdateValue: jest.fn() };
    wrapper.setProps({
      renderInput: renderInputMock,
      loadItems: jest.fn(),
      mapItemToOption: jest.fn(),
      disabled: true,
    });
    wrapper.find('SingleFilter').prop('renderInput')(renderInputProps);

    expect(renderInputMock).toHaveBeenCalledTimes(1);
    expect(renderInputMock).toHaveBeenCalledWith({
      value: 0,
      onUpdateValue: expect.any(Function),
      loadItems: expect.any(Function),
      mapItemToOption: expect.any(Function),
      disabled: true,
      isMulti: false,
      autoload: false,
    });
  });
});

describe('rendering autocomplete', () => {
  const createTestPropsRenderingInput = custom => ({
    value: '',
    onUpdateValue: jest.fn(),
    loadItems: jest.fn(),
    mapItemToOption: jest.fn(),
    mapValueToItem: jest.fn(),
    ...custom,
  });
  const props = createTestPropsRenderingInput();
  const wrapper = shallow(<div>{defaultRenderInput(props)}</div>);
  it('should render a category reference search component', () => {
    expect(wrapper.find('Autocomplete')).toHaveLength(1);
  });

  it('should pass correct props to reference search component', () => {
    expect(wrapper.find('Autocomplete').props()).toEqual(
      expect.objectContaining({
        onChange: props.onUpdateValue,
        value: props.value,
        loadItems: props.loadItems,
        mapItemToOption: props.mapItemToOption,
        mapValueToItem: props.mapValueToItem,
      })
    );
  });
});
