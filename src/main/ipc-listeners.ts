import { dialog, ipcMain } from 'electron';
import fs from 'fs';
import { MainChannels } from './channels-main';
import { mainWindow } from './main';

/**
 * The listener used to register the icp main process.
 * Note that this function can only be called when the app is ready to start and only once.
 * Otherwise, it will cause repeated listening.
 *
 * @export
 */
export function RegistryICPListener() {
  /**
   * Listen to the channel for work test.
   */
  ipcMain.on(MainChannels.ICP_EXAMPLE, async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply(MainChannels.ICP_EXAMPLE, msgTemplate('pong'));
  });

  /**
   * Listen the action of saving the file for the first time.
   * And return the saved file path.
   */
  ipcMain.on(MainChannels.FIRST_SAVE_FILE, (event, code: string) => {
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
          event.reply(MainChannels.RETURN_SAVED_FILE_PATH, result.filePath!);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  /** 
   * Listen the action for saving-file-as
   */
  ipcMain.on(MainChannels.SAVE_AS_FILE,(_event,code:string)=>{
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
  })

  /**
   * Listen to action for updating saved files.
   * And write the updated content to the file.
   */
  ipcMain.on(MainChannels.UPDATE_SAVED_FILE, (_event, param: any[]) => {
    fs.writeFileSync(param[0], param[1]);
  });
}
