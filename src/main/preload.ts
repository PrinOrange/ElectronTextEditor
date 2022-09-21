import {
  contextBridge,
  ipcRenderer,
  IpcRendererEvent
} from 'electron';
import { ChannelsMain } from './channels-main';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send(channel: ChannelsMain, args: any[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: ChannelsMain, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },
    once(channel: ChannelsMain, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: ChannelsMain, ...args: any[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
    removeListener(channel: ChannelsMain, listener: (...args: any[]) => void) {
      ipcRenderer.removeListener(channel, listener);
    },
    removeAllListeners(channel: ChannelsMain) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
});
