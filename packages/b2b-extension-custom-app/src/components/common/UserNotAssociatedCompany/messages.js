import { defineMessages } from 'react-intl';

export default defineMessages({
  title: {
    id: 'common.userNotAssociatedCompany.title',
    description: 'Title text for UserNotAssociatedCompany',
    defaultMessage: "Don't have any company",
  },
  paragraph1: {
    id: 'common.userNotAssociatedCompany.paragraph1',
    description: 'Paragraph text for UserNotAssociatedCompany',
    defaultMessage:
      'Your user with email {email} is not associated to any company',
  },
});
