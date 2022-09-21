import log from 'electron-log';
import MenuBuilder from './window/menu';
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import { resolveHtmlPath } from './util';
import { StartFileIpcListeners } from './ipc/file-ipc';
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 *
 * Author: Yuteng Zhang
 */

/**
 * Get the current environment from the environment variable
 * Production mode or development mode
 */
const IS_DEBUG_MODE =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

/**
 * Define an updater, which can update the program during startup.
 */
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

/**
 * Export only main window. All program interface processes
 * can only be performed in this main window.
 */
export let mainWindow: BrowserWindow | null = null;

/**
 * In process production mode
 * enable codemap support and debug support
 */
if (IS_DEBUG_MODE) {
  require('electron-debug')();
} else {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

/**
 * Install devtools for electron
 * This process only happens in debug mode
 * @return {*}
 */
const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];
  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

/**
 * Create the BrowserWindow
 */
const createWindow = async () => {
  if (IS_DEBUG_MODE) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minHeight: 500,
    minWidth: 500,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // It allows open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Enable this if your app does not use auto updates
  let _enable_app_update: boolean = true;
  if (_enable_app_update) new AppUpdater();
};

/**
 * Listen to windows are all closing
 * Respect the OSX convention of having the application in memory even
 * after all windows have been closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/*
 * When application is ready
 * On macOS it's common to re-create a window in the app when the
 * dock icon is clicked and there are no other windows open.
 */
app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
      console.log('The process is startup...');
    });
    StartFileIpcListeners();
  })
  .catch(console.log);
