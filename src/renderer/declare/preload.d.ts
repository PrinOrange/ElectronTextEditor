declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send(channel: string, ...args: any[]): void;
        on(
          channel: string,
          func: (...args: any[]) => void
        ): (() => void) | undefined;
        once(channel: string, func: (...args: any[]) => void): void;
        invoke(channel: string, ...args: any[]): Promise<any>;
        removeListener(channel: string, listener: (...args: any[]) => void);
        removeAllListeners(channel: string);
      };
    };
  }
}

export {};
