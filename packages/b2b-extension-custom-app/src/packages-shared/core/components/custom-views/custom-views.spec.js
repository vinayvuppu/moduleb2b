import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../test-utils';
import {
  CustomViewCreateModal,
  CustomViewRenameModal,
  CustomViewDeleteModal,
} from '../custom-view-modals';
import CustomViewsDropdown from '../custom-views-dropdown';
import { CustomViews } from './custom-views';
import messages from './messages';

const createView = custom => ({
  id: 'foo-view-id',
  name: {
    de: 'test-de-name',
  },

  ...custom,
});

const createTestProps = customProps => ({
  projectKey: 'test-project-key',
  hasUnsavedChanges: false,
  view: createView(),
  views: [createView()],
  onDelete: jest.fn(() => Promise.resolve()).mockName('onDelete'),
  onSave: jest.fn(() => Promise.resolve()).mockName('onSave'),
  onCreate: jest.fn(() => Promise.resolve()).mockName('onCreate'),
  onSelect: jest.fn().mockName('onSelect'),
  onReset: jest.fn().mockName('onReset'),
  track: jest.fn(),
  // injectIntl
  creationModal: {
    isOpen: false,
    handleOpen: jest.fn().mockName('creationModal.handleOpen'),
    handleClose: jest.fn().mockName('creationModal.handleClose'),
  },
  editingModal: {
    isOpen: false,
    handleOpen: jest.fn().mockName('editingModal.handleOpen'),
    handleClose: jest.fn().mockName('editingModal.handleClose'),
  },
  deletionModal: {
    isOpen: false,
    handleOpen: jest.fn().mockName('deletionModal.handleOpen'),
    handleClose: jest.fn().mockName('deletionModal.handleClose'),
  },
  // injectIntl
  intl: intlMock,
  // connect
  showNotification: jest.fn(),

  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomViews {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render <CustomViewCreateModal>', () => {
    expect(wrapper).toRender(CustomViewCreateModal);
  });

  describe('with unsaved changes', () => {
    beforeEach(() => {
      props = createTestProps({
        hasUnsavedChanges: true,
      });
      wrapper = shallow(<CustomViews {...props} />);
    });

    it('should render <CustomViewRenameModal>', () => {
      expect(wrapper).toRender(CustomViewRenameModal);
    });
  });
});

describe('callbacks', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomViews {...props} />);
  });

  describe('<CustomViewsDropdown>', () => {
    describe('when creating', () => {
      beforeEach(() => {
        wrapper.find(CustomViewsDropdown).prop('onCreate')();
      });

      it('should open the creation modal', () => {
        expect(props.creationModal.handleOpen).toHaveBeenCalled();
      });
    });
  });

  describe('<CustomViewCreateModal>', () => {
    describe.skip('when creating', () => {
      beforeEach(async () => {
        await wrapper.find(CustomViewCreateModal).prop('onConfirm')();
      });

      it('should invoke `onCreate`', () => {
        expect(props.onCreate).toHaveBeenCalled();
      });

      it('should close the creation modal', () => {
        expect(props.creationModal.handleClose).toHaveBeenCalled();
      });

      it('should show notification', () => {
        expect(props.showNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            kind: 'success',
            text: messages.successfulCreationNotification.id,
          })
        );
      });
    });
  });

  describe('<CustomViewRenameModal>', () => {
    describe('when saving', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<CustomViews {...props} />);

        wrapper.find(CustomViewRenameModal).prop('onConfirm')();
      });

      it('should invoke `onSave`', () => {
        expect(props.onSave).toHaveBeenCalled();
      });

      describe.skip('when saving resolves', () => {
        it('should close the editing modal', () => {
          expect(props.editingModal.handleClose).toHaveBeenCalled();
        });
      });
    });
  });

  describe('<CustomViewDeleteModal>', () => {
    describe('when deleting', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<CustomViews {...props} />);

        wrapper.find(CustomViewDeleteModal).prop('onConfirm')();
      });

      it('should invoke `onDelete`', () => {
        expect(props.onDelete).toHaveBeenCalled();
      });

      describe.skip('when deletion resolves', () => {
        it('should close the deletion modal', () => {
          expect(props.deletionModal.handleClose).toHaveBeenCalled();
        });
      });
    });
  });
});
