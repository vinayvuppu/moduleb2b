import React from 'react';
import { shallow } from 'enzyme';
import {
  LoadingSpinner,
  SecondaryButton,
  PrimaryButton,
} from '@commercetools-frontend/ui-kit';
import { render, fireEvent, wait } from '@testing-library/react';
import router, { MemoryRouter } from 'react-router-dom';
import { PageNotFound } from '@commercetools-frontend/application-components';
import ViewHeader from '@commercetools-local/core/components/view-header';
import TabContainer from '@commercetools-local/core/components/tab-container';

import { QUOTE_TYPES } from '../../constants';
import { QuoteDetails } from './quote-details';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useRouteMatch: () => ({
      url: 'www.foo.com',
      params: { projectKey: 'foo' },
    }),
    useHistory: () => ({ history: jest.fn() }),
  };
});
jest.mock('@commercetools-frontend/permissions', () => {
  const actual = jest.requireActual('@commercetools-frontend/permissions');
  return {
    ...actual,
    RestrictedByPermissions: ({ children }) => children,
  };
});
jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(msg => msg.defaultMessage),
    })),
  };
});

const createTestProps = props => ({
  quoteId: 'quote-id-1',
  quote: {
    id: 'quote-id-1',
    quoteState: 'submitted',
  },
  isLoading: false,
  projectKey: 'project-key-1',
  children: jest.fn(),
  updateQuoteState: jest.fn(),
  showNotification: jest.fn(),
  goToListRoute: 'route/quotes',
  hasCompany: true,
  ...props,
});

describe('rendering', () => {
  let props;
  let wrapper;

  describe('when the quote is loading', () => {
    beforeEach(() => {
      props = createTestProps({ isLoading: true });
      wrapper = shallow(<QuoteDetails {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the Loading spinner', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });

  describe('when the quote is not found', () => {
    beforeEach(() => {
      props = createTestProps({ isLoading: false, quote: undefined });
      wrapper = shallow(<QuoteDetails {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the PageNotFound', () => {
      expect(wrapper).toRender(PageNotFound);
    });
  });

  describe('when the quote is loaded', () => {
    let renderCommandsWrapper;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<QuoteDetails {...props} />);
      renderCommandsWrapper = shallow(
        <div>{wrapper.find('ViewHeader').prop('commands')}</div>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the ViewHeader', () => {
      expect(wrapper).toRender(ViewHeader);
    });

    it('should render the TabContainer', () => {
      expect(wrapper).toRender(TabContainer);
    });

    it('should render the Approval button', () => {
      expect(renderCommandsWrapper).toRender(SecondaryButton);
    });

    it('should render the Decline button', () => {
      expect(renderCommandsWrapper).toRender(PrimaryButton);
    });

    describe('when the quote is not in the requested state', () => {
      beforeEach(() => {
        props = createTestProps({
          quote: {
            id: 'quote-id-1',
            quoteState: 'rejected',
          },
        });
        wrapper = shallow(<QuoteDetails {...props} />);
        renderCommandsWrapper = shallow(
          <div>{wrapper.find('ViewHeader').prop('commands')}</div>
        );
      });

      it('should not render the Approval button', () => {
        expect(renderCommandsWrapper).not.toRender(SecondaryButton);
      });

      it('should not render the Decline button', () => {
        expect(renderCommandsWrapper).not.toRender(PrimaryButton);
      });
    });
  });
});

describe('QuoteDetails component', () => {
  test('edit quote with state initial', () => {
    const pushSpy = jest.fn();
    const props = createTestProps({
      quote: { id: 'foo', quoteState: QUOTE_TYPES.INITIAL },
    });
    jest
      .spyOn(router, 'useHistory')
      .mockImplementation(() => ({ push: pushSpy }));
    const { getByText } = render(
      <MemoryRouter>
        <QuoteDetails {...props} />
      </MemoryRouter>
    );
    const editBtn = getByText('Edit');

    fireEvent.click(editBtn);

    expect(
      pushSpy
    ).toHaveBeenCalledWith(
      '/foo/b2b-extension/my-company/quotes/new/lineitems',
      { quote: { id: 'foo', quoteState: 'initial' } }
    );
  });
  test('submit quote with state initial', async () => {
    const updateQuoteStateSpy = jest.fn();
    const showNotificationSpy = jest.fn();
    const props = createTestProps({
      quote: { id: 'foo', quoteState: QUOTE_TYPES.INITIAL },
      updateQuoteState: updateQuoteStateSpy,
      showNotification: showNotificationSpy,
    });
    const { getByText } = render(
      <MemoryRouter>
        <QuoteDetails {...props} />
      </MemoryRouter>
    );
    const submitBtn = getByText('Submit');

    fireEvent.click(submitBtn);
    await wait();

    expect(updateQuoteStateSpy).toHaveBeenCalledWith(QUOTE_TYPES.SUBMITTED);
    expect(showNotificationSpy).toHaveBeenCalledWith({
      domain: 'side',
      kind: 'success',
      text: 'Quote submitted',
    });
  });
});
