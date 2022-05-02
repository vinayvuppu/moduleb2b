import React from 'react';
import { shallow } from 'enzyme';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { GetProjectExtensionImageRegex } from '@commercetools-frontend/application-shell-connectors';
import Image from '../image';
import ImageContainer from './image-container';

describe('rendering', () => {
  let wrapper;
  describe('when query is loading', () => {
    beforeEach(() => {
      wrapper = shallow(<ImageContainer />)
        .find(GetProjectExtensionImageRegex)
        .renderProp('render')({ isLoading: true });
    });
    it('should render <LoadingSpinner>', () => {
      expect(wrapper).toRender(LoadingSpinner);
    });
  });
  describe('when query returns data', () => {
    beforeEach(() => {
      wrapper = shallow(<ImageContainer />)
        .find(GetProjectExtensionImageRegex)
        .renderProp('render')({
        isLoading: false,
        imageRegex: {
          thumb: {
            flag: 'gi',
            replace: '-thumb.jpg',
            search: '.[^.]+$',
          },
        },
      });
    });
    it('should pass "regex" prop', () => {
      expect(wrapper.find(Image)).toHaveProp('regex', {
        flag: 'gi',
        replace: '-thumb.jpg',
        search: '.[^.]+$',
      });
    });
  });
});
