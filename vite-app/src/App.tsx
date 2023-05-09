import { useEffect, useState, JSX } from 'react';
import logoUrl from 'src/logo.png';

import { formatDate } from '~helpers';

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
