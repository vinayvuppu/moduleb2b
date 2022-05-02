import React from 'react';
import 'babel-polyfill';
import { shallow } from 'enzyme';
import ButtonTyped from './button-typed';

const getButtonOptions = options => ({
  defaultLabel: 'label',
  defaultIcon: null,
  type: 'confirm',
  hasAlternativeStyle: false,
  ...options,
});

const createTestProps = props => ({
  onClick: jest.fn(),
  ...props,
});

describe('render', () => {
  describe('basic component', () => {
    const name = 'ButtonTest';
    const options = getButtonOptions();
    const typedButton = ButtonTyped(name, options);

    it('is a function', () => {
      expect(typeof typedButton).toBe('function');
    });

    it('has a label', () => {
      expect(typedButton.displayName).toBe(name);
    });

    it('has prop displayName', () => {
      expect('displayName' in typedButton).toBeDefined();
    });

    it('has prop propTypes', () => {
      expect('propTypes' in typedButton).toBeDefined();
    });

    it('has prop defaultProps', () => {
      expect('defaultProps' in typedButton).toBeDefined();
    });
  });

  describe('simple component', () => {
    const options = getButtonOptions();
    const TypedButton = ButtonTyped('ButtonTest', options);
    const wrapper = shallow(<TypedButton {...createTestProps()} />);

    it('uses default label', () => {
      expect(wrapper.find('span').text()).toBe(options.defaultLabel);
    });
  });

  describe('icon component', () => {
    const options = getButtonOptions({ defaultIcon: <i /> });
    const TypedButton = ButtonTyped('ButtonTest', options);
    const wrapper = shallow(<TypedButton {...createTestProps()} />);

    it('uses default icon', () => {
      expect(wrapper).toRender('i');
    });
  });
});

describe('restrictions', () => {
  const name = 'ButtonTest';
  const typedButtonNoAlternate = ButtonTyped(name, getButtonOptions());
  const typedButtonAlternate = ButtonTyped(
    name,
    getButtonOptions({
      hasAlternativeStyle: true,
    })
  );
  const noAlternateValidation = typedButtonNoAlternate.propTypes.style({
    style: 'alternative',
  });
  const alternateValidation = typedButtonAlternate.propTypes.style({
    style: 'alternative',
  });

  it('only allows style props if `hasAlternativeStyle` is true', () => {
    expect(Error.isError(noAlternateValidation)).toBe(true);
    expect(alternateValidation).toBeNull();
  });
});

describe('types', () => {
  it('rejects invalid types', () => {
    const options = getButtonOptions({ type: 'invalidType' });

    expect(() => {
      ButtonTyped('ButtonTest', options);
    }).toThrow();
  });
});
