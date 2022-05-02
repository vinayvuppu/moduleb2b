import React from 'react';
import xhrMock from 'xhr-mock';
import {
  fireEvent,
  experimentalRenderAppWithRedux,
  waitForElement,
} from '@commercetools-frontend/application-shell/test-utils';
import {
  createGraphqlMock,
  createRosie,
  intlMock,
} from '../../../../test-utils';
import NestedAttributesContainer from '../../nested-attributes-container';

import NestedAttributeInputs from './nested-attribute-inputs';

beforeEach(() => {
  createRosie();
  xhrMock.setup();
  createGraphqlMock(xhrMock);
});

afterEach(async () => {
  // Ugly hack. =(
  //
  // Some of the tests ends before component did all the job related to the last interaction,
  // and then those components are sending REST requests. But by the time requests are sent
  // xhrMock is torn down already, which lead to a real request being sent to 'localhost:8080', which
  // in turn throws an Error.
  //
  // I don't have time right now to handle this issue properly (wonder if it's possible at all),
  // for now this 1 ms delay is fine.
  await new Promise(resolve => setTimeout(resolve, 1));
  xhrMock.teardown();
});

const createTestProps = custom => ({
  definition: {
    name: 'name',
    label: {
      en: 'label',
    },
    type: {
      name: 'text',
      typeReference: {
        obj: {
          name: 'typeName',
          attributes: [],
        },
      },
    },
  },
  disabled: false,
  attribute: {
    name: 'attributeName',
  },
  expandSettings: {},
  currencies: [],
  languages: [],
  numberFormat: 'en',
  selectedLanguage: 'en',
  language: 'en',
  updateSettings: jest.fn(),
  attributeDefinitions: [],
  attributes: [],
  onChangeValue: jest.fn(),
  handleChangeNestedAttribute: jest.fn(),
  intl: intlMock,

  ...custom,
});

const getComponentWithContext = props =>
  experimentalRenderAppWithRedux(
    <NestedAttributesContainer.Provider
      productDraft={{ id: 'mock-product-id' }}
      productAttributeDefinitions={[]}
    >
      <NestedAttributeInputs {...props} />
    </NestedAttributesContainer.Provider>
  );

