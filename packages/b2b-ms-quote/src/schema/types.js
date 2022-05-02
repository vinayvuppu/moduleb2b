const { gql } = require('apollo-server');

const typeDefs = gql`
  type Company {
    id: String!
    name: String!
  }

  type Quote {
    id: String!
    version: Long!
    employeeId: String
    employeeEmail: String
    quoteState: String
    quoteNumber: String
    lineItems: [LineItem!]!
    totalPrice: Money!
    originalTotalPrice: Money
    percentageDiscount: Float
    amountDiscount: Money
    taxedPrice: TaxedPrice
    customerGroup: KeyReference
    company: Company!
    comments: [Comment]!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    createdBy: Initiator
    lastModifiedBy: Initiator
  }

  type LineItem {
    id: String!
    productId: String!
    nameAllLocales: [LocalizedString!]!
    variant: ProductVariant
    price: ProductPrice!
    originalPrice: Money
    taxedPrice: TaxedItemPrice
    totalPrice: Money
    quantity: Long!
    taxRate: TaxRate!
  }

  type ProductVariant {
    id: Int!
    key: String
    sku: String
    prices: [ProductPrice!]
    price: ProductPrice
    images: [Image!]!
  }

  type TaxRate {
    name: String!
    amount: Float!
    includedInPrice: Boolean!
    country: Country!
    state: String
    id: String
    subRates: [SubRate!]!
  }

  type SubRate {
    name: String!
    amount: Float!
  }

  type ProductPrice {
    id: String
    value: BaseMoney!
    validFrom: DateTime
    validUntil: DateTime
  }

  type LocalizedString {
    locale: Locale!
    value: String!
  }

  type Image {
    url: String!
    dimensions: Dimensions!
    label: String
  }

  type Dimensions {
    width: Int!
    height: Int!
  }

  type BaseMoney {
    type: String!
    currencyCode: Currency!
    centAmount: Long!
    fractionDigits: Int!
  }

  type Money {
    type: String!
    currencyCode: Currency!
    centAmount: Long!
    fractionDigits: Int!
  }

  type TaxedItemPrice {
    totalNet: Money!
    totalGross: Money!
  }

  type TaxedPrice {
    totalNet: Money!
    totalGross: Money!
    taxPortions: [TaxPortion!]!
  }

  type TaxPortion {
    rate: Float!
    amount: Money!
    name: String
  }

  type Reference {
    typeId: String!
    id: String!
  }

  type KeyReference {
    typeId: String!
    key: String!
  }

  type Initiator {
    isPlatformClient: Boolean
    user: Reference
    externalUserId: String
    customer: Reference
    anonymousId: String
    clientId: String
  }

  scalar Long
  scalar Currency
  scalar Country
  scalar DateTime
  scalar Locale

  type QuoteQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [Quote!]!
  }

  type Comment {
    id: String!
    text: String!
    email: String!
    createdAt: DateTime!
  }

  input LineItemDraft {
    productId: String
    sku: String
    quantity: Long
    variantId: Int
  }

  input CreateQuoteDraft {
    currency: Currency!
    employeeId: String!
    employeeEmail: String
    companyId: String!
    lineItems: [LineItemDraft!]
  }

  input AddQuoteLineItem {
    variantId: Int
    quantity: Long
    sku: String
    productId: String
  }

  input MoneyInput {
    currencyCode: Currency!
    centAmount: Long!
  }
  input HighPrecisionMoneyInput {
    currencyCode: Currency!
    preciseAmount: Long!
    fractionDigits: Int!
    centAmount: Long
  }

  input BaseMoneyInput {
    centPrecision: MoneyInput
    highPrecision: HighPrecisionMoneyInput
  }

  input ExternalLineItemTotalPriceDraft {
    price: BaseMoneyInput!
    totalPrice: MoneyInput!
  }

  input ChangeQuoteLineItemQuantity {
    lineItemId: String!
    quantity: Long!
    externalPrice: BaseMoneyInput
    externalTotalPrice: ExternalLineItemTotalPriceDraft
  }

  input RemoveQuoteLineItem {
    lineItemId: String!
    quantity: Long
  }

  input SetQuoteLineItemPrice {
    lineItemId: String!
    externalPrice: BaseMoneyInput
  }

  input SetQuoteLineItemTotalPrice {
    lineItemId: String!
    externalTotalPrice: ExternalLineItemTotalPriceDraft
  }

  input SetQuoteAmountDiscount {
    amountDiscount: MoneyInput!
  }

  input SetQuotePercentageDiscount {
    percentage: Float!
  }

  input ChangeQuoteState {
    state: String!
  }

  input QuoteUpdateAction {
    addLineItem: AddQuoteLineItem
    changeLineItemQuantity: ChangeQuoteLineItemQuantity
    removeLineItem: RemoveQuoteLineItem
    setLineItemPrice: SetQuoteLineItemPrice
    setLineItemTotalPrice: SetQuoteLineItemTotalPrice
    setAmountDiscount: SetQuoteAmountDiscount
    setPercentageDiscount: SetQuotePercentageDiscount
    changeState: ChangeQuoteState
  }

  type Query {
    quote(id: String!): Quote
    quotes(
      quoteState: [String!]
      employeeId: String
      employeeEmail: String
      companyId: String
      quoteNumber: String
      searchTerm: String
      sort: [String!]
      limit: Int
      offset: Int
    ): QuoteQueryResult!
  }

  type Mutation {
    createQuote(draft: CreateQuoteDraft!): Quote
    updateQuote(
      id: String!
      version: Long!
      actions: [QuoteUpdateAction!]!
    ): Quote
    addComment(quoteId: String!, text: String!, email: String!): Quote
  }
`;
module.exports = {
  typeDefs
};
