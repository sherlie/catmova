import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';

import './App.css';
import { client } from '../graphql/client';
import { Language } from '../graphql/types';
import LangSelectDialog from './LangSelectDialog';
import Menu from './Menu';
import AppSwitch from './AppSwitch';
import Cookies from 'cookies-js';

const COOKIE_SELECTED_LANG = 'selectedLang';

function App() {
  const [selectedLang, setSelectedLang] = useState<Language | undefined>(
    getSelectedLangFromCookie(),
  );
  const [open, setOpen] = useState(false);

  return (
    <ApolloProvider client={client}>
      <p>{selectedLang && selectedLang.name}</p>
      <button onClick={() => setOpen(true)}> change language</button>
      {open && (
        <LangSelectDialog
          selectedLang={selectedLang}
          onSelectLang={(selectedLang) => {
            setSelectedLang(selectedLang);
            Cookies.set(COOKIE_SELECTED_LANG, JSON.stringify(selectedLang));
          }}
          onClose={() => setOpen(false)}
        />
      )}

      <Menu />
      <AppSwitch selectedLang={selectedLang} />
    </ApolloProvider>
  );
}

function getSelectedLangFromCookie(): Language | undefined {
  const cookie = Cookies.get(COOKIE_SELECTED_LANG);
  return cookie && JSON.parse(cookie);
}

export default App;