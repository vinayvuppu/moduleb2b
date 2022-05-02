import React from 'react';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';
import FormattedDateTime from '../formatted-date-time';
import { MetaDates } from './meta-dates';

jest.mock('../../../utils/formats/date');

const createTestProps = props => ({
  created: '2016-01-01T10:00:00.000Z',
  modified: '2016-01-01T11:00:00.000Z',
  ...props,
});

describe('rendering', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<MetaDates {...props} />);
  });

  it('renders two `FormattedMessage` components', () => {
    expect(wrapper).toRenderElementTimes(FormattedMessage, 2);
  });

  it('first `FormattedMessage` should be dateCreated', () => {
    expect(wrapper.find(FormattedMessage).at(0)).toHaveProp(
      'id',
      'MetaDates.dateCreated'
    );
  });

  it('second `FormattedMessage` should be dateModified', () => {
    expect(wrapper.find(FormattedMessage).at(1)).toHaveProp(
      'id',
      'MetaDates.dateModified'
    );
  });

  it('should render first `FormattedMessage` value', () => {
    expect(wrapper.find(FormattedMessage).at(0)).toHaveProp('values', {
      datetime: <FormattedDateTime type="datetime" value={props.created} />,
    });
  });

  it('should render second `FormattedMessage` value', () => {
    expect(wrapper.find(FormattedMessage).at(1)).toHaveProp('values', {
      datetime: <FormattedDateTime type="datetime" value={props.modified} />,
    });
  });
});
