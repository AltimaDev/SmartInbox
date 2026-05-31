/**
 * API Service for Gmail Reader Backend
 * Handles all communication with the Flask API server
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class GmailReaderAPI {
  /**
   * Check if the backend API is available
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Check Gmail connection status
   */
  static async getGmailStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/gmail/status`);
      if (!response.ok) throw new Error('Failed to get Gmail status');
      return await response.json();
    } catch (error) {
      console.error('Error checking Gmail status:', error);
      return {
        status: 'error',
        data: { connected: false, message: error.message }
      };
    }
  }

  /**
   * Get list of emails with filters
   */
  static async getEmails(options = {}) {
    try {
      const {
        search = '',
        category = 'All',
        limit = 20,
        offset = 0
      } = options;

      const params = new URLSearchParams({
        search,
        category: category === 'All' ? '' : category,
        limit,
        offset
      });

      const response = await fetch(`${API_BASE_URL}/emails?${params}`);
      if (!response.ok) throw new Error('Failed to fetch emails');
      return await response.json();
    } catch (error) {
      console.error('Error fetching emails:', error);
      return {
        status: 'error',
        message: error.message,
        data: { emails: [], total_count: 0, unread_count: 0 }
      };
    }
  }

  /**
   * Get full details for a specific email
   */
  static async getEmailDetails(emailId) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/${emailId}`);
      if (!response.ok) throw new Error('Failed to fetch email details');
      return await response.json();
    } catch (error) {
      console.error('Error fetching email details:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Search emails with advanced filters
   */
  static async searchEmails(options = {}) {
    try {
      const {
        q = '',
        sender = '',
        from_date = '',
        to_date = '',
        limit = 20
      } = options;

      const params = new URLSearchParams({
        q,
        sender,
        from_date,
        to_date,
        limit
      });

      const response = await fetch(`${API_BASE_URL}/emails/search?${params}`);
      if (!response.ok) throw new Error('Failed to search emails');
      return await response.json();
    } catch (error) {
      console.error('Error searching emails:', error);
      return {
        status: 'error',
        message: error.message,
        data: { emails: [], total_count: 0 }
      };
    }
  }

  /**
   * Export emails as JSON
   */
  static async exportAsJSON(emails) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/export/json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'emails.json';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting as JSON:', error);
      throw error;
    }
  }

  /**
   * Export emails as CSV
   */
  static async exportAsCSV(emails) {
    try {
      const response = await fetch(`${API_BASE_URL}/emails/export/csv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'emails.csv';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting as CSV:', error);
      throw error;
    }
  }
}

export default GmailReaderAPI;
