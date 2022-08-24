/**
 * Define the modes of StatusBar.
 *
 * Edit mode: Indicates editing status.
 * Gives detailed editing information, such as selected text, cursor position, etc.
 *
 * Processing mode: Gives instructions and a progress bar.
 *
 * Notify mode: Used for information notification, giving the specified prompt information.
 */
export type StatusBarMode = 'edit' | 'processing' | 'notify';

export interface StatusBarProps {
  mode: StatusBarMode;
  text?: string;
}

export const StatusBar = (props: StatusBarProps): JSX.Element => {
  return (
    <div className=" tw-h-full tw-px-2 tw-py-0 tw-flex tw-bg-blue-500 tw-select-none tw-text-xs">
      <span className=" tw-text-white tw-my-auto">{props.text}</span>
    </div>
  );
};

StatusBar.defaultProps = {
  mode: 'notify',
};
