import React from 'react';
import { shallow } from 'enzyme';
import invariant from 'tiny-invariant';
import Switch from './validation-error-switch';
import Match from './validation-error-match';

jest.mock('tiny-invariant');

const ChildComponent = () => <div />;
ChildComponent.displayName = 'ChildComponent';

const createErrors = custom => ({
  'rule-foo': false,
  'rule-bar': false,
  'rule-faz': false,

  ...custom,
});
const createTestProps = custom => ({
  isTouched: true,
  errors: createErrors(),

  ...custom,
});
const createMatchTestProps = custom => ({
  rule: 'rule-bar',
  isTouched: true,

  ...custom,
});

describe('<Switch>', () => {
  describe('rendering', () => {
    let props;
    let wrapper;

    beforeEach(() => {
      props = createTestProps();
      wrapper = shallow(
        <Switch {...props}>
          <Match {...createMatchTestProps()}>
            <ChildComponent />
          </Match>
        </Switch>
      );
    });

    it('should match snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;

  describe('componentDidMount', () => {
    describe('with children other than `<Match>`', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <Switch {...props}>
            <Match {...createMatchTestProps()}>
              <ChildComponent />
            </Match>
            <div />
          </Switch>
        );

        wrapper.instance().componentDidMount();
      });

      it('should invoke `invariant`', () => {
        expect(invariant).toHaveBeenCalled();
      });
    });
  });
});
