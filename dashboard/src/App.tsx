import React from 'react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Devices from './pages/Devices';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const App: React.FC = () => {
    // TODO: State for theme toggle (hoist state to Context in real app)
    const currentTheme = webLightTheme;

    return (
        <FluentProvider theme={currentTheme}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Overview />} />
                        <Route path="/devices" element={<Devices />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </FluentProvider>
    );
};

export default App;
