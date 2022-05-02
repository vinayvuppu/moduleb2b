# Localize

The `<Localize />` helps working with a
[`LocalizedString`](https://dev.commercetools.com/http-api-types.html#localizedstring).

It respects the user's `locale` and first attempts to find the language
specified there. If not present it walks through the list of available languages
and picks the first available one (first preference is English) until falling
back to the `fallback` provided.

## Examples

```js
<Localize object={props.product} objectKey="name" />
```

```js
<Localize object={props.product} objectKey="name" fallback="No localization" />
```

## Props

| Props       | Type     | Required | Values | Default | Description                                                                |
| ----------- | -------- | :------: | ------ | ------- | -------------------------------------------------------------------------- |
| `object`    | `object` |    ✅    | -      | -       | The object which on the `objectKey` might contain a `LocalizedString`      |
| `objectKey` | `string` |    ✅    | -      | -       | The key on the `object`                                                    |
| `fallback`  | `string` |    -     | -      | -       | The fallback used whenever the `object` does not have any localized string |
