# vsc-smart-creation

A extension that makes files without an extension a folder, and folders with an extension a file, when using the context menu  
[file] test --> folder  
[folder] test.json --> file

## Usage

1. Right-click in the VS Code explorer (file tree)
2. Select "New File" or "New Folder"
3. Enter the name:
   - For files: Include an extension (e.g., `script.js`, `data.json`)
   - For folders: Don't include an extension (e.g., `src`, `components`)
4. The extension will automatically determine whether to create a file or folder based on the presence of an extension

## Examples

### Creating Files

- `index.html` → Creates a file
- `config.json` → Creates a file
- `styles.css` → Creates a file

### Creating Folders

- `src` → Creates a folder
- `components` → Creates a folder
- `utils` → Creates a folder

### Smart Conversion

- Using "New File" with `components` → Creates a folder
- Using "New Folder" with `config.json` → Creates a file

# Installation

## Prebuilt:

1. Press Ctrl+Shift+P (Cmd+Shift+P on Mac) to open the command palette
2. Type "Install from VSIX"
3. Select the .vsix file

## Build it yourself:

Install vsce globally (if not already installed)

```bash
npm install -g @vscode/vsce
```

Then run the build:

```bash
vsce package
```

Proceed to "Prebuilt" installation steps

## Requirements

- Visual Studio Code version 1.60.0 or higher

## Extension Settings

This extension doesn't require any additional settings. It works out of the box by overriding the default file and folder creation commands.

## Known Issues

- If another extension also tries to override the default file/folder creation commands, only the last registered handler will work

## Release Notes

### 1.0.0

Initial release of vsc-smart-creation:

- Smart file/folder creation based on extension presence
- Override of default VS Code file/folder creation commands
- Automatic file opening after creation

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests on the GitHub repository.

## License

This extension is licensed under the MIT License.

Made with :heart: in Aalborg, Denmark
