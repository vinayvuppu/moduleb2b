import React from 'react';
import { shallow } from 'enzyme';
import Match from './validation-error-match';

const ChildComponent = () => <div />;
ChildComponent.displayName = 'ChildComponent';

const createTestProps = custom => ({
  rule: 'rule-foo',
  isTouched: true,
  hasError: false,

  ...custom,
});

describe('<Match>', () => {
  describe('rendering', () => {
    let props;
    let wrapper;

    describe('without `error` for `rule` ', () => {
      beforeEach(() => {
        props = createTestProps();
        wrapper = shallow(
          <Match {...props}>
            <ChildComponent />
          </Match>
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render `children`', () => {
        expect(wrapper).not.toRender(ChildComponent);
      });
    });

    describe('with `error` for `rule` ', () => {
      beforeEach(() => {
        props = createTestProps({
          hasError: true,
        });
      });
      describe('when `isTouched`', () => {
        describe('with `children`', () => {
          beforeEach(() => {
            wrapper = shallow(
              <Match {...props}>
                <ChildComponent />
              </Match>
            );
          });

          it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
          });

          it('should render `children`', () => {
            expect(wrapper).toRender(ChildComponent);
          });
        });

        describe('with `component`', () => {
          beforeEach(() => {
            wrapper = shallow(<Match {...props} component={ChildComponent} />);
          });

          it('should match snapshot', () => {
            expect(wrapper).toMatchSnapshot();
          });

          it('should render `children`', () => {
            expect(wrapper).toRender(ChildComponent);
          });
        });
      });
    });

    describe('when not `isTouched', () => {
      beforeEach(() => {
        props = createTestProps({
          hasError: true,
          isTouched: false,
        });
        wrapper = shallow(
          <Match {...props}>
            <ChildComponent />
          </Match>
        );
      });

      it('should match snapshot', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('should not render `children`', () => {
        expect(wrapper).not.toRender(ChildComponent);
      });
    });
  });
});
