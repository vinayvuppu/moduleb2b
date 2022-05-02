import React from 'react';
import { shallow } from 'enzyme';
import localize from '@commercetools-local/utils/localize';
import { Localize } from './localize';

jest.mock('@commercetools-local/utils/localize', () =>
  jest.fn(({ key }) => `localized ${key}`)
);

describe('rendering', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      object: {
        name: {
          en: 'foo-en',
        },
      },
      objectKey: 'name',
      fallback: 'X_x',
      language: 'en',
      languages: ['de', 'fr'],
    };

    wrapper = shallow(<Localize {...props} />);
  });

  it('should get localization', () => {
    expect(localize).toHaveBeenCalledWith({
      obj: {
        name: {
          en: 'foo-en',
        },
      },
      key: 'name',
      language: 'en',
      fallback: 'X_x',
      fallbackOrder: ['de', 'fr'],
    });
  });

  it('should render localized value', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
