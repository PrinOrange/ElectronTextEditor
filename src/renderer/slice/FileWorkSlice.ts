import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Define a type for the slice state
export interface FileWorkState {
  MountedFilePath: string | undefined;
  isSaved: boolean;
}

// Action for setting filepath
export interface SetFilePathAction {
  type: string;
  payload: string;
}

// Action for setting file saving state
export interface SetFileMountedAction {
  type: string;
  payload: boolean;
}

// Define the initial editor state.
const initialState: FileWorkState = {
  MountedFilePath: undefined,
  isSaved: false,
};

// Create the editor state.
export const FileWorkSlice = createSlice({
  name: 'fileWork',
  initialState,
  reducers: {
    /**
     * Set a new path for the opened file.
     * @param state The filework state
     * @param action The dispatched action
     * @returns Returned new state
     */
    setMountedFilePath: (
      state: FileWorkState,
      action: SetFilePathAction
    ): FileWorkState => {
      return { ...state, MountedFilePath: action.payload };
    },
    /**
     * Set save state for open files.
     * @param state The filework state
     * @param action The dispatched action
     * @returns Returned new state
     */
    setIsMounted: (
      state: FileWorkState,
      action: SetFileMountedAction
    ): FileWorkState => {
      return { ...state, isSaved: action.payload };
    },
  },
});

/**
 * Export actions in FileWorkSlice.
 */
export const { setMountedFilePath, setIsMounted } = FileWorkSlice.actions;

/**
 * Select the path of the opened file.
 * @param state The Root state in redux
 * @returns Opened file path
 */
export const fileWorkSelectMountedFilePath = (state: RootState) => {
  return state.fileWork.MountedFilePath;
};

/**
 * Select is-saved state of opened file.
 * @param state The Root state in redux
 * @returns
 */
export const fileWorkSelectIsFileMounted = (state: RootState) => {
  return state.fileWork.isSaved;
};

export default FileWorkSlice.reducer;
