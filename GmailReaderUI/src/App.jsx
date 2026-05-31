import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailDetails from './components/EmailDetails';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBanner from './components/ErrorBanner';
import GmailReaderAPI from './api';
import Dashboard from './components/Dashboard';
import Preloader from './components/Preloader';

export default function App() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [emails, setEmails] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inbox');
  const [showPreloader, setShowPreloader] = useState(true);
  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (connected) {
      fetchEmails();
    }
  }, [searchQuery, selectedCategory]);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);

      const isHealthy = await GmailReaderAPI.checkHealth();

      if (!isHealthy) {
        throw new Error(
          'Backend server is not running. Please start the Flask API server.'
        );
      }

      const statusResponse = await GmailReaderAPI.getGmailStatus();

      console.log('Gmail Status:', statusResponse);

      const isConnected = statusResponse?.data?.connected || false;

      setConnected(isConnected);

      if (isConnected) {
        await fetchEmails();
      } else {
        throw new Error(
          'Gmail is not connected. Please check credentials.json'
        );
      }
    } catch (err) {
      console.error('Failed to initialize:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await GmailReaderAPI.getEmails({
        search: searchQuery,
        category: selectedCategory,
        limit: 50,
        offset: 0,
      });

      console.log('FULL RESPONSE:', response);

      if (!response) {
        throw new Error('No response received from API');
      }

      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to fetch emails');
      }

      const fetchedEmails = response?.data?.emails || [];

      console.log('FETCHED EMAILS:', fetchedEmails);

      setEmails(fetchedEmails);

      if (fetchedEmails.length > 0) {
        setSelectedEmail(fetchedEmails[0]);
      } else {
        setSelectedEmail(null);
      }
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError(err.message);
      setEmails([]);
      setSelectedEmail(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    await initializeApp();
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleRefresh = async () => {
    await fetchEmails();
  };

  const handleEmailSelect = (email) => {
    setSelectedEmail(email);
  };

  const handleExportJSON = async () => {
    try {
      await GmailReaderAPI.exportAsJSON(emails);
    } catch (err) {
      console.error(err);
      setError('Failed to export JSON');
    }
  };

  const handleExportCSV = async () => {
    try {
      await GmailReaderAPI.exportAsCSV(emails);
    } catch (err) {
      console.error(err);
      setError('Failed to export CSV');
    }
  };

  console.log('emails state:', emails);
  console.log('loading:', loading);
  console.log('selectedEmail:', selectedEmail);

  if (showPreloader) {
  return (
    <Preloader
      onFinish={() => setShowPreloader(false)}
    />
  );
}

  return (
    <div className="h-screen bg-white flex flex-col">
      <Header
        connected={connected}
        onConnect={handleConnect}
        isLoading={loading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {error && (
        <ErrorBanner
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          emails={emails}
          onRefresh={handleRefresh}
          loading={loading}
        />

        {activeTab === 'dashboard' ? (
          <Dashboard
            emails={emails}
            onSelectEmail={(email) => {
              setSelectedEmail(email);
              setActiveTab('inbox');
            }}
            onViewInbox={() => setActiveTab('inbox')}
          />
        ) : (
          <div className="flex-1 flex overflow-hidden border-l border-brand-border">
            {loading && emails.length === 0 ? (
              <LoadingSpinner message="Fetching emails..." />
            ) : (
              <>
                <EmailList
                  emails={emails}
                  selectedEmail={selectedEmail}
                  onSelectEmail={handleEmailSelect}
                />

                {selectedEmail ? (
                  <EmailDetails
                    email={selectedEmail}
                    onExportJSON={handleExportJSON}
                    onExportCSV={handleExportCSV}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-brand-light">
                    <p className="text-brand-text-secondary">
                      No email selected
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
