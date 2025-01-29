import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs/promises';

export function activate(context: vscode.ExtensionContext) {
	const emitter = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
	let fileHandler = vscode.workspace.registerFileSystemProvider('smartcreate', {
		onDidChangeFile: emitter.event,
		watch: () => ({ dispose: () => { } }),
		stat: () => ({ type: vscode.FileType.File, ctime: Date.now(), mtime: Date.now(), size: 0 }),
		readDirectory: () => [],
		createDirectory: () => { },
		readFile: () => new Uint8Array(),
		writeFile: () => { },
		delete: () => { },
		rename: () => { },
	}, { isCaseSensitive: true });


	// Override the default New File and New Folder commands
	let createFileCommand = vscode.commands.registerCommand('explorer.newFile', (uri) => handleCreation(uri, true));
	let createFolderCommand = vscode.commands.registerCommand('explorer.newFolder', (uri) => handleCreation(uri, false));

	context.subscriptions.push(fileHandler, createFileCommand, createFolderCommand);
}


// Handler for creating new files/folders
async function handleCreation(uri: vscode.Uri, isFile: boolean = true) {
	try {
		const inputType = isFile ? 'file' : 'folder';
		const name = await vscode.window.showInputBox({
			prompt: `Enter ${inputType} name`,
			validateInput: (value: string) => {
				return value.trim().length === 0 ? `${inputType} name cannot be empty` : null;
			}
		});

		if (!name) {
			return; // User canceled
		}

		const targetPath = await resolveTargetPath(uri);
		const fullPath = path.join(targetPath, name);

		const hasExtension = name.includes('.');

		await createFileOrFolder(hasExtension, name, fullPath);
	} catch (error) {
		vscode.window.showErrorMessage(`Error creating ${isFile ? 'file' : 'folder'}: ${error}`);
	}
};

async function resolveTargetPath(uri: vscode.Uri): Promise<string> {

	if (uri.scheme !== 'file') {
		vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ''; // If folder
	}

	// If uri is a file, use its parent directory
	const stat = await vscode.workspace.fs.stat(uri);
	if (stat.type === vscode.FileType.File) {
		return path.dirname(uri.fsPath);
	}

	return uri.fsPath;
}

// Folder does have an extension
// File doesn't have an extension
// Create folder/file as the opposite 
async function createFileOrFolder(hasExtension: boolean, name: string, fullPath: string) {
	// Switch creation type
	if (hasExtension) {
		// Create file instead of folder
		await fs.writeFile(fullPath, '');
		vscode.window.showInformationMessage(`Created file: ${name}`);
		const document = await vscode.workspace.openTextDocument(fullPath);
		await vscode.window.showTextDocument(document);
		return;

	}

	// Create folder instead of file
	await fs.mkdir(fullPath);
	vscode.window.showInformationMessage(`Created folder: ${name}`);
}


export function deactivate() { }