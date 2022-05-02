## 🚧 Missing things:

> In order to have solid component in the UI Kit, the following list will help to bring a better abstraction to this component:

- Should probably accept a configuration of action type (primary, secondary, ghost etc)
- Does not display chosen file in any way (path, thumbnail)
- Does not show whether a file was chosen or not
  does not have validation states by itself
- Does not have a design from the design team (task created https://jira.commercetools.com/browse/MC-1958)

# Inputs: File Input

## Usage

```js
import FileInput from '@commercetools-frontend/ui-kit/buttons/file-input';
```

#### Description

File selection inputs are similar to primary action buttons, but they are essentially an input used to select files (e.g to be uploaded) from the user's local machine.

#### Usage

```js
<FileInput allowMultiple={true} onChange={this.handleChange}>
  <FormattedMessage {...messages.uploadImageText} />
</FileInput>
```

#### Properties

| Props           | Type      | Required | Values | Default                          | Description                                             |
| --------------- | --------- | :------: | ------ | -------------------------------- | ------------------------------------------------------- |
| `onChange`      | `func`    |    ✅    | -      | -                                | What the button will trigger after user selects file(s) |
| `children`      | `node`    |    ✅    | -      | -                                | Renders as button's text                                |
| `acceptTypes`   | `string`  |    ✅    | -      | `image/png,image/jpeg,image/gif` | Renders as HTML `accept` property                       |
| `name`          | `string`  |    -     | -      |                                  | Used as HTML `name` property                            |
| `allowMultiple` | `boolean` |    -     | -      | `false`                          | Allows multiple files upload                            |

#### Where to use

Main Functions and use cases are:

- When uploading a file from local machine _example: variant images upload_
