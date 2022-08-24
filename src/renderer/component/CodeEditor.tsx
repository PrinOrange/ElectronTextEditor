import { editor } from 'monaco-editor';
import {
  initEditor,
  codeEditorSelectEditor,
} from 'renderer/slice/CodeEditorSlice';
import { RendererChannels } from '../declare/channels-renderer';
import { useAppDispatch, useAppSelector } from 'renderer/hook/redux-hooks';
import { useEffect, useRef } from 'react';
import {
  fileWorkSelectIsFileSaved,
  fileWorkSelectMountedFilePath,
  setIsSaved,
  setMountedFilePath,
} from 'renderer/slice/FileWorkSlice';
import { MountedFile } from 'renderer/declare/file-model';

// Default options for editor
// For more options, documentation is here
// https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html
export const defaultEditorOption: editor.IStandaloneEditorConstructionOptions =
  {
    scrollBeyondLastLine: false,
    automaticLayout: true,
    theme: 'vs-dark',
    minimap: {
      enabled: true,
    },
    value: '',
    fontFamily: 'consolas,Microsoft YaHei',
  };

/**
 * Return the code editor instance mounted on div element.
 *
 * *** WARNING ***
 *
 * This component can only be used once in React.
 * Likewise, the parent component that uses this component,
 * as well as the higher-level ancestor component, can only be called once in React.
 * Because the instance it mounts is only stored in one redux-store.
 * If this component is reused multiple times, it will cause repeated mounting,
 * which will lead to unpredictable consequences
 * @return {JSX.Element} Return a CodeEditor JSX Element
 */
const CodeEditor = () => {
  // Reference the dom that mounted monaco-editor
  const dom_ref = useRef<HTMLDivElement | null>(null);

  const removeListeners = () => {
    window.electron.ipcRenderer.removeAllListeners(
      RendererChannels.FETCH_CODE_TO_SAVE
    );
    window.electron.ipcRenderer.removeAllListeners(
      RendererChannels.FIRST_SAVE_FILE
    );
    window.electron.ipcRenderer.removeAllListeners(
      RendererChannels.SET_CODEMAP
    );
    window.electron.ipcRenderer.removeAllListeners(
      RendererChannels.UPDATE_SAVED_FILE
    );
    window.electron.ipcRenderer.removeAllListeners(
      RendererChannels.FETCH_CODE_TO_SAVE_AS
    );
  };

  // Dispatcher
  const dispatcher = useAppDispatch();

  // Hooks the editor instance from redux store.
  const selectEditorInstance = useAppSelector(codeEditorSelectEditor);

  // Hooks the saved state from workflow state
  const selectIsSaved = useAppSelector(fileWorkSelectIsFileSaved);

  // Hooks the saved path from workflow state.
  const selectMountedFilePath = useAppSelector(fileWorkSelectMountedFilePath);

  useEffect(() => {
    if (selectEditorInstance === null) {
      dispatcher(
        initEditor({ domRef: dom_ref.current, options: defaultEditorOption })
      );
    }
    selectEditorInstance?.render();
  }, []);

  useEffect(() => {
    // Clean listeners every renders.
    removeListeners();

    /**
     * Listener for setting codemap.
     */
    window.electron.ipcRenderer.on(
      RendererChannels.SET_CODEMAP,
      (toggle: boolean) => {
        selectEditorInstance?.updateOptions({ minimap: { enabled: toggle } });
      }
    );

    /**
     * After receiving the channel information for the open file,
     * stream the string into the editor.
     */
    window.electron.ipcRenderer.on(
      RendererChannels.OPEN_FILE,
      (data: MountedFile) => {
        dispatcher(setIsSaved(true));
        dispatcher(setMountedFilePath(data.filepath));
        selectEditorInstance?.setValue(data.content);
      }
    );

    /**
     * After receiving the channel signal to get the code,
     * transmit the content in the editor to the main process by the channel that save-as the action
     */
    window.electron.ipcRenderer.on(
      RendererChannels.FETCH_CODE_TO_SAVE_AS,
      () => {
        window.electron.ipcRenderer.send(
          RendererChannels.FIRST_SAVE_FILE,
          selectEditorInstance?.getValue()
        );
      }
    );

    /**
     * After receiving the channel signal to get the code,
     * transmit the content in the editor to the main process by the channel that save action
     */
    window.electron.ipcRenderer.on(RendererChannels.FETCH_CODE_TO_SAVE, () => {
      if (!selectIsSaved) {
        window.electron.ipcRenderer.send(
          RendererChannels.FIRST_SAVE_FILE,
          selectEditorInstance?.getValue()
        );
      } else {
        window.electron.ipcRenderer.send(RendererChannels.UPDATE_SAVED_FILE, [
          selectMountedFilePath,
          selectEditorInstance?.getValue(),
        ]);
      }
    });

    /**
     *
     */
    window.electron.ipcRenderer.on(
      RendererChannels.RETURN_SAVED_FILE_PATH,
      (filepath: string) => {
        dispatcher(setIsSaved(true));
        dispatcher(setMountedFilePath(filepath));
      }
    );

    return removeListeners;
  });

  return <div className="tw-h-full tw-w-full tw-p-1" ref={dom_ref} />;
};

export default CodeEditor;
