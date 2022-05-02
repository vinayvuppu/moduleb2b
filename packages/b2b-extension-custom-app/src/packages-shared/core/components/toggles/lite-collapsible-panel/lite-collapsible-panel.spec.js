import { shallow } from 'enzyme';
import React from 'react';
import { IconButton } from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../../test-utils';
import { LiteCollapsiblePanel } from './lite-collapsible-panel';

const ChildComponent = () => <div>{'ChildComponent'}</div>;
ChildComponent.displayName = 'ChildComponent';

const HeaderControlsComponent = <div>{'HeaderControlsComponent'}</div>;
const SecondaryTitleComponent = () => (
  <div className="aClassName">{'secondaryTitleComponent'}</div>
);

const createTestProps = custom => ({
  title: 'foo-title',
  headerControls: null,
  isOpen: false,
  onToggle: jest.fn(),
  secondaryTitle: null,

  // HoC
  intl: intlMock,

  ...custom,
});

const createCollapsibleMotionProps = custom => ({
  isOpen: false,
  toggle: jest.fn(),
  containerStyles: {},

  ...custom,
});

describe('rendering', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(
      <LiteCollapsiblePanel {...props}>
        <ChildComponent />
      </LiteCollapsiblePanel>
    );
  });

  it('should output correct tree', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('of `<PlainLiteCollapsiblePanel />`', () => {
    describe('when closed', () => {
      let collapsibleMotionWrapper;

      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <LiteCollapsiblePanel {...props}>
            <ChildComponent />
          </LiteCollapsiblePanel>
        );
        collapsibleMotionWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')(
            createCollapsibleMotionProps()
          )
        );
      });

      it('should output correct tree', () => {
        expect(collapsibleMotionWrapper).toMatchSnapshot();
      });

      it('should supply expanding message to `IconButton`', () => {
        expect(
          collapsibleMotionWrapper.find(IconButton.displayName)
        ).toHaveProp('label', 'LiteCollapsiblePanel.expand');
      });
    });
    describe('when open', () => {
      let collapsibleMotionWrapper;

      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <LiteCollapsiblePanel {...props}>
            <ChildComponent />
          </LiteCollapsiblePanel>
        );
        collapsibleMotionWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')(
            createCollapsibleMotionProps({ isOpen: true })
          )
        );
      });

      it('should output correct tree', () => {
        expect(collapsibleMotionWrapper).toMatchSnapshot();
      });

      it('should supply collapsing message to `IconButton`', () => {
        expect(
          collapsibleMotionWrapper.find(IconButton.displayName)
        ).toHaveProp('label', 'LiteCollapsiblePanel.collapse');
      });
    });
    describe('without headerControls passed', () => {
      let collapsibleMotionWrapper;

      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <LiteCollapsiblePanel {...props}>
            <ChildComponent />
          </LiteCollapsiblePanel>
        );
        collapsibleMotionWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')(
            createCollapsibleMotionProps()
          )
        );
      });

      it('should not render the `headerControls`', () => {
        expect(collapsibleMotionWrapper).not.toRender(HeaderControlsComponent);
      });
    });
    describe('with headerControls passed', () => {
      let collapsibleMotionWrapper;

      beforeEach(() => {
        props = createTestProps({ headerControls: HeaderControlsComponent });
        wrapper = shallow(
          <LiteCollapsiblePanel {...props}>
            <ChildComponent />
          </LiteCollapsiblePanel>
        );
        collapsibleMotionWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')(
            createCollapsibleMotionProps()
          )
        );
      });

      it('should render the `headerControls`', () => {
        // NOTE: We pass a component as a result we can not use `toRender`
        expect(collapsibleMotionWrapper).toIncludeText(
          'HeaderControlsComponent'
        );
      });
    });
    describe('without `secondaryTitle` passed', () => {
      let collapsibleMotionWrapper;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <LiteCollapsiblePanel {...props}>
            <ChildComponent />
          </LiteCollapsiblePanel>
        );
        collapsibleMotionWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')(
            createCollapsibleMotionProps()
          )
        );
      });
      it('should not render the `secondaryTitle`', () => {
        expect(collapsibleMotionWrapper).not.toRender(SecondaryTitleComponent);
      });
    });
    describe('with secondaryTitle passed', () => {
      let collapsibleMotionWrapper;

      beforeEach(() => {
        props = createTestProps({
          secondaryTitle: <SecondaryTitleComponent />,
        });
        wrapper = shallow(
          <LiteCollapsiblePanel {...props}>
            <ChildComponent />
          </LiteCollapsiblePanel>
        );
        collapsibleMotionWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')(
            createCollapsibleMotionProps()
          )
        );
      });

      it('should render the `secondaryTitle`', () => {
        expect(collapsibleMotionWrapper).toRender(SecondaryTitleComponent);
      });
    });
  });
});

describe('callbacks', () => {
  let props;
  let collapsibleMotionProps;
  let wrapper;
  let collapsibleMotionWrapper;

  beforeEach(() => {
    props = createTestProps();
    collapsibleMotionProps = createCollapsibleMotionProps();
    wrapper = shallow(
      <LiteCollapsiblePanel {...props}>
        <ChildComponent />
      </LiteCollapsiblePanel>
    );
    collapsibleMotionWrapper = shallow(
      wrapper.find('CollapsibleMotion').prop('children')(collapsibleMotionProps)
    );
  });

  describe('when `title-wrapper` is clicked', () => {
    beforeEach(() => {
      collapsibleMotionWrapper
        .find({ className: 'title-wrapper' })
        .prop('onClick')();
    });

    it('should invoke `toggle` passed from `CollapsibleMotion`', () => {
      expect(collapsibleMotionProps.toggle).toHaveBeenCalledTimes(1);
    });
  });
  describe('when `IconButton` is clicked', () => {
    beforeEach(() => {
      collapsibleMotionWrapper.find(IconButton).prop('onClick')();
    });

    it('should invoke `toggle` passed from `CollapsibleMotion`', () => {
      expect(collapsibleMotionProps.toggle).toHaveBeenCalledTimes(1);
    });
  });
});
