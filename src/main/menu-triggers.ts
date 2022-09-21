import fs from 'fs';
import { BrowserWindow, dialog } from 'electron';
import { menuState } from './menu';
import { ChannelsMain } from './channels-main';
/**
 * menu-trigger.ts
 * Here is used to define the window menu trigger.
 * Mainly for the processing of click events
 *
 * Author: Yuteng Zhang
 */

/**
 * Open file action triggered by menu.
 * @param window Allows the dialog to attach itself to a parent window, making it modal.
 */
export const menuTriggeredOpenFile = (window: BrowserWindow) => {
  dialog
    .showOpenDialog(window, {
      title: 'Open File',
      filters: [{ name: 'All Files', extensions: ['*'] }],
    })
    .then((data) => {
      fs.readFile(data.filePaths[0], 'utf-8', (_err, content) => {
        window.webContents.send('file:load-wr' as ChannelsMain, {
          content: content,
          filepath: data.filePaths[0],
        });
      });
    })
    .catch((err) => {
      dialog.showMessageBox(window, {
        title: 'Failed to Open File',
        message: err.message,
      });
    });
};

/**
 * New file action triggered by menu.
 * @param window Allows the dialog to attach itself to a parent window, making it modal.
 */
export const menuTriggeredNewFile = (_window: BrowserWindow) => {};

/**
 * Save file action triggered by menu.
 * @param window Allows the dialog to attach itself to a parent window, making it modal.
 */
export const menuTriggeredSaveFile = (window: BrowserWindow) => {
  window.webContents.send('file:mount' as ChannelsMain);
};

/**
 * Save as file action triggered by menu.
 * @param window Allows the dialog to attach itself to a parent window, making it modal.
 */
export const menuTriggeredSaveAsFile = (window: BrowserWindow) => {
  window.webContents.send('file:save-as' as ChannelsMain);
};

/**
 * Set codemap action triggered by menu.
 * @param window Allows the dialog to attach itself to a parent window, making it modal.
 */
export const menuTriggeredSetCodemap = (window: BrowserWindow) => {
  menuState.checkedCodeMap = !menuState.checkedCodeMap;
  window.webContents.send(
    'codemap:set' as ChannelsMain,
    menuState.checkedCodeMap
  );
};
