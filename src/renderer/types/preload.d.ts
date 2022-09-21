import { ChannelsRerender } from "../channels-renderer";

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send(channel: ChannelsRerender, ...args: any[]): void;
        on(
          channel: ChannelsRerender,
          func: (...args: any[]) => void
        ): (() => void) | undefined;
        once(channel: ChannelsRerender, func: (...args: any[]) => void): void;
        invoke(channel: ChannelsRerender, ...args: any[]): Promise<any>;
        removeListener(channel: ChannelsRerender, listener: (...args: any[]) => void);
        removeAllListeners(channel: ChannelsRerender);
      };
    };
  }
}

export {};
