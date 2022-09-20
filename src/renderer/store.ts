import { configureStore } from '@reduxjs/toolkit';
import CodeEditorSlice from './slice/CodeEditorSlice';
import FileWorkSlice from './slice/FileWorkSlice';

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        /*
         *   Because the entire editor instance needs to be stored in the redux store.
         *   But the editor created instance is not serializable.
         *   So this will cause redux to throw an error.
         *   So you need to configure redux to ignore the serialization check for editor instance
         */
        ignoredActions: ['codeEditor/initEditor'],
        ignoredPaths: ['codeEditor'],
      },
    }),
  reducer: {
    codeEditor: CodeEditorSlice,
    fileWork: FileWorkSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
