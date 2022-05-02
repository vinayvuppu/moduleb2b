const BPromise = require('bluebird');
const flatten = require('lodash.flatten');
const uuid = require('uuid/v1');
const {
  convertRestCartToQuote,
  generateFindParams,
  generateCartDraft,
  convertGraphqlActionToRestAction,
  removeDuplicateActions,
  getQuoteNumber,
  restrictActionsByState
} = require('./utils');

const expand = ['customerGroup'];
const QUOTE_COMMENTS_CONTAINER = 'quote-comments';

const makeResolvers = ({
  CartRepository,
  TaxCategoryRepository,
  CustomObjectRepository
}) => {
  const resolvers = {
    Query: {
      quote: async (_, { id }) => {
        try {
          const cart = await CartRepository.get(id, {
            expand
          });

          if (cart) {
            if (
              cart &&
              cart.custom &&
              cart.custom.fields &&
              cart.custom.fields.isQuote
            ) {
              return convertRestCartToQuote(cart);
            } else {
              throw new Error('Quote not found');
            }
          }
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      quotes: async (
        _,
        {
          quoteState,
          quoteNumber,
          employeeId,
          employeeEmail,
          companyId,
          searchTerm,
          sort,
          limit,
          offset
        }
      ) => {
        try {
          const params = generateFindParams({
            quoteState,
            employeeId,
            employeeEmail,
            companyId,
            quoteNumber,
            searchTerm,
            sort,
            limit,
            offset,
            expand
          });
          const response = await CartRepository.find(params);
          return {
            ...response,
            results: response.results.map(convertRestCartToQuote)
          };
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    },

    Mutation: {
      createQuote: async (root, { draft }) => {
        try {
          const quoteNumber = await getQuoteNumber(CustomObjectRepository);

          const cart = await CartRepository.create(
            generateCartDraft({ quoteDraft: draft, quoteNumber }),
            {
              expand
            }
          );
          return convertRestCartToQuote(cart);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      updateQuote: async (root, { id, actions }) => {
        try {
          let [oldCart, noTaxCategory] = await Promise.all([
            CartRepository.get(id, {
              expand
            }),
            TaxCategoryRepository.get(`key=no-tax`)
          ]);

          actions.forEach(action =>
            restrictActionsByState({
              updateAction: action,
              state: oldCart.custom.fields.quoteState
            })
          );

          await BPromise.map(
            actions,
            async action => {
              const restActions = flatten(
                convertGraphqlActionToRestAction(action, oldCart, noTaxCategory)
              );

              const uniqueRestActions = removeDuplicateActions(restActions);

              // eslint-disable-next-line require-atomic-updates
              oldCart = await CartRepository.update(
                id,
                oldCart.version,
                uniqueRestActions,
                {
                  expand
                }
              );
            },
            { concurrency: 1 }
          );

          return convertRestCartToQuote(oldCart);
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
      addComment: async (root, { quoteId, text, email }) => {
        try {
          const cart = await CartRepository.get(quoteId, { expand });

          const now = new Date();

          const quoteMessagesResponse = await CustomObjectRepository.find({
            where: [
              `key = "${quoteId}" and container="${QUOTE_COMMENTS_CONTAINER}"`
            ]
          });

          if (!quoteMessagesResponse.total) {
            await CustomObjectRepository.create({
              container: QUOTE_COMMENTS_CONTAINER,
              key: quoteId,
              value: [{ text, createdAt: now.toISOString(), email, id: uuid() }]
            });
          } else {
            await CustomObjectRepository.create({
              container: QUOTE_COMMENTS_CONTAINER,
              key: quoteId,
              value: [
                ...quoteMessagesResponse.results[0].value,
                { text, createdAt: now.toISOString(), email, id: uuid() }
              ]
            });
          }
          return convertRestCartToQuote(cart);
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    },
    Quote: {
      comments: async quote => {
        const quoteCommentsResponse = await CustomObjectRepository.find({
          where: [
            `key = "${quote.id}" and container="${QUOTE_COMMENTS_CONTAINER}"`
          ]
        });
        return quoteCommentsResponse.total
          ? quoteCommentsResponse.results[0].value
          : [];
      }
    }
  };
  return resolvers;
};

module.exports = {
  makeResolvers
};
