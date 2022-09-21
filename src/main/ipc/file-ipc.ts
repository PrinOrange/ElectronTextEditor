import fs from 'fs';
import { ChannelsMain } from '../channels-main';
import { dialog, ipcMain } from 'electron';
import { mainWindow } from '../main';

/**
 * The listener used to register the ipc main process.
 * Note that this function can only be called when the app is ready to start and only once.
 * Otherwise, it will cause repeated listening.
 *
 * @export
 */
export function StartFileIpcListeners() {

  /**
   * Listen the action of saving the file for the first time.
   * And return the saved file path.
   */
  ipcMain.on('file:mount' as ChannelsMain, (event, code: string) => {
    dialog
      .showSaveDialog(mainWindow!, {
        title: 'Save your file',
        filters: [
          { name: 'plain-text', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      })
      .then((result) => {
        if (!result.canceled) {
          fs.writeFileSync(result.filePath!, code);
          event.reply('file:mount::reply' as ChannelsMain, result.filePath!);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /**
   * Listen the action for saving-file-as
   */
  ipcMain.on('file:save-as' as ChannelsMain, (_event, code: string) => {
    dialog
      .showSaveDialog(mainWindow!, {
        title: 'Save as ...',
        filters: [
          { name: 'plain-text', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] },
        ],
      })
      .then((result) => {
        if (!result.canceled) {
          fs.writeFileSync(result.filePath!, code);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /**
   * Listen to action for updating saved files.
   * And write the updated content to the file.
   */
  ipcMain.on('file:update' as ChannelsMain, (_event, param: any[]) => {
    fs.writeFileSync(param[0], param[1]);
  });
}