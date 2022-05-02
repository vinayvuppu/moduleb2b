import React from 'react';
import { shallow } from 'enzyme';
import Step from '../step';
import { Steps } from './steps';

const createTestProps = props => ({
  steps: [
    { key: '1', label: 'Label 1' },
    { key: '2', label: 'Label 2' },
    { key: '3', label: 'Label 3' },
  ],
  activeStepKey: '2',
  ...props,
});

describe('rendering', () => {
  describe('base components', () => {
    const props = createTestProps();
    const wrapper = shallow(<Steps {...props} />);
    const renderedSteps = wrapper.find('Step');

    it('should render three steps', () => {
      expect(renderedSteps).toHaveLength(3);
    });

    const firstStep = renderedSteps.at(0);
    it('should set first label on first step', () => {
      expect(firstStep.prop('label')).toBe('Label 1');
    });

    it('first step should not be clickable', () => {
      expect(firstStep.prop('clickable')).toBeFalsy();
    });

    it('should set isDone to true on the first step', () => {
      expect(firstStep.prop('isDone')).toBeTruthy();
    });

    it('should have first step at index 0', () => {
      expect(firstStep.prop('index')).toBe(0);
    });

    const secondStep = renderedSteps.at(1);

    it('should set second label on second step', () => {
      expect(secondStep.prop('label')).toBe('Label 2');
    });

    it('second step should be active', () => {
      expect(secondStep.prop('isActive')).toBeTruthy();
    });

    it('shoud set isDone to false on the second step', () => {
      expect(secondStep.prop('isDone')).not.toBeTruthy();
    });

    it('should set the index to 1', () => {
      expect(secondStep.prop('index')).toBe(1);
    });

    const thirdStep = renderedSteps.at(2);

    it('should set the third label on third step', () => {
      expect(thirdStep.prop('label')).toBe('Label 3');
    });

    it('should set isDone to false on the third step', () => {
      expect(thirdStep.prop('isDone')).not.toBeTruthy();
    });

    it('should set the index to 2', () => {
      expect(thirdStep.prop('index')).toBe(2);
    });
  });
  describe('with onClick functions', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = createTestProps({
        steps: [
          {
            key: '1',
            isClickable: true,
            label: 'Label 1',
            onClick: jest.fn(),
          },
          {
            key: '2',
            isClickable: true,
            label: 'Label 2',
            onClick: jest.fn(),
          },
          {
            key: '3',
            isClickable: true,
            label: 'Label 3',
            onClick: jest.fn(),
          },
        ],
      });
      wrapper = shallow(<Steps {...props} />);
    });

    it('should have three steps', () => {
      expect(wrapper).toRenderElementTimes(Step, 3);
    });

    describe('when clicking', () => {
      beforeEach(() => {
        wrapper = shallow(<Steps {...props} />);

        wrapper
          .find(Step)
          .at(0)
          .prop('onClick')();

        it('should invoke onClick on first step', () => {
          expect(props.steps[0].onClick).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
