# ValidationError.Switch & ValidationError.Match

## Usage

```js
import ValidationError from '@commercetools-local/core/components/validation-error';
```

#### Description

The `ValidationError` module comes with two components sublementing one another. The `<ValidationError.Switch>` is meant to pass in `errors` and `touched` from e.g. a validated form. The `<ValidationError.Match>` a `rule`. Allowing selective rendering of children in case an error occured.

#### Usage

The `validate` passed to e.g. `<Formik validate={validate} />` should return an object with the shape of

```js
{ [ field: string] : { [rule: string]: boolean }}
```

with this structure a validation could yield

```js
const errors = {
  firstName: {
    required: false,
    max: true
  }
  lastName: {
    required: true,
  }
}
```

this validation indicates the following:

1.  `firstName` _is not_ missing (`required` is `false`)
2.  `firstName` _has_ too many characters (`max` is `true`)
3.  `lastName` _is_ missing (`required` is `true`)

This indicates that `errors` contains the rule violations per field and not the validation requirements. Given this structure `<ValidationError.Switch />` and `<ValidationError.Match />` operate on it:

```js
<ValidationError.Switch errors={errors.firstName} isTouched={touched.firstName}>
  <ValidationError.Match rule="required">
    <FormattedMessage {...messages.firstNameMissing} />
  </ValidationError.Match>
  <ValidationError.Match rule="max" component={MySpecialErrorComponent} />>
</ValidationError.Switch>

<ValidationError.Switch errors={errors.lastName} isTouched={touched.lastName}>
  <ValidationError.Match rule="required">
    <FormattedMessage {...messages.lastNameTooShort} />
  </ValidationError.Match>
</ValidationError.Switch>
```

#### Properties

#### `<ValidationError.Switch>`

| Props       | Type     | Required | Values                              | Default | Description                                    |
| ----------- | -------- | :------: | ----------------------------------- | ------- | ---------------------------------------------- |
| `errors`    | `object` |    ✅    | Nested object or errors per field   | -       | Indicates which fields have validation errors. |
| `isTouched` | `bool`   |    ✅    | Boolean if field is touched         | -       | Errors only show for touched fields            |
| `children`  | `node`   |    ✅    | only of `<ValidationError.Match />` | -       | `<ValidationError.Match />`s to match a `rule` |

#### `<ValidationError.Match>`

> NOTE: Rendering children supports a variaty of options with FaaC, render-prop or component.

| Props       | Type     | Required | Values                           | Default | Description                                           |
| ----------- | -------- | :------: | -------------------------------- | ------- | ----------------------------------------------------- |
| `rule`      | `string` |    ✅    | Any rule of errors for the field | -       | Targets a `rule` of the `errors` (e.g. `required`)    |
| `children`  | `Node`   |    ✅    | `Node` (e.g. `FormattedMessage`) | -       | Node in case of error.                                |
| `component` | `func`   |    ✅    | Component to be rendered         | -       | Component rendered (`createElement`) in case of error |

#### Where to use

Main Functions and use cases are:

- Form validation

#### Future Feature Ideas

- Use a `maxErrors` on `<ValidationError.Switch />` to only show the first `n` errors rendered by `<ValidationError.Match />`
- Have an implicit catch all `Match` which reports to Sentry in case an `error` for a field is not visualized to the user by `<ValidationError.Match />`
