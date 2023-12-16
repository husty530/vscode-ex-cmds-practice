import * as vscode from 'vscode';
import * as gen from './generator'

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('extension.codegen', async () => {

    const ws = vscode.workspace.workspaceFolders![0].uri.toString();
    const files = vscode.workspace.findFiles("**/*");
    const folders = files.then(uris => {
      let list: string[] = [];
      for (const uri of uris) {
        const rel =  uri.toString().replace(ws, '');
        const rel_folder = rel.replace(rel.split('/').pop()!, '');
        const abs_folder = ('${workspaceFolder}' + rel_folder + '/').replace('//', '/');
        if (!list.includes(abs_folder)) {
          list.push(abs_folder);
        }
      };
      return list;
    });
    vscode.window.showQuickPick(folders, {
      placeHolder: 'Choose folders'
    }).then(f => {
      if (f === undefined) return;
      const folder = ws + f.replace('${workspaceFolder}', '');
      vscode.window.showInputBox({
        placeHolder: 'Input class name (lower-snake case)'
      }).then(async name => {
        if (name === undefined) return;
        const h = vscode.Uri.parse(folder + name + '.h');
        const editor = new vscode.WorkspaceEdit();
        editor.createFile(h);
        editor.insert(h, new vscode.Position(0, 0), gen.get_template_h(name));
        await vscode.workspace.applyEdit(editor);
        vscode.workspace.openTextDocument(h).then(doc => {
          console.log(doc);
          vscode.window.showTextDocument(doc);
        });
      });
    });

  });

	context.subscriptions.push(disposable);
}
