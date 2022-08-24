import { Divider } from '@arco-design/web-react';
import { VscFolderOpened, VscNewFile } from 'react-icons/vsc';
export const ToolBar = () => {
  return (
    <div className="tw-flex">
      <VscNewFile size={'12px'} />
      <VscFolderOpened size={'12px'} />
      <Divider type="vertical" />
    </div>
  );
};

export default ToolBar;
