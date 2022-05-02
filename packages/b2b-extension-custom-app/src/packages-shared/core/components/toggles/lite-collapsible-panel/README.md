# LiteCollapsiblePanel

A "lightweight" version of the `CollapsiblePanel`. It uses `CollapsibleMotion`
for animation and open/closed state management of the panel.

## How to use it?

```jsx
<LiteCollapsiblePanel
  title={<Title />}
  headerControls={<div onClick={this.clearSelection}>{'Clear selection'}</div>}
>
  <div>{'some collapsible content'}</div>
</LiteCollapsiblePanel>
```

## Prop Types

| Property       | Type | Required? | Description                                        |
| -------------- | ---- | --------- | -------------------------------------------------- |
| title          | Node | ✔️        | Title of panel                                     |
| headerControls | Node |           | Header controls in the header section of the panel |
| children       | Node | ✔️        | Content of panel                                   |

## When to use it?

In contrast to `CollapsiblePanel` which is used for wrapping form elements it is
recommended by the design team that `LiteCollapsiblePanel` is displayed as a
**part of** or as a **section of** the form elements themselves.
