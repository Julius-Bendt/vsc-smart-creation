"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs/promises"));
function activate(context) {
    const emitter = new vscode.EventEmitter();
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
async function handleCreation(uri, isFile = true) {
    try {
        const inputType = isFile ? 'file' : 'folder';
        const name = await vscode.window.showInputBox({
            prompt: `Enter ${inputType} name`,
            validateInput: (value) => {
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
        // if ((isFile && !hasExtension) || (!isFile && hasExtension)) {
        // 	await createFileOrFolder(hasExtension, name, fullPath);
        // 	return;
        // }
        // // Else, create files as we normally would
        // await normalCreation(isFile, name, fullPath);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error creating ${isFile ? 'file' : 'folder'}: ${error}`);
    }
}
;
async function resolveTargetPath(uri) {
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
async function createFileOrFolder(hasExtension, name, fullPath) {
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
// Folder doesn't have an extension
// File does have an extension
// Create folder/file as VsC normally would
// async function normalCreation(isFile: boolean, name: string, fullPath: string) {
// 	// Normal creation
// 	if (isFile) {
// 		await fs.writeFile(fullPath, '');
// 		vscode.window.showInformationMessage(`Created file: ${name}`);
// 		const document = await vscode.workspace.openTextDocument(fullPath);
// 		await vscode.window.showTextDocument(document);
// 	} else {
// 		await fs.mkdir(fullPath);
// 		vscode.window.showInformationMessage(`Created folder: ${name}`);
// 	}
// }
function deactivate() { }
//# sourceMappingURL=extension.js.map