# FormattedDateTime

The `<FormattedDateTime />` helps working with dates taking into account the locale
and the timeZone selected by the user.

This uses behind the scenes the components from `moment` and `moment-timezone` for formatting dates.
http://momentjs.com/
http://momentjs.com/timezone/

**NOTE**
This component is needed since there is no way (currently) for setting the timeZone globally to the `<IntlProvider />`.
There is an open PR for this (https://github.com/yahoo/react-intl/pull/893) but seems to be no activity or plans for having it
merged.

## Examples

```js
<FormattedDateTime value="2018-02-21T14:57:07.113Z" type="date" />
```

```js
<FormattedDateTime value="2018-02-21T14:57:07.113Z" type="time" />
```

## Migration from formatDateTime util function

formatDateTime('datetime', value);

```js
// before
formatDateTime('datetime', value);
```

```js
// now
<FormattedDateTime value={value} type="datetime" />
```

## Props

| Props   | Type     | Required | Values | Default | Description                                       |
| ------- | -------- | :------: | ------ | ------- | ------------------------------------------------- |
| `type`  | `string` |    ✅    | -      | -       | The value type to apply certain format or another |
| `value` | `string` |    ✅    | -      | -       | The date                                          |
