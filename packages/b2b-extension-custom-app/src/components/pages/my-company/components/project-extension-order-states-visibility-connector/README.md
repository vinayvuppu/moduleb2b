# Connectors for project extension `orderStatesVisibility`

This component exposes a connector to retrieve the `orderStatesVisibility` from the project extension setting.

Additionally it provides a HOC to inject the `orderStatesVisibilityData`.

### Usage

The children function will be called with an object with a `loading` prop and the `orderStatesVisibility` value.

```js
<ProjectExtensionOrderStatesVisibilityConnector>
  {({ loading, orderStatesVisibility }) => {
    if (loading) return <LoadingSpinner />;
    return (
      <div>{`Order states visibility: ${JSON.stringify(
        orderStatesVisibility
      )}`}</div>
    );
  }}
</ProjectExtensionOrderStatesVisibilityConnector>
```
