const { gql } = require('apollo-server');

const typeDefs = gql`
  type Employee {
    employeeNumber: String
    email: String!
    password: String!
    addresses: [Address!]!
    defaultShippingAddressId: String
    defaultBillingAddressId: String
    shippingAddressIds: [String!]!
    billingAddressIds: [String!]!
    isEmailVerified: Boolean!
    customerGroupRef: Reference
    externalId: String
    key: String
    firstName: String
    lastName: String
    middleName: String
    title: String
    locale: Locale
    salutation: String
    dateOfBirth: Date
    companyName: String
    vatId: String
    customerGroup: CustomerGroup
    defaultShippingAddress: Address
    defaultBillingAddress: Address
    shippingAddresses: [Address!]!
    billingAddresses: [Address!]!
    id: String!
    version: Long!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    createdBy: Initiator
    lastModifiedBy: Initiator
    stores: [Store!]
    roles: [String]
    amountRemaining: Money
    amountExpended: Money
  }

  type EmployeeItem {
    employeeNumber: String
    email: String!
    password: String!
    addresses: [Address!]!
    defaultShippingAddressId: String
    defaultBillingAddressId: String
    shippingAddressIds: [String!]!
    billingAddressIds: [String!]!
    isEmailVerified: Boolean!
    customerGroupRef: Reference
    externalId: String
    key: String
    firstName: String
    lastName: String
    middleName: String
    title: String
    locale: Locale
    salutation: String
    dateOfBirth: Date
    companyName: String
    vatId: String
    customerGroup: CustomerGroup
    defaultShippingAddress: Address
    defaultBillingAddress: Address
    shippingAddresses: [Address!]!
    billingAddresses: [Address!]!
    id: String!
    version: Long!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    createdBy: Initiator
    lastModifiedBy: Initiator
    stores: [Store!]
    roles: [String]
    amountExpended: Money
  }

  type Money {
    type: String!
    currencyCode: Currency!
    centAmount: Long!
    fractionDigits: Int!
  }

  type Store {
    id: String!
    version: Long!
    key: String!
    name(locale: Locale, acceptLanguage: [Locale!]): String
    nameAllLocales: [LocalizedString!]
    languages: [Locale!]
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    createdBy: Initiator
    lastModifiedBy: Initiator
  }

  type CustomField {
    name: String!
  }

  type FieldType {
    name: String!
  }

  type Address {
    id: String
    title: String
    salutation: String
    firstName: String
    lastName: String
    streetName: String
    streetNumber: String
    additionalStreetInfo: String
    postalCode: String
    city: String
    region: String
    state: String
    country: Country!
    company: String
    department: String
    building: String
    apartment: String
    pOBox: String
    phone: String
    mobile: String
    email: String
    fax: String
    additionalAddressInfo: String
    externalId: String
    key: String
  }
  scalar Locale
  scalar Date
  scalar DateTime
  scalar Long
  scalar Country
  scalar Json
  scalar Currency

  type Reference {
    typeId: String!
    id: String!
  }

  type CustomerGroup {
    id: String!
    version: Long!
    name: String!
    key: String
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    custom: CustomFieldsType
    createdBy: Initiator
    lastModifiedBy: Initiator
  }

  type CustomFieldsType {
    typeRef: Reference!
    type: TypeDefinition
    customFieldsRaw(
      includeNames: [String!]
      excludeNames: [String!]
    ): [RawCustomField!]
    customFields: Type!
  }

  type TypeDefinition {
    key: String!
    name(locale: Locale, acceptLanguage: [Locale!]): String
    description(locale: Locale, acceptLanguage: [Locale!]): String
    nameAllLocales: [LocalizedString!]!
    descriptionAllLocales: [LocalizedString!]
    resourceTypeIds: [String!]!
    fieldDefinitions(
      includeNames: [String!]
      excludeNames: [String!]
    ): [FieldDefinition!]!
    id: String!
    version: Long!
    createdAt: DateTime!
    lastModifiedAt: DateTime!
    createdBy: Initiator
    lastModifiedBy: Initiator
  }

  type LocalizedString {
    locale: Locale!
    value: String!
  }

  type Type {
    typeRef: Reference!
    type: TypeDefinition
  }

  type RawCustomField {
    name: String!
    value: Json!
  }

  type FieldDefinition {
    name: String!
    required: Boolean!
    label(locale: Locale, acceptLanguage: [Locale!]): String
    labelAllLocales: [LocalizedString!]!
    type: FieldType!
  }

  type Initiator {
    isPlatformClient: Boolean
    user: Reference
    externalUserId: String
    customer: Reference
    anonymousId: String
    clientId: String
  }

  type EmployeeQueryResult {
    offset: Int!
    count: Int!
    total: Long!
    results: [EmployeeItem!]!
  }

  type Query {
    employee(id: String!): Employee
    employees(
      where: String
      sort: [String!]
      limit: Int
      offset: Int
    ): EmployeeQueryResult!
  }

  input SetEmployeeFirstName {
    firstName: String
  }

  input SetEmployeeLastName {
    lastName: String
  }

  input SetEmployeeRoles {
    roles: [String]
  }

  input AddEmployeeAddress {
    address: AddressInput!
  }

  input AddressInput {
    id: String
    title: String
    salutation: String
    firstName: String
    lastName: String
    streetName: String
    streetNumber: String
    additionalStreetInfo: String
    postalCode: String
    city: String
    region: String
    state: String
    country: Country!
    company: String
    department: String
    building: String
    apartment: String
    pOBox: String
    phone: String
    mobile: String
    email: String
    fax: String
    additionalAddressInfo: String
    externalId: String
    key: String
  }

  input AddEmployeeBillingAddressId {
    addressId: String!
  }

  input AddEmployeeShippingAddressId {
    addressId: String!
  }

  input AddEmployeeStore {
    store: ResourceIdentifierInput!
  }

  input RemoveEmployeeStore {
    store: ResourceIdentifierInput!
  }

  input ResourceIdentifierInput {
    typeId: String
    id: String
    key: String
  }

  input ChangeEmployeeAddress {
    addressId: String!
    address: AddressInput!
  }
  input ChangeEmployeeEmail {
    email: String!
  }

  input RemoveEmployeeAddress {
    addressId: String!
  }
  input RemoveEmployeeBillingAddressId {
    addressId: String!
  }
  input RemoveEmployeeShippingAddressId {
    addressId: String!
  }
  input SetEmployeeDefaultBillingAddress {
    addressId: String!
  }
  input SetEmployeeDefaultShippingAddress {
    addressId: String!
  }
  input SetCustomerGroup {
    customerGroup: ResourceIdentifierInput
  }
  input SetEmployeeKey {
    key: String!
  }
  input SetEmployeeLocale {
    locale: Locale
  }
  input SetEmployeeNumber {
    employeeNumber: String
  }
  input SetEmployeeDateOfBirth {
    dateOfBirth: Date
  }
  input SetEmployeeExternalId {
    externalId: String
  }
  input SetEmployeeMiddleName {
    middleName: String
  }
  input SetEmployeeSalutation {
    salutation: String
  }
  input SetEmployeeTitle {
    title: String
  }
  input SetEmployeeVatId {
    vatId: String
  }

  input EmployeeUpdateAction {
    addAddress: AddEmployeeAddress
    addBillingAddressId: AddEmployeeBillingAddressId
    addShippingAddressId: AddEmployeeShippingAddressId
    addStore: AddEmployeeStore
    removeStore: RemoveEmployeeStore
    changeAddress: ChangeEmployeeAddress
    changeEmail: ChangeEmployeeEmail
    removeAddress: RemoveEmployeeAddress
    removeBillingAddressId: RemoveEmployeeBillingAddressId
    removeShippingAddressId: RemoveEmployeeShippingAddressId
    setFirstName: SetEmployeeFirstName
    setLastName: SetEmployeeLastName
    setRoles: SetEmployeeRoles
    setCustomerGroup: SetCustomerGroup
    setKey: SetEmployeeKey
    setLocale: SetEmployeeLocale
    setEmployeeNumber: SetEmployeeNumber
    setDateOfBirth: SetEmployeeDateOfBirth
    setDefaultBillingAddress: SetEmployeeDefaultBillingAddress
    setDefaultShippingAddress: SetEmployeeDefaultShippingAddress
    setExternalId: SetEmployeeExternalId
    setMiddleName: SetEmployeeMiddleName
    setSalutation: SetEmployeeSalutation
    setTitle: SetEmployeeTitle
    setVatId: SetEmployeeVatId
  }

  type EmployeeSignInResult {
    employee: Employee!
  }

  input EmployeeSignUpDraft {
    email: String!
    password: String!
    firstName: String
    lastName: String
    middleName: String
    title: String
    dateOfBirth: Date
    vatId: String
    addresses: [AddressInput!]
    defaultBillingAddress: Int
    defaultShippingAddress: Int
    shippingAddresses: [Int!]
    billingAddresses: [Int!]
    locale: Locale
    salutation: String
    key: String
    stores: [ResourceIdentifierInput!]
    employeeNumber: String
    externalId: String
    customerGroup: ResourceIdentifierInput
    isEmailVerified: Boolean
    anonymousId: String
    roles: [String]!
  }

  type Mutation {
    updateEmployee(
      version: Long!
      actions: [EmployeeUpdateAction!]!
      storeKey: KeyReferenceInput
      id: String
      key: String
    ): Employee

    employeeSignUp(draft: EmployeeSignUpDraft!): EmployeeSignInResult!

    deleteEmployee(
      version: Long!
      personalDataErasure: Boolean = false
      storeKey: KeyReferenceInput
      id: String
      key: String
    ): Employee

    employeeResetPassword(
      version: Long
      tokenValue: String!
      newPassword: String!
      storeKey: KeyReferenceInput
    ): Employee

    employeesResetAmountExpent(companyId: String!): [EmployeeItem!]!
    employeeResetAmountExpent(id: String!): Employee!
  }

  scalar KeyReferenceInput
`;
module.exports = {
  typeDefs
};
