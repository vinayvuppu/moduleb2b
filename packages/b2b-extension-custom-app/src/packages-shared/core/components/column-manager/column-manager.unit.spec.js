import React from 'react';
import { shallow } from 'enzyme';
import { intlMock } from '../../../test-utils';
import ColumnManager from './column-manager';

const createTestProps = props => ({
  availableColumns: [
    {
      key: 'column1',
      label: 'Column 1',
    },
    {
      key: 'column2',
      label: 'Column 2',
    },
    {
      key: 'column3',
      label: 'Column 3',
    },
    {
      key: 'column4',
      label: 'Column 4',
    },
  ],
  selectedColumns: [
    {
      key: 'column1',
      label: 'Column 1',
    },
    {
      key: 'column3',
      label: 'Column 3',
    },
  ],
  onUpdateColumns: jest.fn(),
  intl: intlMock,
  ...props,
});

jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    ...actual,
    useIntl: jest.fn(() => ({
      formatMessage: jest.fn(() => 'formatted message'),
    })),
  };
});

// the following tests test drag and drop behaviour using enzyme. They should
// be converted to rlt tests once testing drag and drop behaviour with rtl
// is figured out, if ever possible
describe.skip('callbacks', () => {
  describe('when dragging items', () => {
    describe('when swapping selected columns', () => {
      describe('when swapping to a valid position', () => {
        let wrapper;
        let columnManagerWrapper;
        let props;
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<ColumnManager {...props} />);
          columnManagerWrapper = shallow(
            wrapper.find('CollapsibleMotion').prop('children')({
              isOpen: true,
              onToggle: jest.fn(),
            })
          );
          columnManagerWrapper.find('DragDropContext').prop('onDragEnd')({
            draggableId: 'column1',
            destination: {
              index: 1,
            },
            source: {
              droppableId: 'selected-columns-panel',
              index: 0,
            },
          });
        });
        it('should call the `onUpdateColumns` function', () => {
          expect(props.onUpdateColumns).toHaveBeenCalledTimes(1);
        });
        it('should call the `onUpdateColumns` function with the new columns order', () => {
          expect(props.onUpdateColumns).toHaveBeenCalledWith([
            {
              key: 'column3',
              label: 'Column 3',
            },
            {
              key: 'column1',
              label: 'Column 1',
            },
          ]);
        });
      });
      describe('when swapping to a invalid position', () => {
        let wrapper;
        let columnManagerWrapper;
        let props;
        beforeEach(() => {
          props = createTestProps();
          wrapper = shallow(<ColumnManager {...props} />);
          columnManagerWrapper = shallow(
            wrapper.find('CollapsibleMotion').prop('children')({
              isOpen: true,
              onToggle: jest.fn(),
            })
          );
          columnManagerWrapper.find('DragDropContext').prop('onDragEnd')({});
        });
        it('should call the `onUpdateColumns` function', () => {
          expect(props.onUpdateColumns).toHaveBeenCalledTimes(0);
        });
      });
    });
    describe('when moving a column from the hidden section to the selected one', () => {
      let wrapper;
      let columnManagerWrapper;
      let props;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<ColumnManager {...props} />);
        columnManagerWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')({
            isOpen: true,
            onToggle: jest.fn(),
          })
        );
        columnManagerWrapper.find('DragDropContext').prop('onDragEnd')({
          draggableId: 'column2',
          destination: {
            index: 1,
          },
          source: {
            droppableId: 'hidden-columns-panel',
            index: 0,
          },
        });
      });
      it('should call the `onUpdateColumns` function', () => {
        expect(props.onUpdateColumns).toHaveBeenCalledTimes(1);
      });
      it('should call the `onUpdateColumns` function with the new columns order', () => {
        expect(props.onUpdateColumns).toHaveBeenCalledWith([
          {
            key: 'column1',
            label: 'Column 1',
          },
          {
            key: 'column2',
            label: 'Column 2',
          },
          {
            key: 'column3',
            label: 'Column 3',
          },
        ]);
      });
    });
    describe('when moving a column from the selected section to the hidden one', () => {
      let wrapper;
      let columnManagerWrapper;
      let props;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<ColumnManager {...props} />);
        columnManagerWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')({
            isOpen: true,
            onToggle: jest.fn(),
          })
        );
        columnManagerWrapper.find('DragDropContext').prop('onDragEnd')({
          draggableId: 'column1',
          destination: {
            index: 1,
            droppableId: 'hidden-columns-panel',
          },
          source: {
            droppableId: 'selected-columns-panel',
            index: 0,
          },
        });
      });
      it('should call the `onUpdateColumns` function', () => {
        expect(props.onUpdateColumns).toHaveBeenCalledTimes(1);
      });
      it('should call the `onUpdateColumns` function with the new columns order', () => {
        expect(props.onUpdateColumns).toHaveBeenCalledWith([
          {
            key: 'column3',
            label: 'Column 3',
          },
        ]);
      });
    });
    describe('when swapping columns in the hidden section', () => {
      let wrapper;
      let columnManagerWrapper;
      let props;
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(<ColumnManager {...props} />);
        columnManagerWrapper = shallow(
          wrapper.find('CollapsibleMotion').prop('children')({
            isOpen: true,
            onToggle: jest.fn(),
          })
        );
        columnManagerWrapper.find('DragDropContext').prop('onDragEnd')({
          draggableId: 'column2',
          destination: {
            index: 1,
            droppableId: 'hidden-columns-panel',
          },
          source: {
            droppableId: 'hidden-columns-panel',
            index: 0,
          },
        });
      });
      it('should not call the `onUpdateColumns` function', () => {
        expect(props.onUpdateColumns).toHaveBeenCalledTimes(0);
      });
    });
  });
});
