import React from 'react';
import { shallow } from 'enzyme';
import invariant from 'tiny-invariant';
import {
  CustomFieldDefinitionsConnector,
  mapDataToProps,
} from './custom-field-definitions-connector';

jest.mock('tiny-invariant');

const createTestProps = custom => ({
  children: jest.fn(() => <div className="child" />),
  resources: ['customer'],
  locale: 'en',
  match: {
    params: {
      projectKey: 'test-project-1',
    },
  },
  isDisabled: false,
  fetchTypeDefinitionsQuery: {
    loading: false,
    customFieldDefinitions: [
      {
        name: 'Boolean',
        label: { en: 'Boolean' },
        type: {
          name: 'Boolean',
        },
      },
      {
        name: 'String',
        label: { en: 'String' },
        type: {
          name: 'String',
        },
      },
    ],
  },
  ...custom,
});

describe('render', () => {
  let props;
  let wrapper;
  beforeEach(() => {
    props = createTestProps();
    wrapper = shallow(<CustomFieldDefinitionsConnector {...props} />);
  });
  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
  it('should call `children`', () => {
    expect(props.children).toHaveBeenCalledTimes(1);
  });
  it('should call `children` with `customFieldDefinitionsFetcher`', () => {
    expect(props.children).toHaveBeenCalledWith(
      expect.objectContaining({
        customFieldDefinitionsFetcher: {
          isLoading: props.fetchTypeDefinitionsQuery.loading,
          customFieldDefinitions:
            props.fetchTypeDefinitionsQuery.customFieldDefinitions,
        },
      })
    );
  });
});

describe('mapDataToProps', () => {
  describe('when no types ready', () => {
    it('should return the data object', () => {
      expect(
        mapDataToProps({
          fetchTypeDefinitionsQuery: { loading: true },
          locale: 'en',
        })
      ).toEqual({
        fetchTypeDefinitionsQuery: { loading: true },
      });
    });
  });
  describe('when types are ready', () => {
    it('should return the custom fields definitions object', () => {
      expect(
        mapDataToProps({
          locale: 'en',
          fetchTypeDefinitionsQuery: {
            loading: false,
            typeDefinitions: {
              results: [
                {
                  fieldDefinitions: [
                    {
                      labelAllLocales: [
                        { value: 'definition-1-label-en', locale: 'en' },
                        { value: 'definition-1-label-de', locale: 'de' },
                      ],
                      name: 'definition-1-name',
                      type: { name: 'Boolean' },
                    },
                    {
                      labelAllLocales: [
                        { value: 'definition-2-label-en', locale: 'en' },
                        { value: 'definition-2-label-de', locale: 'de' },
                      ],
                      name: 'definition-2-name',
                      type: { name: 'Number' },
                    },
                  ],
                },
                {
                  fieldDefinitions: [
                    {
                      labelAllLocales: [
                        { value: 'definition-3-label-en', locale: 'en' },
                        { value: 'definition-3-label-de', locale: 'de' },
                      ],
                      name: 'definition-3-name',
                      type: { name: 'Set-String' },
                    },
                    {
                      labelAllLocales: [
                        { value: 'definition-4-label-en', locale: 'en' },
                        { value: 'definition-4-label-de', locale: 'de' },
                      ],
                      name: 'definition-4-name',
                      type: { name: 'LocalizedString' },
                    },
                  ],
                },
              ],
            },
          },
        })
      ).toEqual({
        fetchTypeDefinitionsQuery: {
          loading: false,
          customFieldDefinitions: [
            {
              name: 'definition-1-name',
              label: {
                en: 'definition-1-label-en',
                de: 'definition-1-label-de',
              },
              type: { name: 'Boolean' },
            },
            {
              name: 'definition-2-name',
              label: {
                en: 'definition-2-label-en',
                de: 'definition-2-label-de',
              },
              type: { name: 'Number' },
            },
            {
              name: 'definition-3-name',
              label: {
                en: 'definition-3-label-en',
                de: 'definition-3-label-de',
              },
              type: { name: 'Set-String' },
            },
            {
              name: 'definition-4-name',
              label: {
                en: 'definition-4-label-en',
                de: 'definition-4-label-de',
              },
              type: { name: 'LocalizedString' },
            },
          ],
        },
      });
    });
  });
  describe('when repeated field definitions', () => {
    it('should return an array with no repeated definitions', () => {
      expect(
        mapDataToProps({
          locale: 'en',
          fetchTypeDefinitionsQuery: {
            loading: false,
            typeDefinitions: {
              results: [
                {
                  fieldDefinitions: [
                    {
                      labelAllLocales: [
                        { value: 'definition-1-label-en', locale: 'en' },
                        { value: 'definition-1-label-de', locale: 'de' },
                      ],
                      name: 'definition-1-name',
                      type: { name: 'Boolean' },
                    },
                    {
                      labelAllLocales: [
                        { value: 'definition-2-label-en', locale: 'en' },
                        { value: 'definition-2-label-de', locale: 'de' },
                      ],
                      name: 'definition-2-name',
                      type: { name: 'String' },
                    },
                  ],
                },
                {
                  fieldDefinitions: [
                    {
                      labelAllLocales: [
                        { value: 'definition-1-label-en', locale: 'en' },
                        { value: 'definition-1-label-de', locale: 'de' },
                      ],
                      name: 'definition-1-name',
                      type: { name: 'Boolean' },
                    },
                    {
                      labelAllLocales: [
                        { value: 'definition-3-label-en', locale: 'en' },
                        { value: 'definition-3-label-de', locale: 'de' },
                      ],
                      name: 'definition-3-name',
                      type: { name: 'LocalizedString' },
                    },
                  ],
                },
              ],
            },
          },
        })
      ).toEqual({
        fetchTypeDefinitionsQuery: {
          loading: false,
          customFieldDefinitions: [
            {
              name: 'definition-1-name',
              label: {
                en: 'definition-1-label-en',
                de: 'definition-1-label-de',
              },
              type: { name: 'Boolean' },
            },
            {
              name: 'definition-2-name',
              label: {
                en: 'definition-2-label-en',
                de: 'definition-2-label-de',
              },
              type: { name: 'String' },
            },
            {
              name: 'definition-3-name',
              label: {
                en: 'definition-3-label-en',
                de: 'definition-3-label-de',
              },
              type: { name: 'LocalizedString' },
            },
          ],
        },
      });
    });
  });
});

describe('lifecycle', () => {
  let props;
  let wrapper;
  describe('componentDidMount', () => {
    describe('when all the resource are not valid', () => {
      beforeEach(() => {
        props = createTestProps({ resources: ['Foo', 'Bar'] });
        wrapper = shallow(<CustomFieldDefinitionsConnector {...props} />);
        wrapper.instance().componentDidMount();
      });
      it('should invoke `invariant`', () => {
        expect(invariant).toHaveBeenCalled();
      });
    });
    describe('when some of the resource are not valid', () => {
      beforeEach(() => {
        props = createTestProps({ resources: ['customer', 'Bar'] });
        wrapper = shallow(<CustomFieldDefinitionsConnector {...props} />);
        wrapper.instance().componentDidMount();
      });
      it('should invoke `invariant`', () => {
        expect(invariant).toHaveBeenCalled();
      });
    });
  });
});
