import { BrowserRouter } from 'react-router-dom';

import AppShell from '../components/layout/AppShell';
import AppRoutes from './routes';

const App = () => (
  <BrowserRouter>
    <AppShell>
      <AppRoutes />
    </AppShell>
  </BrowserRouter>
);

export default App;
