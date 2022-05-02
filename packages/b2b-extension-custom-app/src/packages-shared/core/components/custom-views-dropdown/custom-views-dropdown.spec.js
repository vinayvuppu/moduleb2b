import React from 'react';
import { shallow } from 'enzyme';
import { LoadingSpinner } from '@commercetools-frontend/ui-kit';
import { intlMock } from '../../../test-utils';
import { CustomViewsDropdown } from './custom-views-dropdown';
import Options from './custom-views-dropdown-options';
import messages from './messages';

const createValue = custom => ({
  id: 'test-id-123',
  name: {
    en: 'test-name-en',
  },
  isImmutable: false,
  ...custom,
});
const createTestProps = customProps => ({
  projectKey: 'test-project-key',
  isDisabled: false,
  isDirty: false,
  onSelect: jest.fn().mockName('onSelect'),
  onCreate: jest.fn().mockName('onCreate'),
  onUpdate: jest.fn().mockName('onUpdate'),
  onDelete: jest.fn().mockName('onDelete'),
  onEdit: jest.fn().mockName('onEdit'),
  onSave: jest.fn().mockName('onSave'),
  onReset: jest.fn().mockName('onReset'),
  track: jest.fn().mockName('track'),
  value: createValue(),
  options: [
    createValue(),
    createValue({ isImmutable: undefined, id: 'test-id-345' }),
  ],
  language: 'de',
  languages: ['de'],
  intl: intlMock,
  ...customProps,
});

const createDownshiftRenderProps = customProps => ({
  isOpen: false,
  toggleMenu: jest.fn(),
  ...customProps,
});

describe('rendering', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomViewsDropdown {...props} />);
  });

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('dropdown', () => {
    describe('when closed', () => {
      beforeEach(() => {
        wrapper = wrapper.renderProp('children')(createDownshiftRenderProps());
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render a <Options.Selected>', () => {
        expect(wrapper).toRender(Options.Selected);
      });

      describe('<Options.Selected>', () => {
        describe('when dirty', () => {
          beforeEach(() => {
            props = createTestProps({
              isDirty: true,
            });
            wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
              'children'
            )(createDownshiftRenderProps());
          });
          describe('when value is mutable', () => {
            it('should receive `isDirty` as true', () => {
              expect(wrapper.find(Options.Selected)).toHaveProp(
                'isDirty',
                true
              );
            });
          });
        });

        describe('when not dirty', () => {
          it('should receive `isDirty` as false', () => {
            expect(wrapper.find(Options.Selected)).toHaveProp('isDirty', false);
          });
        });
      });
    });

    describe('when open', () => {
      beforeEach(() => {
        wrapper = wrapper.renderProp('children')(
          createDownshiftRenderProps({ isOpen: true })
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should render <Options.Action> for creating', () => {
        expect(wrapper).toRender({ name: 'create' });
      });

      describe('with options', () => {
        it('should render a <Options.Selectable> per `option`', () => {
          expect(wrapper).toRenderElementTimes(
            Options.Selectable,
            props.options.length
          );
        });
      });

      describe('without options', () => {
        beforeEach(() => {
          props = createTestProps({
            options: null,
          });
          wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
            'children'
          )(createDownshiftRenderProps({ isOpen: true }));
        });

        it('should render a <LoadingSpinner>', () => {
          expect(wrapper).toRender(LoadingSpinner);
        });
      });

      describe('without existing options', () => {
        beforeEach(() => {
          props = createTestProps({
            options: [],
          });
          wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
            'children'
          )(createDownshiftRenderProps({ isOpen: true }));
        });

        it('should render no options message', () => {
          expect(wrapper).toRender({ id: messages.noOptions.id });
        });
      });

      describe('when not dirty', () => {
        describe('when option it not `isImmutable`', () => {
          beforeEach(() => {
            props = createTestProps({
              isDirty: false,
              value: createValue({
                isImmutable: false,
              }),
            });
            wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
              'children'
            )(createDownshiftRenderProps({ isOpen: true }));
          });

          it('should render <FlatButton> for deleting', () => {
            expect(wrapper).toRender({ name: 'delete' });
          });
        });
      });

      describe('when dirty', () => {
        beforeEach(() => {
          props = createTestProps({
            isDirty: true,
          });
          wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
            'children'
          )(createDownshiftRenderProps({ isOpen: true }));
        });

        it('should render <FlatButton> for creating', () => {
          expect(wrapper).toRender({ name: 'create' });
        });

        it('should render <FlatButton> for resetting', () => {
          expect(wrapper).toRender({ name: 'reset' });
        });

        it('should render <FlatButton> for editing', () => {
          expect(wrapper).toRender({ name: 'edit' });
        });

        it('should render <FlatButton> for deleting', () => {
          expect(wrapper).toRender({ name: 'delete' });
        });

        it('should disable <FlatButton> for editing', () => {
          expect(wrapper.find({ name: 'edit' })).toHaveProp('isDisabled', true);
        });
        describe('when option `isImmutable`', () => {
          beforeEach(() => {
            props = createTestProps({
              isDirty: true,
              value: createValue({
                isImmutable: true,
              }),
            });
            wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
              'children'
            )(createDownshiftRenderProps({ isOpen: true }));
          });

          it('should render <FlatButton> for creating', () => {
            expect(wrapper).toRender({ name: 'create' });
          });

          it('should render <FlatButton> for resetting', () => {
            expect(wrapper).toRender({ name: 'reset' });
          });

          it('should not render <FlatButton> for editing', () => {
            expect(wrapper).not.toRender({ name: 'edit' });
          });

          it('should not render <FlatButton> for deleting', () => {
            expect(wrapper).not.toRender({ name: 'delete' });
          });
        });
      });
    });
  });
});

