import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import {
  NestedAttributesContainerProvider,
  createProviderAPI,
} from './nested-attributes-container-provider';
import NestedAttributesContainerConsumer from './nested-attributes-container-consumer';

const productDraft = {
  id: 'product-id',
  name: 'product-name',
};

const productAttributeDefinitions = [
  {
    name: 'attr-name',
  },
];
const TestComponent = props => {
  return (
    <NestedAttributesContainerProvider
      setProductDraft={props.setProductDraft}
      productDraft={productDraft}
      productAttributeDefinitions={productAttributeDefinitions}
    >
      <NestedAttributesContainerConsumer>
        {({
          addOpenedModalLevelToStack,
          cancelInternalProductDraftUpdates,
          updateInternalProductDraft,
          removeClosedModalLevelFromStack,
        }) => {
          return (
            <div>
              <button
                id="add-opened-modal-level-to-stack"
                onClick={() => {
                  addOpenedModalLevelToStack(1);
                }}
              >
                Add opened modal level to stack
              </button>
              <button
                id="remove-opened-modal-level-to-stack"
                onClick={() => {
                  removeClosedModalLevelFromStack(1);
                }}
              >
                Remove opened modal level to stack
              </button>
              <button
                id="cancel-internal-product-draft-updates"
                onClick={() => {
                  cancelInternalProductDraftUpdates();
                }}
              >
                Cancel internal product draft updates
              </button>
              <button
                id="update-internal-product-draft"
                onClick={() => {
                  updateInternalProductDraft();
                }}
              >
                Update internal product draft
              </button>
            </div>
          );
        }}
      </NestedAttributesContainerConsumer>
    </NestedAttributesContainerProvider>
  );
};
TestComponent.propTypes = {
  setProductDraft: PropTypes.func.isRequired,
};
describe('NestedAttributesContainer', () => {
  let wrapper;
  let containerProviderWrapper;
  let setProductDraft;
  beforeEach(() => {
    setProductDraft = jest.fn();

    const containerWrapper = shallow(
      <TestComponent setProductDraft={setProductDraft} />
    );
    containerProviderWrapper = containerWrapper
      .find(NestedAttributesContainerProvider)
      .dive();

    wrapper = containerWrapper
      .find(NestedAttributesContainerConsumer)
      .renderProp('children')(
      createProviderAPI(
        containerProviderWrapper.state('nestedAttributesModalStack'),
        containerProviderWrapper.instance().addOpenedModalLevelToStack,
        containerProviderWrapper.instance().removeClosedModalLevelFromStack,
        containerProviderWrapper.instance().updateInternalProductDraft,
        containerProviderWrapper.instance().cancelInternalProductDraftUpdates,
        true
      )
    );
  });
  describe('when add opened modal level to stack', () => {
    it('should add to the modal stack', () => {
      expect(
        containerProviderWrapper.state('nestedAttributesModalStack')
      ).toEqual([]);
      wrapper.find('#add-opened-modal-level-to-stack').simulate('click');
      expect(
        containerProviderWrapper.state('nestedAttributesModalStack')
      ).toEqual([1]);
    });
  });
  describe('when remove opened modal level to stack', () => {
    it('should remove from the modal stack', () => {
      expect(
        containerProviderWrapper.state('nestedAttributesModalStack')
      ).toEqual([]);
      wrapper.find('#add-opened-modal-level-to-stack').simulate('click');
      expect(
        containerProviderWrapper.state('nestedAttributesModalStack')
      ).toEqual([1]);
      wrapper.find('#remove-opened-modal-level-to-stack').simulate('click');
      expect(
        containerProviderWrapper.state('nestedAttributesModalStack')
      ).toEqual([]);
    });
  });
  describe('when canceling internal product draft updates', () => {
    it('should call setProductDraft with the `previousProductDraft` ', () => {
      wrapper.find('#cancel-internal-product-draft-updates').simulate('click');
      expect(setProductDraft).toHaveBeenCalledWith(
        containerProviderWrapper.state('previousProductDraft')
      );
    });
  });
  describe('when updating internal product draft', () => {
    it("should update state's `previousProductDraft` with the draft", () => {
      wrapper.find('#update-internal-product-draft').simulate('click');
      expect(containerProviderWrapper.state('previousProductDraft')).toEqual(
        productDraft
      );
    });
  });
});
