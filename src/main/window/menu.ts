import {
  app,
  BrowserWindow,
  dialog,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from 'electron';
import { WindowMenuTrigger } from './menu-triggers';

/**
 * This module is used to build the window menu based on the provided menu template.
 * And provides the status of the window menu, so it reflects to browser window view.
 * But the trigger event of the menu is separated into the file menu-trigger.ts
 */

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

interface MenuState {
  enableSave: boolean;
  checkedCodeMap: boolean;
}

/**
 * Get the current environment from the environment variable
 * Production mode or development mode
 */
const IS_DEBUG_MODE =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

/**
 * Used to store the state of the menu.
 * Such as selected menu, available menu items, etc.
 */
export const menuState: MenuState = {
  checkedCodeMap: true,
  enableSave: true,
};

/**
 * MenuBuilder for electron BrowserWindow.
 * Assign the specified menu template.
 */
export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  /**
   * Build browserWindow menu according to environment
   * @return {Menu} The menu for browserWindow.
   * @memberof MenuBuilder
   */
  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  /**
   * Add the 'Inspect Element' menu to the BrowserWindow.
   * Only works in development mode.
   * @memberof MenuBuilder
   */
  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  /**
   * Create the darwin platform menu template in array.
   * Apply to OSX system.
   * @return {MenuItemConstructorOptions[]}
   * @memberof MenuBuilder
   */
  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme'
            );
          },
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  /**
   * Create the default menu template in array.
   * Apply to Windows, Linux GUI.
   * @returns The array for menu template.
   * @memberof MenuBuilder
   */
  buildDefaultTemplate(): MenuItemConstructorOptions[] {
    const FileMenu: MenuItemConstructorOptions = {
      label: '&File',
      submenu: [
        {
          label: '&Open Project',
          accelerator: 'Ctrl+O',
          click: () => {
            WindowMenuTrigger.openFile(this.mainWindow);
          },
        },
        {
          label: '&New Project',
          accelerator: 'Ctrl+N',
        },
        {
          type: 'separator',
        },
        {
          label: 'Save Project',
          accelerator: 'Ctrl+S',
          click: () => {
            WindowMenuTrigger.saveFile(this.mainWindow);
          },
        },
        {
          label: 'Save As',
          accelerator: 'Ctrl+Shift+S',
        },
        {
          type: 'separator',
        },
        {
          label: '&Close',
          accelerator: 'Ctrl+Q',
          click: () => {
            this.mainWindow.close();
          },
        },
      ],
    };

    const EditMenu: MenuItemConstructorOptions = {
      label: '&Edit',
      submenu: [
        {
          label: '&Undo',
          accelerator: 'Ctrl+O',
        },
        {
          label: '&Redo',
          accelerator: 'Ctrl+O',
        },
        {
          type: 'separator',
        },
        {
          label: '&Copy',
          accelerator: 'Ctrl+C',
        },
        {
          label: '&Cut',
          accelerator: 'Ctrl+T',
        },
        {
          label: '&Paste',
          accelerator: 'Ctrl+V',
        },
        {
          type: 'separator',
        },
        {
          label: '&Find in File',
          accelerator: 'Ctrl+Shift+F',
        },
        {
          label: '&Replace in File',
          accelerator: 'Ctrl+Shift+R',
        },
        {
          type: 'separator',
        },
        {
          label: '&Auto wrap',
          type: 'checkbox',
          accelerator: 'Ctrl+Shift+W',
        },
        {
          type: 'separator',
        },
        {
          label: '&Turn to Comment',
          accelerator: 'Ctrl+/',
        },
      ],
    };

    const ViewMenu: MenuItemConstructorOptions = {
      label: '&View',
      submenu: [
        {
          label: '&Code Map',
          accelerator: 'Ctrl+R',
          type: 'checkbox',
          checked: menuState.checkedCodeMap,
          click: () => {
            WindowMenuTrigger.setCodemap(this.mainWindow);
          },
        },
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };

    const HelpMenu: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click() {
            const message = `A cross-platform text editor based on React + Electron + MonacoEditor Example`;
            dialog.showMessageBox({
              title: 'About',
              message: message,
              buttons: ['Close'],
              type: 'info',
            });
          },
        },
      ],
    };

    const _DevMenu: MenuItemConstructorOptions = {
      label: '&_Development',
      submenu: [
        {
          label: '&Reload',
          accelerator: 'Ctrl+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle &Developer Tools',
          accelerator: 'Alt+Ctrl+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };

    const DefaultTemplate = [FileMenu, EditMenu, ViewMenu, HelpMenu];

    if (IS_DEBUG_MODE) {
      DefaultTemplate.push(_DevMenu);
      return DefaultTemplate;
    }
    return DefaultTemplate;
  }
}
