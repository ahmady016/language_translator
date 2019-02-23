import React from 'react';
import Translator from './Translator';
import './app.css';

export default function App() {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#!">
          <img src="https://cdn0.iconfinder.com/data/icons/tuts/256/google_translate.png" alt="translator App"/>
            Language Translator
          </a>
        </nav>
      </header>
      <div className="container">
        <Translator />
      </div>
    </>
  );
}