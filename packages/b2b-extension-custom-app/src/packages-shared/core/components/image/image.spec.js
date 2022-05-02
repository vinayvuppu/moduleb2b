import React from 'react';
import { shallow } from 'enzyme';
import NoImageIcon from '@commercetools-frontend/assets/images/camera.svg';
import BrokenIcon from '@commercetools-frontend/assets/images/camera-crossed.svg';
import ExternalIcon from '@commercetools-frontend/assets/images/camera-chain.svg';
import BrokenExternalIcon from '@commercetools-frontend/assets/images/camera-chain-broken.svg';
import Image from './image';

describe('rendering', () => {
  describe('internal URL with correct src based on size', () => {
    const sizes = ['thumb', 'small', 'medium', 'large', 'zoom'];
    sizes.forEach(size => {
      describe(`CDN image with size (${size})`, () => {
        const url = 'https://111.ssl.rackcdn.com/foo.jpg';
        const expected = `https://111.ssl.rackcdn.com/foo-${size}.jpg`;
        const wrapper = shallow(<Image url={url} size={size} />);

        it('should put URL as src in state', () => {
          expect(wrapper.state('src')).toBe(expected);
        });

        it('should render image HTML tag', () => {
          expect(wrapper.type()).toBe('img');
        });

        it('should format URL with size', () => {
          expect(wrapper.prop('src')).toBe(expected);
        });
      });
    });
  });

  describe("URL with size if it's internal", () => {
    const urls = [
      'https://111.ssl.rackcdn.com/foo.jpg',
      'https://cdn.commercetools.de/foo.jpg',
      'https://cdn.commercetools.com/foo.jpg',
    ];

    urls.forEach(url => {
      describe(`image with size for CDN url (${url})`, () => {
        const wrapper = shallow(<Image url={url} size="thumb" />);

        it('should suffix image name with size', () => {
          expect(wrapper.prop('src')).toBe(
            `${url.substring(0, url.length - 4)}-thumb.jpg`
          );
        });
      });
    });
  });

  describe('external URL with correct src based on regex', () => {
    const testRegexes = [
      {
        label: 'Replace with suffix',
        regex: { search: '.[^.]+$', replace: '-thumb.jpg', flag: 'gi' },
        url: 'https://example.s3-bucket.org/image.jpg',
        expected: 'https://example.s3-bucket.org/image-thumb.jpg',
      },
      {
        label: 'Replace within URL',
        regex: { search: '/(default)/', replace: '/thumb/', flag: 'g' },
        url:
          'https://example.s3-bucket.org/images/sizes/default/cropped/image.jpg',
        expected:
          'https://example.s3-bucket.org/images/sizes/thumb/cropped/image.jpg',
      },
      {
        label: 'Replace within URL (first match)',
        regex: { search: '/(default)/', replace: '/thumb/', flag: 'g' },
        url:
          'https://example.s3-bucket.org/images/sizes/default/deep/path/default-cropped/image.jpg',
        expected:
          'https://example.s3-bucket.org/images/sizes/thumb/deep/path/default-cropped/image.jpg',
      },
      {
        label: 'Replace with appended param',
        regex: { search: '.[^.]+$', replace: '.jpg?thumb', flag: 'g' },
        url: 'https://example.s3-bucket.org/images/default.jpg',
        expected: 'https://example.s3-bucket.org/images/default.jpg?thumb',
      },
      {
        label: 'With regex as RegExp instance',
        regex: {
          search: /\/[0-9]+\/[0-9]+/,
          replace: '/500/500',
          flag: 'g',
        },
        url: 'https://placekitten.com/g/200/300',
        expected: 'https://placekitten.com/g/500/500',
      },
    ];

    testRegexes.forEach(obj => {
      const { label, regex, url, expected } = obj;

      describe(`external image with regex (${label})`, () => {
        const wrapper = shallow(<Image url={url} regex={regex} />);

        it('should put the URL as src in state', () => {
          expect(wrapper.state('src')).toBe(expected);
        });

        it('should render image HTML tag', () => {
          expect(wrapper.type()).toBe('img');
        });

        it('should format URL with regex', () => {
          expect(wrapper.prop('src')).toBe(expected);
        });
      });
    });
  });

  describe('given URL if URL is image placeholder', () => {
    const url = NoImageIcon;
    const wrapper = shallow(<Image url={url} />);

    it('should put URL as src in state', () => {
      expect(wrapper.state('src')).toBe(url);
    });

    it('should render given URL', () => {
      expect(wrapper.prop('src')).toBe(url);
    });
  });

  describe('given URL if URL is image placeholder and there is a regex defined', () => {
    const url = NoImageIcon;
    const regex = {
      search: /\/[0-9]+\/[0-9]+/,
      replace: '/500/500',
      flag: 'g',
    };
    const wrapper = shallow(<Image url={url} regex={regex} />);

    it('should put URL as src in state', () => {
      expect(wrapper.state('src')).toBe(url);
    });

    it('should render given URL', () => {
      expect(wrapper.prop('src')).toBe(url);
    });
  });

  describe('given URL if URL is data source', () => {
    const url = 'data:xxx';
    const wrapper = shallow(<Image url={url} />);

    it('should put URL as src in state', () => {
      expect(wrapper.state('src')).toBe(url);
    });

    it('should render given URL', () => {
      expect(wrapper.prop('src')).toBe(url);
    });
  });

  describe('given URL if URL is external and explicitly do not use the fallback icon', () => {
    const url = 'https://example.s3-bucket.org/image.jpg';
    const wrapper = shallow(
      <Image url={url} useExternalIconAsFallback={false} />
    );

    it('should put url as src in state', () => {
      expect(wrapper.state('src')).toBe(url);
    });

    it('should render given URL', () => {
      expect(wrapper.prop('src')).toBe(url);
    });
  });

  describe('external icon if URL is external', () => {
    const url = 'https://example.s3-bucket.org/image.jpg';
    const expected = ExternalIcon;
    const wrapper = shallow(<Image url={url} />);

    it('should put URL as src in state', () => {
      expect(wrapper.state('src')).toBe(expected);
    });

    it('should fallback icon', () => {
      expect(wrapper.prop('src')).toBe(expected);
    });
  });

  describe('update URL as src in state when receiving new props', () => {
    const url = 'https://111.ssl.rackcdn.com/foo.jpg';
    const formatUrl = size => `https://111.ssl.rackcdn.com/foo-${size}.jpg`;
    const wrapper = shallow(<Image url={url} size="thumb" />);

    it('should put intial URL as src in state', () => {
      expect(wrapper.state('src')).toBe(formatUrl('thumb'));
    });

    it('should put updated URL as src in state', () => {
      wrapper.setProps({ size: 'zoom' });
      expect(wrapper.state('src')).toBe(formatUrl('zoom'));
    });
  });

  describe('broken icon if URL is broken (internal)', () => {
    const url = 'https://111.ssl.rackcdn.com/broken.jpg';
    const expected = BrokenIcon;
    const wrapper = shallow(<Image url={url} size="thumb" />);

    it('should put broken icon URl in state', () => {
      wrapper.instance().handleError();
      expect(wrapper.state('src')).toBe(expected);
    });

    it('should render broken icon', () => {
      wrapper.update();
      expect(wrapper.find('img').props().src).toBe(expected);
    });
  });

  describe('broken icon if URL is broken (external)', () => {
    const url = 'https://example.s3-bucket.org/broken-image.jpg';
    const expected = BrokenExternalIcon;
    const wrapper = shallow(
      <Image url={url} useExternalIconAsFallback={false} />
    );

    it('should put broken icon URL in state', () => {
      wrapper.instance().handleError();
      expect(wrapper.state('src')).toBe(expected);
    });

    it('should render broken icon', () => {
      wrapper.update();
      expect(wrapper.find('img').props().src).toBe(expected);
    });
  });
});
