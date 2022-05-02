import React from 'react';
import PropTypes from 'prop-types';
import { Card, Spacings, Text } from '@commercetools-frontend/ui-kit';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { DOMAINS } from '@commercetools-frontend/constants';
import { useIntl } from 'react-intl';
import messages from './messages';
import QuoteDetailsAddCommentForm from '../quote-details-add-comment-form';
import styles from './quote-details-comments-tab.mod.css';

const QuoteDetailsCommentsTab = ({ quote, addComment, employeeEmail }) => {
  const {
    user: { email },
  } = useApplicationContext();
  const { formatDate, formatTime, formatMessage } = useIntl();
  const addCommentSuccessNotification = useShowNotification({
    kind: 'success',
    domain: DOMAINS.SIDE,
    text: formatMessage(messages.addCommentSuccessNotification),
  });
  const addCommentErrorNotification = useShowNotification({
    kind: 'error',
    domain: DOMAINS.SIDE,
    text: formatMessage(messages.addCommentErrorNotification),
  });

  const handleAddComment = async ({ text }) => {
    try {
      await addComment({ text, email: employeeEmail || email });
      addCommentSuccessNotification();
    } catch (e) {
      addCommentErrorNotification();
    }
  };

  return (
    <Spacings.Stack>
      <QuoteDetailsAddCommentForm onSubmit={handleAddComment} />
      {quote.comments.map(comment => (
        <Card key={comment.id}>
          <Spacings.Stack>
            <Text.Subheadline as="h4">
              {comment.email} - {formatDate(comment.createdAt)}{' '}
              {formatTime(comment.createdAt)}
            </Text.Subheadline>
            <Text.Body>
              <span className={styles['pre-wrap']}>{comment.text}</span>
            </Text.Body>
          </Spacings.Stack>
        </Card>
      ))}
    </Spacings.Stack>
  );
};

QuoteDetailsCommentsTab.propTypes = {
  quote: PropTypes.shape({
    comments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      })
    ).isRequired,
  }),
  addComment: PropTypes.func.isRequired,
  employeeEmail: PropTypes.string,
};

QuoteDetailsCommentsTab.displayName = 'QuoteDetailsCommentsTab';

export default QuoteDetailsCommentsTab;
