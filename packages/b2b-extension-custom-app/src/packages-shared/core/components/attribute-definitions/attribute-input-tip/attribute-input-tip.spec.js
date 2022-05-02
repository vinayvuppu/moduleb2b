import React from 'react';
import { shallow } from 'enzyme';
import localize from '@commercetools-local/utils/localize';
import AttributeInputTip from './attribute-input-tip';

jest.mock('@commercetools-local/utils/localize', () =>
  jest.fn(() => 'localized value')
);

const render = props => shallow(<AttributeInputTip {...props} />);

const createTestProps = custom => ({
  language: 'de',
  languages: ['de', 'en'],
  ...custom,
});

describe('AttributeInputTip', () => {
  let wrapper;

  describe('attribute has input tip', () => {
    let props;

    beforeEach(() => {
      props = createTestProps({
        inputTip: {
          en: 'en input tip',
          de: 'de input tip',
        },
      });
      wrapper = render(props);
    });

    it('should localize tip', () => {
      expect(localize).toHaveBeenCalledWith({
        obj: { inputTip: props.inputTip },
        key: 'inputTip',
        language: props.language,
        fallback: '',
        fallbackOrder: props.languages,
      });
    });

    it('should render tip', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('attribute has no input tip', () => {
    beforeEach(() => {
      const props = createTestProps();
      wrapper = render(props);
    });

    it('should render nothing', () => {
      expect(wrapper).toBeEmptyRender();
    });
  });
});