// temporaty skip to test
describe('NestedAttributeInputs', () => {
  describe('with non-set nested attribute', () => {
    it('should only show the edit button', async () => {
      const props = createTestProps();
      const { getByTestId, queryByTestId } = getComponentWithContext(props);
      await waitForElement(() => getByTestId('edit-nested-attribute'));
      expect(queryByTestId('edit-nested-attribute')).toBeInTheDocument();
    });
  });
  describe('with no attributes', () => {
    beforeEach(() => {
      createRosie();
      xhrMock.setup();
      createGraphqlMock(xhrMock, {
        fixtures: {
          ctp: {
            productType: {
              attributeDefinitions: {
                results: [],
              },
            },
          },
        },
      });
    });
    it('should show a message indicating the lack of attributes', async () => {
      const props = createTestProps();
      const { getByText, queryByText } = getComponentWithContext(props);
      await waitForElement(() =>
        getByText('The product type referenced does not contain any attribute.')
      );
      expect(
        queryByText(
          'The product type referenced does not contain any attribute.'
        )
      ).toBeInTheDocument();
    });
  });

  describe('with set nested attribute', () => {
    describe('with one set items', () => {
      it('should show one edit set item button', async () => {
        const props = createTestProps({
          definition: {
            name: 'name',
            label: {
              en: 'label',
            },
            type: {
              name: 'set',
              elementType: {
                typeReference: {
                  obj: {
                    name: 'typeName',
                    attributes: [],
                  },
                },
              },
            },
          },
        });

        const { getByTestId, queryByTestId } = getComponentWithContext(props);
        await waitForElement(() => getByTestId('edit-set-item-0'));

        expect(queryByTestId('edit-set-item-0')).toBeInTheDocument();
      });
      it('should show one add set item button', async () => {
        const props = createTestProps({
          definition: {
            name: 'name',
            label: {
              en: 'label',
            },
            type: {
              name: 'set',
              elementType: {
                typeReference: {
                  obj: {
                    name: 'typeName',
                    attributes: [],
                  },
                },
              },
            },
          },
        });

        const { getByTestId, queryByTestId } = getComponentWithContext(props);
        await waitForElement(() => getByTestId('add-set-item-0'));

        expect(queryByTestId('add-set-item-0')).toBeInTheDocument();
      });
      it('should show one remove set item button', async () => {
        const props = createTestProps({
          definition: {
            name: 'name',
            label: {
              en: 'label',
            },
            type: {
              name: 'set',
              elementType: {
                typeReference: {
                  obj: {
                    name: 'typeName',
                    attributes: [],
                  },
                },
              },
            },
          },
        });

        const { getByTestId, queryByTestId } = getComponentWithContext(props);
        await waitForElement(() => getByTestId('remove-set-item-0'));
        expect(queryByTestId('remove-set-item-0')).toBeInTheDocument();
      });
      it('should show `New` tag for attributes without values', async () => {
        const props = createTestProps({
          definition: {
            name: 'name',
            label: {
              en: 'label',
            },
            type: {
              name: 'set',
              elementType: {
                typeReference: {
                  obj: {
                    name: 'typeName',
                    attributes: [
                      {
                        name: 'attr-name',
                        label: {
                          en: 'Attribute label',
                        },
                        type: {
                          name: 'text',
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        });

        const { getByTestId, queryByText } = getComponentWithContext(props);
        await waitForElement(() => getByTestId('add-set-item-0'));
        expect(queryByText('New')).toBeInTheDocument();
      });
    });
    describe('with multiple set items', () => {
      describe('when collapsed', () => {
        it('should show the last edit set item button', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });
          createGraphqlMock(xhrMock, {
            fixtures: {},
          });
          const { getByTestId, queryByTestId } = getComponentWithContext(props);
          await waitForElement(() => getByTestId('edit-set-item-2'));

          expect(queryByTestId('edit-set-item-2')).toBeInTheDocument();
          expect(queryByTestId('edit-set-item-1')).not.toBeInTheDocument();
          expect(queryByTestId('edit-set-item-0')).not.toBeInTheDocument();
        });
        it('should show the last add set item button', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });

          const { getByTestId, queryByTestId } = getComponentWithContext(props);
          await waitForElement(() => getByTestId('add-set-item-2'));
          expect(queryByTestId('add-set-item-2')).toBeInTheDocument();
          expect(queryByTestId('add-set-item-1')).not.toBeInTheDocument();
          expect(queryByTestId('add-set-item-0')).not.toBeInTheDocument();
        });
        it('should show the last remove set item button', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });
          const { getByTestId, queryByTestId } = getComponentWithContext(props);
          await waitForElement(() => getByTestId('remove-set-item-2'));
          expect(queryByTestId('remove-set-item-2')).toBeInTheDocument();
          expect(queryByTestId('remove-set-item-1')).not.toBeInTheDocument();
          expect(queryByTestId('remove-set-item-0')).not.toBeInTheDocument();
        });
        it('should show expand set items button', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });
          const { getByText } = getComponentWithContext(props);
          await waitForElement(() =>
            getByText(`Show set items (${props.attribute.value.length})`)
          );
          const expandCollapSetButton = getByText(
            `Show set items (${props.attribute.value.length})`
          );
          expect(expandCollapSetButton).toBeInTheDocument();
        });
      });
      describe('when expanded', () => {
        it('should show collapse set items button', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });
          const {
            getByText,
            queryByText,
            queryByTestId,
          } = getComponentWithContext(props);
          await waitForElement(() =>
            getByText(`Show set items (${props.attribute.value.length})`)
          );

          const expandCollapSetButton = getByText(
            `Show set items (${props.attribute.value.length})`
          );
          fireEvent.click(expandCollapSetButton);
          expect(
            queryByText(`Hide set items (${props.attribute.value.length})`)
          ).toBeInTheDocument();
          expect(
            queryByText(`Show set items (${props.attribute.value.length})`)
          ).not.toBeInTheDocument();
          expect(queryByTestId('remove-set-item-2')).toBeInTheDocument();
          expect(queryByTestId('remove-set-item-1')).toBeInTheDocument();
          expect(queryByTestId('remove-set-item-0')).toBeInTheDocument();
        });
        it('should show all items', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });
          const {
            getByText,
            getByTestId,
            queryByTestId,
          } = getComponentWithContext(props);
          await waitForElement(() => getByTestId('edit-set-item-2'));
          const expandCollapSetButton = getByText(
            `Show set items (${props.attribute.value.length})`
          );
          fireEvent.click(expandCollapSetButton);
          expect(queryByTestId('edit-set-item-2')).toBeInTheDocument();
          expect(queryByTestId('edit-set-item-1')).toBeInTheDocument();
          expect(queryByTestId('edit-set-item-0')).toBeInTheDocument();
        });
        it('should be able to remove set item', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });
          const { getByText, getByTestId } = getComponentWithContext(props);
          await waitForElement(() => getByTestId('edit-set-item-2'));
          const expandCollapSetButton = getByText(
            `Show set items (${props.attribute.value.length})`
          );
          fireEvent.click(expandCollapSetButton);
          const removeSecondItemButton = getByTestId('remove-set-item-1');
          fireEvent.click(removeSecondItemButton);
          expect(props.handleChangeNestedAttribute).toHaveBeenCalledWith(
            {
              name: 'attributeName',
              value: [[{ attr: 'val-1' }], [{ attr: 'val-3' }]],
            },
            expect.any(Object)
          );
        });
        it('should be able to add set item', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
              ],
            },
          });
          const { getByTestId } = getComponentWithContext(props);

          await waitForElement(() => getByTestId('add-set-item-2'));
          const AddSetItemButton = getByTestId('add-set-item-2');
          fireEvent.click(AddSetItemButton);

          expect(props.handleChangeNestedAttribute).toHaveBeenCalledWith(
            {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
                [],
              ],
            },
            expect.any(Object)
          );
        });
        it('should not be able to add set item when there is an empty one', async () => {
          const props = createTestProps({
            definition: {
              name: 'name',
              label: {
                en: 'label',
              },
              type: {
                name: 'set',
                elementType: {
                  typeReference: {
                    obj: {
                      name: 'typeName',
                      attributes: [],
                    },
                  },
                },
              },
            },
            attribute: {
              name: 'attributeName',
              value: [
                [{ attr: 'val-1' }],
                [{ attr: 'val-2' }],
                [{ attr: 'val-3' }],
                [],
              ],
            },
          });

          const { getByTestId, queryByTestId } = getComponentWithContext(props);
          await waitForElement(() => getByTestId('add-set-item-3'));
          const AddSetItemButton = getByTestId('add-set-item-3');
          fireEvent.click(AddSetItemButton);
          expect(queryByTestId('add-set-item-3')).toHaveProperty(
            'disabled',
            true
          );
          expect(props.handleChangeNestedAttribute).not.toHaveBeenCalled();
        });
      });
    });
  });
});
