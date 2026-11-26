import React from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from './router';
import { App } from './App';
import './styles.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><Router><App /></Router></React.StrictMode>);
