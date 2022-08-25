export enum RendererChannels {
  ICP_EXAMPLE = 'icp-example',
  OPEN_FILE = 'open-file',
  FETCH_CODE = 'fetch-code',
  FIRST_SAVE_FILE = 'save-file',
  //
  SAVE_AS_FILE = 'save-as-file',
  /**
   * The notification gets the code in the editor
   * and sends it to the main process
   */
  FETCH_CODE_TO_SAVE_AS = 'fetch-code-to-save-as',
  /**
   * The notification gets the code in the editor
   * and sends it to the main process
   */
  FETCH_CODE_TO_SAVE = 'fetch-code-to-save',
  /**
   * Specifies the state of the codemap,
   * whether to display it or not.
   */
  SET_CODEMAP = 'set-codemap',

  UPDATE_SAVED_FILE = 'write-in-file',

  RETURN_SAVED_FILE_PATH = 'get-opened-file-path',
}
