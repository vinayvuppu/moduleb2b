import React from 'react';
import { shallow } from 'enzyme';
import { IconButton } from '@commercetools-frontend/ui-kit';
import { InfoDialog } from '@commercetools-frontend/application-components';
import { intlMock } from '../../../test-utils';
import { CustomViewsOnboarding } from './custom-views-onboarding';

const createTestProps = customProps => ({
  // injectIntl
  intl: intlMock,
  // withModalState
  onboardingModal: {
    isOpen: false,
    handleOpen: jest.fn(),
    handleClose: jest.fn(),
  },
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomViewsOnboarding {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('when onboarding modal is open', () => {
    beforeEach(() => {
      props = createTestProps({
        onboardingModal: {
          isOpen: true,
          handleOpen: jest.fn(),
          handleClose: jest.fn(),
        },
      });
      wrapper = shallow(<CustomViewsOnboarding {...props} />);
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render `<InfoDialog>`', () => {
      expect(wrapper).toRender(InfoDialog);
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomViewsOnboarding {...props} />);
  });

  describe('when clicking on `<IconButton>`', () => {
    describe('when modal is closed', () => {
      beforeEach(() => {
        wrapper.find(IconButton).prop('onClick')();
      });

      it('should open the onboarding modal', () => {
        expect(props.onboardingModal.handleOpen).toHaveBeenCalled();
      });
    });

    describe('when modal is open', () => {
      beforeEach(() => {
        props = createTestProps({
          onboardingModal: {
            isOpen: true,
            handleOpen: jest.fn(),
            handleClose: jest.fn(),
          },
        });
        wrapper = shallow(<CustomViewsOnboarding {...props} />);
        wrapper.find(IconButton).prop('onClick')();
      });

      it('should close the onboarding modal', () => {
        expect(props.onboardingModal.handleClose).toHaveBeenCalled();
      });

      describe('when clicking on `<FlatButton>`', () => {
        beforeEach(() => {
          wrapper.find(IconButton).prop('onClick')();
        });

        it('should close the onboarding modal', () => {
          expect(props.onboardingModal.handleClose).toHaveBeenCalled();
        });
      });
    });
  });
});
