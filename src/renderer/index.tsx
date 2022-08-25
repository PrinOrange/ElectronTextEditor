import App from './App';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RendererChannels } from './declare/channels-renderer';
import { store } from './store';
import '@arco-design/web-react/dist/css/arco.css';
import 'tailwindcss/tailwind.css';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

// Test ipc work at start time.
window.electron.ipcRenderer.once(RendererChannels.ICP_EXAMPLE, (arg) => {
  console.log(arg);
});
window.electron.ipcRenderer.send(RendererChannels.ICP_EXAMPLE, ['ping']);
