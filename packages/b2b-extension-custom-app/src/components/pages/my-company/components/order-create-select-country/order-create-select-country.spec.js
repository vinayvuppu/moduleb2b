import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router-dom';
import { SelectInput } from '@commercetools-frontend/ui-kit';
import { FormDialog } from '@commercetools-frontend/application-components';
import { intlMock } from '@commercetools-local/test-utils';
import { OrderCreateSelectCountry } from './order-create-select-country';

const createCartDraft = custom => ({
  id: 'cart-draft-id',
  lineItems: [],
  version: 1,
  ...custom,
});

const createTestProps = props => ({
  projectKey: 'test-project',
  handleCloseModal: jest.fn().mockName('handleCloseModal'),
  cartDraft: createCartDraft(),
  cartUpdater: {
    isLoading: false,
    execute: jest.fn(() =>
      Promise.resolve({ data: { updateCart: { lineItems: [] } } })
    ),
  },
  isChange: false,

  history: {
    push: jest.fn().mockName('push'),
  },
  match: {
    path: 'orders-test/orders/new/lineitems/select-country',
  },
  location: {
    pathname: '',
    state: {
      availableCountries: ['de'],
    },
  },
  onActionError: () => {},
  countries: {
    de: 'Germany',
    es: 'Spain',
  },
  project: {
    languages: ['en'],
    countries: ['de', 'es'],
  },
  projectDataLocale: 'en',
  intl: intlMock,
  ...props,
});

describe('render', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateSelectCountry {...props} />);
  });

  it('should render two routes', () => {
    expect(wrapper.find(Route)).toHaveLength(2);
  });

  describe("when country hasn't been selected yet", () => {
    let route;
    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(<OrderCreateSelectCountry {...props} />);
      route = wrapper;
      route = wrapper.find({ path: props.match.path }).renderProp('render')();
    });

    it('should match snapshot', () => {
      expect(route).toMatchSnapshot();
    });

    it('should have select country title', () => {
      expect(route.find(FormDialog)).toHaveProp(
        'title',
        'Orders.Create.Select.Country.title'
      );
    });

    describe('when only one country available', () => {
      it('should have the country state `de` by default', () => {
        expect(wrapper).toHaveState({ country: 'de' });
      });
      it('select-input should be disabled', () => {
        expect(route.find(SelectInput)).toHaveProp({ isDisabled: true });
      });
    });
    describe('when multiple countries available', () => {
      beforeEach(() => {
        props = createTestProps({
          location: {
            pathname: '',
            state: {
              availableCountries: ['de', 'es'],
            },
          },
        });
        wrapper = shallow(<OrderCreateSelectCountry {...props} />);
        route = wrapper;
        route = wrapper.find({ path: props.match.path }).renderProp('render')();
      });
      it('should have the country state to null by default', () => {
        expect(wrapper).toHaveState({ country: null });
      });
    });
  });

  describe('when country has been selected', () => {
    let route;
    beforeEach(() => {
      props = createTestProps({
        isChange: true,
        cartDraft: createCartDraft({ country: 'de' }),
      });
      wrapper = shallow(<OrderCreateSelectCountry {...props} />);
      route = wrapper
        .find(Route)
        .findWhere(r => r.props().path === props.match.path)
        .renderProp('render')();
    });

    it('should have the country state `de` by default', () => {
      expect(wrapper).toHaveState({ country: 'de' });
    });

    it('should match snapshot', () => {
      expect(route).toMatchSnapshot();
    });

    it('should have change country title', () => {
      expect(route.find(FormDialog)).toHaveProp(
        'title',
        'Orders.Create.Select.Country.changeTitle'
      );
    });
  });
});

describe('callbacks', () => {
  let props;
  let route;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<OrderCreateSelectCountry {...props} />);
    route = wrapper.find({ path: props.match.path }).renderProp('render')();
  });

  describe('when closing', () => {
    beforeEach(() => {
      route.find(FormDialog).prop('onClose')();
    });

    it('should call `handleCloseModal`', () => {
      expect(props.handleCloseModal).toHaveBeenCalled();
    });
  });

  describe('when cancelling', () => {
    beforeEach(() => {
      route.find(FormDialog).prop('onSecondaryButtonClick')();
    });

    it('should call `handleCloseModal`', () => {
      expect(props.handleCloseModal).toHaveBeenCalled();
    });
  });

  describe('when saving', () => {
    beforeEach(async () => {
      wrapper.setState({ country: 'de' });
      await route.find(FormDialog).prop('onPrimaryButtonClick')();
    });

    it('should call `execute` from `cartUpdater`', () => {
      expect(props.cartUpdater.execute).toHaveBeenCalled();
    });

    it('should not call history.push', () => {
      expect(props.history.push).not.toHaveBeenCalled();
    });

    it('should call `handleCloseModal`', () => {
      expect(props.handleCloseModal).toHaveBeenCalled();
    });

    describe('when API removes lineitems from cart', () => {
      beforeEach(async () => {
        props = createTestProps({
          cartDraft: createCartDraft({
            lineItems: [
              {
                id: '123',
              },
            ],
          }),
        });
        wrapper = shallow(<OrderCreateSelectCountry {...props} />);
        route = wrapper;
        route = wrapper.find({ path: props.match.path }).renderProp('render')();
        wrapper.setState({ country: 'de' });
        await route.find(FormDialog).prop('onPrimaryButtonClick')();
      });
      it('should call history.push', () => {
        expect(props.history.push).toHaveBeenCalled();
      });
      it('should call history.push with confirm path and state', () => {
        expect(props.history.push).toHaveBeenCalledWith({
          pathname: `${props.location.pathname}/confirm`,
          state: props.location.state,
        });
      });
      it('should call not `handleCloseModal`', () => {
        expect(props.handleCloseModal).not.toHaveBeenCalled();
      });
    });
  });
});
