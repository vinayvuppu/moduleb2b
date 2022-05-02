import React from 'react';
import { renderApp } from '@commercetools-frontend/application-shell/test-utils';
import OrderCreateLocalizedChannelName from './order-create-localized-channel-name';

const createTestProps = custom => ({
  channel: {
    id: '1234-5678-abcd-efgh',
    key: 'schlagenheim',
    nameAllLocales: [
      {
        locale: 'en',
        value: 'Hit Home',
      },
      {
        locale: 'de',
        value: 'Schlagenheim',
      },
    ],
  },
  ...custom,
});

describe('when rendering OrderCreateLocalizedChannelName', () => {
  let props = createTestProps();

  it('should render the channel name in the default locale', () => {
    const rendered = renderApp(<OrderCreateLocalizedChannelName {...props} />);

    expect(rendered.queryByText('Hit Home')).toBeInTheDocument();
  });

  it('should render the channel name in other locale', () => {
    const rendered = renderApp(<OrderCreateLocalizedChannelName {...props} />, {
      dataLocale: 'de',
    });

    expect(rendered.queryByText('Schlagenheim')).toBeInTheDocument();
  });

  describe('when no channel localized names are present', () => {
    it('should render the channel key as fallback', () => {
      props = createTestProps({
        channel: {
          id: 'channel-id',
          key: 'schlagenheim',
          nameAllLocales: [],
        },
      });

      const rendered = renderApp(
        <OrderCreateLocalizedChannelName {...props} />
      );

      expect(rendered.queryByText('schlagenheim')).toBeInTheDocument();
    });
  });
});