describe('callbacks', () => {
  let downshiftProps;
  let props;
  let wrapper;

  describe('when clicking on the <Options.Selected>', () => {
    beforeEach(() => {
      downshiftProps = createDownshiftRenderProps({ isOpen: true });
      props = createTestProps();
      wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
        'children'
      )(downshiftProps);
      wrapper.find(Options.Selected).prop('onClick')();
    });

    it('should close the dropdown by invoking `toggleMenu`', () => {
      expect(downshiftProps.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('when clicking on the <Options.Selectable>', () => {
    beforeEach(() => {
      downshiftProps = createDownshiftRenderProps({ isOpen: true });
      props = createTestProps();
      wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
        'children'
      )(downshiftProps);
      wrapper
        .find(Options.Selectable)
        .last()
        .prop('onClick')();
    });

    it('should invoke `onSelect` with the option', () => {
      expect(props.onSelect).toHaveBeenCalledWith(props.options[1]);
    });

    it('should close the dropdown by invoking `toggleMenu`', () => {
      expect(downshiftProps.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('when clicking on the <FlatButton> for updating', () => {
    beforeEach(() => {
      downshiftProps = createDownshiftRenderProps({ isOpen: true });
      props = createTestProps({
        isDirty: true,
        value: createValue({
          isImmutable: false,
        }),
      });
      wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
        'children'
      )(downshiftProps);

      wrapper.find({ name: 'update' }).prop('onClick')();
    });

    it('should invoke `onSave`', () => {
      expect(props.onSave).toHaveBeenCalled();
    });

    it('should close the dropdown by invoking `toggleMenu`', () => {
      expect(downshiftProps.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('when clicking on the <FlatButton> for editing', () => {
    beforeEach(() => {
      downshiftProps = createDownshiftRenderProps({ isOpen: true });
      props = createTestProps({
        value: createValue({
          isImmutable: false,
        }),
      });
      wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
        'children'
      )(downshiftProps);

      wrapper.find({ name: 'edit' }).prop('onClick')();
    });

    it('should invoke `onEdit`', () => {
      expect(props.onEdit).toHaveBeenCalled();
    });

    it('should close the dropdown by invoking `toggleMenu`', () => {
      expect(downshiftProps.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('when clicking on the <FlatButton> to reset', () => {
    beforeEach(() => {
      downshiftProps = createDownshiftRenderProps({ isOpen: true });
      props = createTestProps({
        isDirty: true,
      });
      wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
        'children'
      )(downshiftProps);

      wrapper.find({ name: 'reset' }).prop('onClick')();
    });

    it('should invoke `onReset`', () => {
      expect(props.onReset).toHaveBeenCalled();
    });

    it('should close the dropdown by invoking `toggleMenu`', () => {
      expect(downshiftProps.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('when clicking on the <Option.Action> for creating', () => {
    beforeEach(() => {
      wrapper.find({ name: 'create' }).prop('onClick')();
    });

    it('should invoke `onCreate`', () => {
      expect(props.onCreate).toHaveBeenCalled();
    });

    it('should close the dropdown by invoking `toggleMenu`', () => {
      expect(downshiftProps.toggleMenu).toHaveBeenCalled();
    });
  });

  describe('when clicking on the delete <Option.Action>', () => {
    beforeEach(() => {
      downshiftProps = createDownshiftRenderProps({ isOpen: true });
      props = createTestProps({
        isDirty: false,
        value: createValue({
          isImmutable: false,
        }),
      });
      wrapper = shallow(<CustomViewsDropdown {...props} />).renderProp(
        'children'
      )(downshiftProps);

      wrapper.find({ name: 'delete' }).prop('onClick')();
    });

    it('should invoke `onDelete`', () => {
      expect(props.onDelete).toHaveBeenCalled();
    });

    it('should close the dropdown by invoking `toggleMenu`', () => {
      expect(downshiftProps.toggleMenu).toHaveBeenCalled();
    });
  });
});
