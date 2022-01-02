# Region Highlighter

**Region Highlighter** enhances the default region abilities of Visual Studio Code editor.

Supports quick region generation or undo using commands, and provides a rich way of colorizing regions.

> 🎉 Advantage: it support for all Visual Studio Code built-in region languages.

---

## Features

### Command: `Region Highlighter: Mark Region`

This command generates a region block of the selected text, passing in the optional name as the identifier:

![Command: Mark](https://github.com/Wiensss/vscode-region-highlighter/blob/1.0.0/assets/region_mark.gif?raw=true)

### Command: `Region Highlighter: UnMark Region`

This command undoes a region block of the selected text.

> Note that the selected text must contain start and end region comment statements

![Command:Unark](https://github.com/Wiensss/vscode-region-highlighter/blob/1.0.0/assets/region_unmark.gif?raw=true)

### Ignore Flag

Does not decorate current region when the first character outside the region marker matches the flag.

> default falg is `!`

![Ignore Flag](https://github.com/Wiensss/vscode-region-highlighter/blob/1.0.0/assets/region_ignore_flag.gif?raw=true)

### Built-in Themes

![Built-in Theme](https://github.com/Wiensss/vscode-region-highlighter/blob/1.0.0/assets/built_in_theme.png?raw=true)

---

## Extension Settings

### Language support

| **Language** | **Start region** | **End region** |
| ------------ | ---------------- | -------------- |
| Bat | `::#region` or `REM #region` | `::#endregion` or `REM #endregion` |
| C#/Coffeescript/PHP/PowerShell/TypeScript/JavaScript/Vue |`#region` | `#endregion` |
| C/C++ | `#pragma region` | `#pragma endregion` |
| CSS/Less/SCSS | `/*#region*/` | `/*#endregion*/` |
| F# | `//#region` or `(#_region)` | `//#endregion` or  (#_endregion)|
| Java | `//#region` or `//<editor-fold>` | `// #endregion` or `//</editor-fold>` |
| Markdown/HTML | `<!-- #region -->` | `<!-- #endregion -->` |
| Perl5 | `#region` or `=pod` | `#endregion` or `=cut` |
| Python | `#region` or `# region` | `#endregion` or `# endregion` |
| Visual Basic | `#Region` | `#End Region` |

### Configuration

![configuration](https://github.com/Wiensss/vscode-region-highlighter/blob/1.0.0/assets/configuration.png?raw=true)

#### `regionHighlighter.allowLanguageIDs`

IDs which this extension will work on. Identifiers have to be separated by a comma.

`*` means that all the languages. eg: `javascript,typescript`.

#### `regionHighlighter.ignoreFlag`

Does not decorate current region when the first character outside the region marker matches the flag.

#### `regionHighlighter.defaultTheme`

Default region in CSS style, eg: `pink` / `rgb(255,192,203)` / `hsl(350deg,100%,88%)` / `#FFC2CC`.

#### `regionHighlighter.defaultColor`

Default region backgroundColor theme, optional:

```javascript
[
  "Rainbow",
  "Day3024",
  "Morandi",
  "Custom Theme",
  "Default Color"
]
```

#### `regionHighlighter.customColor`

Only applies when `regionHighlighter.defaultTheme` is set to `Custom Theme`.

It support two configuration format: `Array<color>` and `Array<{label: string, color: string }>`. eg:

```javascript
[
  "#FF00001A",
  "#FF45001A",
  "#FFFF0026",
  "#0000FF0D",
  "#8000801A"
]
// or
[
  {
    label: "red",
    color: "FF00001A"
  },
  {
    label: "orange",
    color: "#FF45001A"
  },
  {
    label: "yellow",
    color: "#FFFF0026"
  },
  {
    label: "green",
    color: "#90EE9026"
  },
  {
    label: "blue",
    color: "#0000FF0D"
  },
  {
    label: "purple",
    color: "#8000801A"
  }
]
```

> the label property will be available for customizing the introverted region color in future.

#### `regionHighlighter.decorationStyle`

Default decoration region style, optional:

```javascript
[
  "border",
  "background"
]
```

#### `regionHighlighter.borderStyle`

Decorative region border style. Only applies when `regionHighlighter.decorationStyle#` is set to `border`, optional:

```javascript
[
  "solid",
  "dashed",
  "dotted",
  "double",
  "groove"
]
```

#### `regionHighlighter.borderWidth`

Decorative region border width. Only applies when `regionHighlighter.decorationStyle#` is set to `border`.

#### `regionHighlighter.extraColorStrategy`

The decoration strategy chosen when the length of region blocks in the editor exceeds the preset color length, optional:

```javascript
[
  "Default Color",
  "Custom Theme First Color",
  "Custom Theme Last Color"
]
```

---

## Release Notes

### [1.0.0] - 2022-01-02

- first release!

---

## License

[MIT](https://github.com/Wiensss/vscode-region-highlighter/blob/1.0.0/LICENSE)