type ChannelICPExample = 'icp-example';

type CodeEditorContentWork = `code-editor:${'fetch' | 'set' | 'clean'}`;
type CodeMapWork = `codemap:${'set'}`;
type FileWork = `file:${'update' | 'save-as' | 'mount' | 'load-r' | 'load-wr'}`;
type NotificationWork = `notification:${'error' | 'info' | 'warning'}`;

type Channels = `${
  | ChannelICPExample
  | CodeEditorContentWork
  | CodeMapWork
  | FileWork
  | NotificationWork}`;

type ChannelsReply = `${Channels}::reply`;

type ChannelsRerender = ChannelsReply | Channels;

export { ChannelsRerender };
