import React from 'react';
import { shallow } from 'enzyme';
import ModalStateContainer, { withModalState } from './modal-state-container';

const Component = props => <div {...props}>Component</div>;
Component.displayName = 'Component';

const createTestProps = props => ({
  ...props,
});

describe('<ModalStateContainer>', () => {
  let wrapper;
  let props;
  describe('statics', () => {
    describe('defaultProps', () => {
      it('should default `isDefaultOpen` to `false`', () => {
        expect(ModalStateContainer.defaultProps.isDefaultOpen).toBe(false);
      });
    });
  });

  describe('state', () => {
    describe('with `isDefaultOpen`', () => {
      beforeEach(() => {
        props = createTestProps({ isDefaultOpen: true });
        wrapper = shallow(
          <ModalStateContainer {...props} render={() => <Component />} />
        );
      });

      it('should have `isOpen` state from `isDefaultOpen`', () => {
        expect(wrapper).toHaveState('isOpen', props.isDefaultOpen);
      });
    });

    describe('handleOpen', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <ModalStateContainer {...props} render={() => <Component />} />
        );

        wrapper.instance().handleOpen();
      });

      it('should set `isOpen` to `true`', () => {
        expect(wrapper).toHaveState('isOpen', true);
      });
    });

    describe('handleClose', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <ModalStateContainer {...props} render={() => <Component />} />
        );

        wrapper.instance().handleOpen();
        wrapper.instance().handleClose();
      });

      it('should set `isOpen` back to `false`', () => {
        expect(wrapper).toHaveState('isOpen', false);
      });
    });
  });

  describe('rendering', () => {
    describe('with `render`', () => {
      beforeEach(() => {
        props = createTestProps({
          render: jest.fn(),
        });
        wrapper = shallow(<ModalStateContainer {...props} />);
      });

      it('should invoke `render`', () => {
        expect(props.render).toHaveBeenCalled();
      });

      it('should invoke `render` component Api', () => {
        expect(props.render).toHaveBeenCalledWith({
          isOpen: false,
          handleOpen: wrapper.instance().handleOpen,
          handleClose: wrapper.instance().handleClose,
        });
      });
    });

    describe('with `children`', () => {
      let children;
      beforeEach(() => {
        children = jest.fn(() => <Component />);
        props = createTestProps();
        wrapper = shallow(
          <ModalStateContainer {...props}>{children}</ModalStateContainer>
        );
      });

      it('should invoke `children`', () => {
        expect(children).toHaveBeenCalled();
      });

      it('should invoke `children` component Api', () => {
        expect(children).toHaveBeenCalledWith({
          isOpen: false,
          handleOpen: wrapper.instance().handleOpen,
          handleClose: wrapper.instance().handleClose,
        });
      });
    });
  });
});

describe('withModalState', () => {
  const createApi = props => ({
    isOpen: false,
    handleOpen: jest.fn(),
    handleClose: jest.fn(),

    ...props,
  });

  describe('without `propName`', () => {
    let wrapper;
    let EnhancedComponent;

    beforeEach(() => {
      EnhancedComponent = withModalState()(Component);
      wrapper = shallow(<EnhancedComponent />);
    });

    it('should render a `<ModalStateContainer>', () => {
      expect(wrapper).toRender(ModalStateContainer);
    });

    describe('<ModalStateContainer>', () => {
      let enhancedComponentWrapper;
      let apiMock;

      beforeEach(() => {
        apiMock = createApi();

        enhancedComponentWrapper = shallow(
          wrapper.find(ModalStateContainer).prop('children')(apiMock)
        );
      });

      it('should pass a `modal` prop to the enhanced component', () => {
        expect(enhancedComponentWrapper).toHaveProp('modal');
      });

      it('should pass `isOpen` to the enhanced component', () => {
        expect(enhancedComponentWrapper).toHaveProp(
          'modal',
          expect.objectContaining({ isOpen: apiMock.isOpen })
        );
      });

      it('should pass `handleClose` to the enhanced component', () => {
        expect(enhancedComponentWrapper).toHaveProp(
          'modal',
          expect.objectContaining({ handleClose: apiMock.handleClose })
        );
      });

      it('should pass `handleOpen` to the enhanced component', () => {
        expect(enhancedComponentWrapper).toHaveProp(
          'modal',
          expect.objectContaining({ handleOpen: apiMock.handleOpen })
        );
      });
    });
  });

  describe('with `propName`', () => {
    let wrapper;
    let EnhancedComponent;

    beforeEach(() => {
      EnhancedComponent = withModalState('anotherModal')(Component);
      wrapper = shallow(<EnhancedComponent />);
    });

    it('should render a `<ModalStateContainer>', () => {
      expect(wrapper).toRender(ModalStateContainer);
    });

    describe('<ModalStateContainer>', () => {
      let enhancedComponentWrapper;
      let apiMock;

      beforeEach(() => {
        apiMock = createApi();

        enhancedComponentWrapper = shallow(
          wrapper.find(ModalStateContainer).prop('children')(apiMock)
        );
      });

      it('should pass a `modal` prop to the enhanced component', () => {
        expect(enhancedComponentWrapper).toHaveProp('anotherModal');
      });
    });
  });
});
