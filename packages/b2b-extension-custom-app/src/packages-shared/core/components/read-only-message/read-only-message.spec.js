import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import { WarningIcon } from '@commercetools-frontend/ui-kit';
import ReadOnlyMessage from './read-only-message';

describe('Rendering', () => {
  const wrapper = shallow(<ReadOnlyMessage />);

  it('should render a FormattedMessage', () => {
    expect(wrapper).toRender(FormattedMessage);
  });

  it('should render the readOnly message', () => {
    expect(wrapper.find(FormattedMessage)).toHaveProp(
      'id',
      'Messages.readOnly'
    );
  });

  it('should render WarningIcon', () => {
    expect(wrapper.find(WarningIcon)).toHaveProp('color', 'warning');
  });
});
