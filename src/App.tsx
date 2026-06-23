import { AppShell } from './components/Layout/AppShell';
import { InstallPrompt } from './components/InstallPrompt/InstallPrompt';
import './styles/theme.css';

export default function App() {
  return (
    <>
      <AppShell />
      <InstallPrompt />
    </>
  );
}
