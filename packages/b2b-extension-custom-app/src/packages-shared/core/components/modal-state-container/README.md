# Components to Maintain Modal State

- `<ModalStateContainer>` (via `render` of `children` as a render-prop)
- `withModalState(propKey?: string = 'modal')`

This module provides two form to manage modal state for a consumer component: through a Higher Order Component (HoC) or via a declarative component.

## Declarative

```js
const SomeComponent = props => (
  <ModalStateContainer
    render={({ isOpen, handleOpen, handleClose }) => (
      <React.Fragment>
        <Text.Detail>I trigger a modal</Text.Detail>

        <button onClick={handleOpen} />

        {isOpen && <ConfirmationDialog onConfirm={handleClose}>}
      </React.Fragment>
    )}
  />
);
```

## Higher Order Component

```js
const SomeComponent = props => (
  <React.Fragment>
    <Text.Detail>I trigger a modal</Text.Detail>

    <button onClick={props.modal.handleOpen} />

    {isOpen && <ConfirmationDialog onConfirm={props.modal.handleClose}>}
  </React.Fragment>
);

export default withModalState()(SomeComponent)
```
