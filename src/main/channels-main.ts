export enum MainChannels {
  ICP_EXAMPLE = 'icp-example',
  OPEN_FILE = 'open-file',
  FETCH_CODE = 'fetch-code',
  FIRST_SAVE_FILE = 'save-file',
  SAVE_AS_FILE = 'save-as-file',
  FETCH_CODE_TO_SAVE_AS = 'fetch-code-to-save-as',
  FETCH_CODE_TO_SAVE = 'fetch-code-to-save',
  SET_CODEMAP = 'set-codemap',
  UPDATE_SAVED_FILE = 'write-in-file',
  RETURN_SAVED_FILE_PATH = 'get-opened-file-path',
}

type ChannelICPExample = 'icp-example';

type CodeEditorContentWork = `code-editor:${'fetch' | 'set' | 'clean'}`;
type CodeMapWork = `codemap:${'show' | 'hidden'}`;
type FileWork = `file:${'write-in' | 'mount' | 'load-r' | 'load-wr'}`;
type NotificationWork = `notification:${'error' | 'info' | 'warning'}`;

type ChannelsMain = `${
  | ChannelICPExample
  | CodeEditorContentWork
  | CodeMapWork
  | FileWork
  | NotificationWork}`;

type ChannelsReply = `${ChannelsMain}::reply`;

export { ChannelsMain, ChannelsReply };
