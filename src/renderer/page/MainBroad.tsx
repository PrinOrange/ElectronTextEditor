import CodeEditor from 'renderer/component/CodeEditor';
import { StatusBar } from 'renderer/component/StatusBar';

/**
 * MainBroad page in application.
 * @returns MainBroad Page Component.
 */
export const MainBroad = () => {
  /**
   * *** WARNING ***
   * Every time the component is re-rendered,
   * in order to ensure that the instance obtained from the store is up-to-date,
   * the listener must be reset. However, the same channel of the icpMain listener will not be overwritten,
   * so before resetting the listener, remove all previous listeners.
   */

  return (
    <div className="tw-h-screen tw-w-screen " style={{backgroundColor:"rgb(30,30,30)"}}>
      <div style={{ height: 'calc(100vh - 22px)', width: '100vw' }}>
        <CodeEditor />
      </div>
      <div style={{ height: '22px' }}>
        <StatusBar mode="notify" text="This is The Status Bar" />
      </div>
    </div>
  );
};

export default MainBroad;
