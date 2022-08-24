import { createSlice } from '@reduxjs/toolkit';
import { editor } from 'monaco-editor';
import type { RootState } from '../store';

/**
 *  WARNING: Created Editor Instance is Unserializable
 *
 *      Since created editor instance is not serializable.
 *      So you have to be careful when modifying the editor instance in storage.
 *      Please try to take this action: destroy the original editor and create a new editor.
 *      When accessing editor instances in storage, operate with selectors, not dispatchers.
 *      Please pay attention to the console error message when debugging.
 */

// Define a type for the slice state
export interface CodeEditorState {
  editorInstance: editor.IStandaloneCodeEditor | null;
  editorOptions: editor.IStandaloneEditorConstructionOptions | undefined;
}

// Action to init editor.
export interface InitEditorAction {
  type: string;
  payload: {
    domRef: HTMLDivElement | null;
    options: editor.IStandaloneEditorConstructionOptions;
  };
}

//Action to destroy editor
export interface DestroyEditorAction {
  type: string;
  payload: undefined;
}

// Define the initial editor state.
const initialState: CodeEditorState = {
  editorInstance: null,
  editorOptions: undefined,
};

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

// Create the editor slice.
export const CodeEditorSlice = createSlice({
  name: 'codeEditor',
  initialState,
  reducers: {
    /**
     * Initializes the state in the code editor,
     * which creates a new editor instance based on the options
     * @param _state The code editor state
     * @param action The destroy action
     * @returns return the initial editor state
     */
    initEditor: (_state: CodeEditorState, action: InitEditorAction) => {
      return {
        editorInstance: editor.create(
          action.payload.domRef!,
          action.payload.options
        ),
        editorOptions: action.payload.options,
      };
    },

    /**
     * Destroy the code editor state in the store
     * @param state The code editor state
     * @param _action The destroy action
     * @returns return the destroyed editor state
     */
    destroyEditor: (state: CodeEditorState, _action: DestroyEditorAction) => {
      state.editorInstance?.dispose();
      return {
        editorInstance: null,
        editorOptions: undefined,
      };
    },
  },
});

export const { initEditor, destroyEditor } = CodeEditorSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const codeEditorSelectEditor = (state: RootState) => {
  return state.codeEditor.editorInstance;
};

export default CodeEditorSlice.reducer;
