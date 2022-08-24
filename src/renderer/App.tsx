import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import MainBroad from './page/MainBroad';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainBroad />} />
      </Routes>
    </Router>
  );
}
