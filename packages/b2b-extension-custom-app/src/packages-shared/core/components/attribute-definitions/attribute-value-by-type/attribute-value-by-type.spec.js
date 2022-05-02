import React from 'react';
import { shallow } from 'enzyme';
import { AttributeValueByType } from './attribute-value-by-type';
import styles from './attribute-value-by-type.mod.css';

function createTestProps(props) {
  return {
    definition: {
      type: {
        name: '',
        elementType: {
          name: '',
        },
      },
    },
    language: 'EN',
    value: [],
    intl: { formatMessage: jest.fn(message => message.id) },
    ...props,
  };
}

describe('rendering', () => {
  describe('rendering an attribute type (text)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'text',
        },
      },
      value: 'leather',
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('renders 1 item container', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(1);
    });
    it('renders 1 value container', () => {
      expect(wrapper.find({ className: styles.value })).toHaveLength(1);
    });
    it('renders value text', () => {
      expect(wrapper.text()).toBe('leather');
    });
  });

  describe('rendering a (set) of attribute type (text)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'set',
          elementType: {
            name: 'text',
          },
        },
      },
      value: ['leather', 'wood'],
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('should render 2 item containers', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(2);
    });

    it('should render 2 value containers', () => {
      expect(wrapper.find({ className: styles.value })).toHaveLength(2);
    });

    it('should render value text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles.value })
          .at(0)
          .text()
      ).toBe('leather');
    });

    it('should render value text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles.value })
          .at(1)
          .text()
      ).toBe('wood');
    });
  });

  describe('rendering an attribute type (ltext)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'ltext',
        },
      },
      value: {
        en: 'leather',
        de: 'leder',
      },
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('should render 1 item container', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(1);
    });

    it('should render 2 locale containers', () => {
      expect(wrapper.find({ className: styles.locale })).toHaveLength(2);
    });

    it('should render locale text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(0)
          .text()
      ).toBe('en');
    });

    it('should render locale text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(1)
          .text()
      ).toBe('de');
    });

    it('should render 2 fields containers', () => {
      expect(wrapper.find({ className: styles.field })).toHaveLength(2);
    });

    it('should render field text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(0)
          .text()
      ).toBe('leather');
    });

    it('should render field text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(1)
          .text()
      ).toBe('leder');
    });
  });

  describe('rendering a (set) of attribute type (ltext)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'ltext',
        },
      },
      value: [
        {
          en: 'leather',
          de: 'leder',
        },
        {
          en: 'wood',
          de: 'holz',
        },
      ],
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('should render 2 item containers', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(2);
    });

    it('should render 4 locale containers', () => {
      expect(wrapper.find({ className: styles.locale })).toHaveLength(4);
    });

    it('should render locale text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(0)
          .text()
      ).toBe('en');
    });

    it('should render locale text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(1)
          .text()
      ).toBe('de');
    });

    it('should render locale text for the third item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(2)
          .text()
      ).toBe('en');
    });

    it('should render locale text for the fourth item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(3)
          .text()
      ).toBe('de');
    });

    it('should render 4 fields containers', () => {
      expect(wrapper.find({ className: styles.field })).toHaveLength(4);
    });

    it('should render field text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(0)
          .text()
      ).toBe('leather');
    });

    it('should render field text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(1)
          .text()
      ).toBe('leder');
    });

    it('should render field text for the third item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(2)
          .text()
      ).toBe('wood');
    });

    it('should render field text for the fourth item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(3)
          .text()
      ).toBe('holz');
    });
  });

  describe('rendering an attribute type (enum)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'enum',
        },
      },
      value: {
        key: 'feedstock',
        label: 'feedstock',
      },
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('renders 1 item container', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(1);
    });
    it('renders 1 value container', () => {
      expect(wrapper.find({ className: styles.value })).toHaveLength(1);
    });
    it('renders value text', () => {
      expect(wrapper.text()).toBe('feedstock');
    });
  });

  describe('rendering a (set) of attribute type (enum)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'set',
          elementType: {
            name: 'enum',
          },
        },
      },
      value: [
        {
          key: 'feedstock',
          label: 'feedstock',
        },
        {
          key: 'animal-origin',
          label: 'animal origin',
        },
      ],
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('should render 2 item containers', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(2);
    });

    it('should render 2 value containers', () => {
      expect(wrapper.find({ className: styles.value })).toHaveLength(2);
    });

    it('should render value text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles.value })
          .at(0)
          .text()
      ).toBe('feedstock');
    });

    it('should render value text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles.value })
          .at(1)
          .text()
      ).toBe('animal origin');
    });
  });

  describe('rendering an attribute type (lenum)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'lenum',
        },
      },
      value: {
        key: 'feedstock',
        label: {
          en: 'feedstock',
          de: 'ausgangsmaterial',
        },
      },
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('should render 1 item container', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(1);
    });

    it('should render 2 locale containers', () => {
      expect(wrapper.find({ className: styles.locale })).toHaveLength(2);
    });

    it('should render locale text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(0)
          .text()
      ).toBe('en');
    });

    it('should render locale text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(1)
          .text()
      ).toBe('de');
    });

    it('should render 2 fields containers', () => {
      expect(wrapper.find({ className: styles.field })).toHaveLength(2);
    });

    it('should render field text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(0)
          .text()
      ).toBe('feedstock');
    });

    it('should render field text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(1)
          .text()
      ).toBe('ausgangsmaterial');
    });
  });

  describe('rendering a (set) of attribute type (lenum)', () => {
    const props = createTestProps({
      definition: {
        type: {
          name: 'set',
          elementType: {
            name: 'lenum',
          },
        },
      },
      value: [
        {
          key: 'feedstock',
          label: {
            en: 'feedstock',
            de: 'ausgangsmaterial',
          },
        },
        {
          key: 'animal-origin',
          label: {
            en: 'animal origin',
            de: 'tierischen ursprungs',
          },
        },
      ],
    });
    const wrapper = shallow(<AttributeValueByType {...props} />);

    it('should render 2 item containers', () => {
      expect(wrapper.find({ className: styles['value-item'] })).toHaveLength(2);
    });

    it('should render 4 locale containers', () => {
      expect(wrapper.find({ className: styles.locale })).toHaveLength(4);
    });

    it('should render locale text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(0)
          .text()
      ).toBe('en');
    });

    it('should render locale text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(1)
          .text()
      ).toBe('de');
    });

    it('should render locale text for the third item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(2)
          .text()
      ).toBe('en');
    });

    it('should render locale text for the fourth item', () => {
      expect(
        wrapper
          .find({ className: styles.locale })
          .at(3)
          .text()
      ).toBe('de');
    });

    it('should render 4 fields containers', () => {
      expect(wrapper.find({ className: styles.field })).toHaveLength(4);
    });

    it('should render field text for the first item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(0)
          .text()
      ).toBe('feedstock');
    });

    it('should render field text for the second item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(1)
          .text()
      ).toBe('ausgangsmaterial');
    });

    it('should render field text for the third item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(2)
          .text()
      ).toBe('animal origin');
    });

    it('should render field text for the fourth item', () => {
      expect(
        wrapper
          .find({ className: styles['field-content'] })
          .at(3)
          .text()
      ).toBe('tierischen ursprungs');
    });
  });
});
