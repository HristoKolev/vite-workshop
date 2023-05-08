import { useEffect, useState, JSX } from 'react';
import { formatDate } from './helpers';
import logoUrl from './logo.png';

export const App = (): JSX.Element => {
  const [message, setMessage] = useState<string | undefined>();

  useEffect(() => {
    void fetch('http://localhost:3001/')
      .then((res) => res.text())
      .then(setMessage);
  }, []);

  return (
    <div className="text">
      <div className="text-center">Hello Vite</div>
      <div data-testid="date-label">{formatDate(new Date())}</div>
      {message && <div data-testid="server-message">{message}</div>}
      <div>
        <img src={logoUrl} alt="logo" />
      </div>
    </div>
  );
};
