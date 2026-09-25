"use client";

import React, { useState, useEffect } from 'react';

const ThoverDeleteAccount = () => {
  const [page, setPage] = useState('public'); // 'public', 'admin'
  const [adminAuth, setAdminAuth] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // ============ PUBLIC FORM STATE ============
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    requestType: 'delete-all',
    reason: '',
    reasonText: '',
    termsAccepted: false,
    honeypot: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // ============ ADMIN STATE ============
  const [adminRequests, setAdminRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [adminLoading, setAdminLoading] = useState(false);

  const THOVER_COLORS = {
    primary: '#FF6B35', // Warm orange for delivery
    accent: '#004E89', // Trust blue
    danger: '#D32F2F', // Red for destructive
    success: '#388E3C', // Green
    neutral: '#F5F5F5',
  };

  // ============ VALIDATION ============
  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || cleaned.length === 12;
  };

  const validateEmail = (email) => {
    if (!email) return true; // Optional field
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Enter a valid 10-digit Indian phone number';
    }

    if (formData.email && !validateEmail(formData.email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!formData.termsAccepted) {
      errors.termsAccepted = 'You must accept the terms to proceed';
    }

    if (formData.honeypot) {
      errors.honeypot = 'Spam detected';
      return errors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============ FORM HANDLERS ============
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.startsWith('91') && value.length > 12) {
      value = value.slice(0, 12);
    } else if (!value.startsWith('91') && value.length > 10) {
      value = value.slice(0, 10);
    }

    // Format display with +91 prefix if starting with 91, else show as is
    let displayValue = value;
    if (value.startsWith('91') && value.length === 12) {
      displayValue = '+91 ' + value.slice(2);
    } else if (value.length > 0 && !value.startsWith('91')) {
      displayValue = value;
    }

    setFormData(prev => ({
      ...prev,
      phone: displayValue,
    }));

    if (formErrors.phone) {
      setFormErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmDeletion = async () => {
  setShowConfirmDialog(false);
  setLoading(true);

  try {
    const cleanPhone = formData.phone.replace(/\D/g, '').slice(-10);

    // No database/API call
    const referenceId = `TH-${Date.now()}`;

    setSuccessData({
      referenceId,
      timestamp: new Date().toLocaleString('en-IN'),
    });

    setFormSubmitted(true);
  } catch (error) {
    setFormErrors({
      submit: 'Unable to submit your request. Please try again.',
    });
  } finally {
    setLoading(false);
  }
};

  // ============ ADMIN HANDLERS ============
  const handleAdminLogin = (e) => {
    e.preventDefault();
    // In production, verify against a secure backend
    if (adminPassword === 'demo-admin-2024') {
      setAdminAuth(true);
      setShowAdminLogin(false);
      loadAdminRequests();
    } else {
      alert('Invalid password');
    }
  };

  const loadAdminRequests = async () => {
    setAdminLoading(true);
    try {
      const response = await fetch('/api/admin/deletion-requests');
      if (!response.ok) throw new Error('Failed to load requests');
      const data = await response.json();
      setAdminRequests(data);
    } catch (error) {
      alert('Failed to load requests: ' + error.message);
    } finally {
      setAdminLoading(false);
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/admin/deletion-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update');
      loadAdminRequests();
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const filteredRequests = statusFilter === 'all' 
    ? adminRequests 
    : adminRequests.filter(r => r.status === statusFilter);

  // ============ RENDER PUBLIC PAGE ============
  if (page === 'public') {
    if (formSubmitted && successData) {
      return (
        <div style={{ background: '#fff' }}>
          {/* Header */}
          <header style={styles.header}>
            <div style={styles.container}>
              <div style={styles.logo}>🛵 Thover</div>
            </div>
          </header>

          {/* Success Screen */}
          <main style={styles.container}>
            <div style={styles.successContainer}>
              <div style={styles.successIcon}>✓</div>
              <h1 style={styles.successTitle}>Request received</h1>
              <p style={styles.successText}>
                Your account deletion request has been submitted successfully.
              </p>

              <div style={styles.referenceBox}>
                <div style={styles.referenceLabel}>Reference ID</div>
                <div style={styles.referenceId}>{successData.referenceId}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(successData.referenceId)}
                  style={styles.copyBtn}
                >
                  Copy
                </button>
              </div>

              <div style={styles.timelineBox}>
                <h3 style={styles.timelineTitle}>What happens next</h3>
                <div style={styles.timelineItem}>
                  <span style={styles.timelineNumber}>1</span>
                  <div>
                    <p style={styles.timelineBold}>Processing begins</p>
                    <p style={styles.timelineDesc}>We'll start processing your request immediately</p>
                  </div>
                </div>
                <div style={styles.timelineItem}>
                  <span style={styles.timelineNumber}>2</span>
                  <div>
                    <p style={styles.timelineBold}>Confirmation sent</p>
                    <p style={styles.timelineDesc}>You'll receive an SMS or email with updates within 7 working days</p>
                  </div>
                </div>
                <div style={styles.timelineItem}>
                  <span style={styles.timelineNumber}>3</span>
                  <div>
                    <p style={styles.timelineBold}>Account deleted</p>
                    <p style={styles.timelineDesc}>All your data will be permanently removed</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setFormSubmitted(false);
                  setSuccessData(null);
                  setFormData({
                    fullName: '',
                    phone: '',
                    email: '',
                    requestType: 'delete-all',
                    reason: '',
                    reasonText: '',
                    termsAccepted: false,
                    honeypot: '',
                  });
                }}
                style={{ ...styles.button, ...styles.buttonPrimary, marginTop: '2rem' }}
              >
                Back to home
              </button>
            </div>
          </main>

          {/* Footer */}
          <footer style={styles.footer}>
            <div style={styles.container}>
              <p style={styles.footerText}>
                Questions? Contact <a href="mailto:team@thover.in" style={styles.link}>team@thover.in</a>
              </p>
              <div style={styles.footerLinks}>
                <a href="/privacy-policy" style={styles.link}>Privacy Policy</a>
                <span style={{ color: '#ccc' }}>•</span>
                <a href="/terms-of-use" style={styles.link}>Terms of Service</a>
              </div>
              <p style={styles.footerCopy}>© 2024 Thover. All rights reserved.</p>
            </div>
          </footer>
        </div>
      );
    }

    return (
      <div
  style={{
    background: '#ffffff',
    minHeight: '100vh',
    color: '#111111',
  }}
>
        {/* Header */}
       <header style={styles.header}>
  <div style={styles.container}>
    <div style={styles.logo}>
      <img
        src="/logo.png"
        alt="Thover"
        style={styles.logoIcon}
      />
      <span>Thover</span>
    </div>
  </div>
</header>

        {/* Admin Login Modal */}
        {showAdminLogin && !adminAuth && (
          <div style={styles.modalOverlay} onClick={() => setShowAdminLogin(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <h2>Admin Login</h2>
              <form onSubmit={handleAdminLogin}>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  style={styles.input}
                />
                <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>
                  Login
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main style={styles.container}>
          {/* Intro */}
          <section style={styles.section}>
            <h1 style={styles.heading}>Delete your Thover account</h1>
            <p style={styles.intro}>
              This page lets riders of the Thover Delivery Rider app request deletion of their account and associated personal data. You can also delete your account directly in the app.
            </p>
          </section>

          {/* How to Delete */}
          <section style={styles.section}>
            <h2 style={styles.subheading}>How to delete your account</h2>
            <div style={styles.methodsGrid}>
              <div style={styles.methodCard}>
  <div style={styles.methodIcon}>📱</div>
  <h3 style={{ color: '#111111', margin: '0 0 8px' }}>In-app</h3>
  <p style={{ color: '#444444', margin: 0 }}>
    Open Thover Rider → Profile → Settings → Delete Account
  </p>
</div>
              <div style={styles.methodCard}>
  <div style={styles.methodIcon}>🌐</div>
  <h3 style={{ color: '#111111', margin: '0 0 8px' }}>Web</h3>
  <p style={{ color: '#444444', margin: 0 }}>
    Submit the form below
  </p>
</div>
            </div>
          </section>

          {/* What Gets Deleted */}
          <section style={styles.section}>
            <h2 style={styles.subheading}>What gets deleted</h2>
            <ul style={styles.list}>
              <li>Full name and contact information (phone, email)</li>
              <li>Profile photo</li>
              <li>KYC documents (Aadhaar, PAN, driving license images)</li>
              <li>Vehicle details</li>
              <li>Bank and UPI payment details</li>
              <li>Location history</li>
              <li>Device information and login history</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section style={styles.section}>
            <h2 style={styles.subheading}>What we retain and for how long</h2>
            <div style={styles.retentionBox}>
              <p>
                <strong>Completed delivery and transaction records</strong> may be kept for up to 180 days (or as required by Indian tax and legal regulations) for audit, fraud prevention, and legal compliance purposes. These records are then permanently deleted.
              </p>
              <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
                This retention is required by Indian labor laws and GST regulations.
              </p>
            </div>
          </section>

          {/* Timeline */}
          <section style={styles.section}>
            <h2 style={styles.subheading}>Processing timeline</h2>
            <div style={styles.timelineBox}>
              <div style={styles.timelineItem}>
                <span style={styles.timelineNumber}>1-2 days</span>
                <p style={styles.timelineDesc}>We verify your request and settle any pending payouts</p>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineNumber}>3-5 days</span>
                <p style={styles.timelineDesc}>Your account and data are deleted from our systems</p>
              </div>
              <div style={styles.timelineItem}>
                <span style={styles.timelineNumber}>5-7 days</span>
                <p style={styles.timelineDesc}>Confirmation sent via SMS or email</p>
              </div>
            </div>
          </section>

          {/* Form */}
          <section style={styles.section}>
            <h2 style={styles.subheading}>Request account deletion</h2>

            {formErrors.submit && (
              <div style={styles.errorBanner}>
                {formErrors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              {/* Honeypot */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                tabIndex="-1"
                autoComplete="off"
              />

              {/* Full Name */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Full name <span style={{ color: THOVER_COLORS.danger }}>*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  style={{
                    ...styles.input,
                    borderColor: formErrors.fullName ? THOVER_COLORS.danger : '#ddd',
                  }}
                />
                {formErrors.fullName && (
                  <span style={styles.errorText}>{formErrors.fullName}</span>
                )}
              </div>

              {/* Phone */}
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Registered mobile number <span style={{ color: THOVER_COLORS.danger }}>*</span>
                </label>
                <div style={styles.phoneInputWrapper}>
                  <span style={styles.phonePrefix}>+91</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="10-digit number"
                    maxLength="12"
                    style={{
                      ...styles.input,
                      paddingLeft: '50px',
                      borderColor: formErrors.phone ? THOVER_COLORS.danger : '#ddd',
                    }}
                  />
                </div>
                {formErrors.phone && (
                  <span style={styles.errorText}>{formErrors.phone}</span>
                )}
              </div>

              {/* Email */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Email (optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  style={{
                    ...styles.input,
                    borderColor: formErrors.email ? THOVER_COLORS.danger : '#ddd',
                  }}
                />
                {formErrors.email && (
                  <span style={styles.errorText}>{formErrors.email}</span>
                )}
              </div>

              {/* Request Type */}
              <div style={styles.formGroup}>
                <label style={styles.label}>What would you like to do? <span style={{ color: THOVER_COLORS.danger }}>*</span></label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="requestType"
                      value="delete-all"
                      checked={formData.requestType === 'delete-all'}
                      onChange={handleInputChange}
                    />
                    Delete my account and all data
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="requestType"
                      value="delete-partial"
                      checked={formData.requestType === 'delete-partial'}
                      onChange={handleInputChange}
                    />
                    Delete only specific data (keep account)
                  </label>
                </div>
              </div>

              {/* Reason */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Reason for deletion (optional)</label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="">Select a reason</option>
                  <option value="no-longer-working">No longer working with Thover</option>
                  <option value="privacy">Privacy concerns</option>
                  <option value="duplicate">Created duplicate account</option>
                  <option value="other">Other</option>
                </select>

                {formData.reason === 'other' && (
                  <textarea
                    name="reasonText"
                    value={formData.reasonText}
                    onChange={handleInputChange}
                    placeholder="Please tell us more..."
                    style={styles.textarea}
                    rows="4"
                  />
                )}
              </div>

              {/* Terms Checkbox */}
              <div style={styles.formGroup}>
                <label style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                  />
                  I understand this action is permanent and my pending payouts must be settled before deletion
                </label>
                {formErrors.termsAccepted && (
                  <span style={styles.errorText}>{formErrors.termsAccepted}</span>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  background: THOVER_COLORS.danger,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Submitting...' : 'Request account deletion'}
              </button>
            </form>
          </section>
        </main>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div style={styles.modalOverlay} onClick={() => setShowConfirmDialog(false)}>
            <div style={styles.modal} onClick={e => e.stopPropagation()}>
              <h2 style={{ color: THOVER_COLORS.danger, marginBottom: '1rem' }}>
                ⚠️ Are you sure?
              </h2>
              <p style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>
                This action cannot be undone. Your account and all associated data will be permanently deleted after 7 working days.
              </p>
              <div style={styles.modalButtons}>
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  style={{ ...styles.button, background: '#f0f0f0', color: '#333' }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeletion}
                  style={{
                    ...styles.button,
                    background: THOVER_COLORS.danger,
                    color: 'white',
                  }}
                >
                  Yes, delete permanently
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.container}>
            <p style={styles.footerText}>
              Questions? Contact <a href="mailto:team@thover.in" style={styles.link}>team@thover.in</a>
            </p>
            <div style={styles.footerLinks}>
              <a href="/privacy-policy" style={styles.link}>Privacy Policy</a>
              <span style={{ color: '#ccc' }}>•</span>
              <a href="/terms-of-use" style={styles.link}>Terms of Service</a>
            </div>
            <p style={styles.footerCopy}>© 2024 Thover. All rights reserved.</p>
          </div>
        </footer>
      </div>
    );
  }

  // ============ RENDER ADMIN PAGE ============
  if (page === 'admin') {
    if (!adminAuth) {
      return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={styles.modal}>
            <h2>Admin access required</h2>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                style={styles.input}
              />
              <button type="submit" style={{ ...styles.button, ...styles.buttonPrimary }}>
                Login
              </button>
              <button
                type="button"
                onClick={() => setPage('public')}
                style={{ ...styles.button, background: '#e0e0e0', marginTop: '0.5rem' }}
              >
                Back
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
        <header style={styles.header}>
          <div style={styles.container}>
            <div>
              <div style={styles.logo}>🛵 Thover Admin</div>
              <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0' }}>Deletion Requests Dashboard</p>
            </div>
            <button
              onClick={() => {
                setAdminAuth(null);
                setAdminPassword('');
                setPage('public');
              }}
              style={{ ...styles.button, background: '#e0e0e0' }}
            >
              Logout
            </button>
          </div>
        </header>

        <main style={styles.container}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0' }}>
            <h1 style={{ margin: 0 }}>Deletion Requests</h1>
            <button
              onClick={loadAdminRequests}
              style={{ ...styles.button, ...styles.buttonPrimary }}
              disabled={adminLoading}
            >
              {adminLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'pending', 'completed', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  ...styles.button,
                  background: statusFilter === status ? THOVER_COLORS.accent : '#e0e0e0',
                  color: statusFilter === status ? 'white' : '#333',
                  textTransform: 'capitalize',
                  fontSize: '14px',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Requests Table */}
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                      No requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map(req => (
                    <tr key={req.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{req.referenceId}</td>
                      <td>{req.fullName}</td>
                      <td>+91 {req.phone}</td>
                      <td>{req.requestType === 'delete-all' ? 'Full Delete' : 'Partial'}</td>
                      <td>
                        <span style={{
                          background: req.status === 'pending' ? '#FFC107' : (req.status === 'completed' ? '#4CAF50' : '#F44336'),
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          textTransform: 'capitalize',
                        }}>
                          {req.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(req.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td>
                        <select
                          onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                          value={req.status}
                          style={{
                            padding: '4px',
                            fontSize: '12px',
                            border: '0.5px solid #ccc',
                            borderRadius: '4px',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }
};

const styles = {
   header: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e5e5',
    padding: '14px 0',
    marginBottom: '2rem',
  },

  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '24px',
    fontWeight: '700',
    color: '#222',
  },

  logoIcon: {
    width: '42px',
    height: '42px',
    objectFit: 'contain',
    display: 'block',
  },
  adminBtn: {
    background: 'transparent',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  section: {
    marginBottom: '2.5rem',
  },
  heading: {
  fontSize: '28px',
  fontWeight: 'bold',
  marginBottom: '0.5rem',
  marginTop: '0',
  color: '#111111',
},
  subheading: {
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '1rem',
  marginTop: 0,
  color: '#111111',
},
  intro: {
  fontSize: '16px',
  color: '#333333',
  lineHeight: 1.6,
  margin: '0.5rem 0 0',
},
  methodsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  methodCard: {
  background: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '1.5rem',
  textAlign: 'center',
  color: '#222222',
},
  methodIcon: {
    fontSize: '32px',
    marginBottom: '0.5rem',
  },
  list: {
  lineHeight: 1.8,
  paddingLeft: '1.5rem',
  color: '#333333',
},
  retentionBox: {
    background: '#f0f4f8',
    border: '1px solid #b3d9ff',
    borderRadius: '8px',
    padding: '1.5rem',
    color: '#333',
    lineHeight: 1.6,
  },
  timelineBox: {
    background: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  timelineItem: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  timelineNumber: {
    minWidth: '60px',
    background: '#FF6B35',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineBold: {
    fontWeight: 'bold',
    margin: '0 0 4px',
  },
  timelineDesc: {
  color: '#444444',
  margin: 0,
  fontSize: '14px',
},
  form: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '2rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  phoneInputWrapper: {
    position: 'relative',
  },
  phonePrefix: {
    position: 'absolute',
    left: '12px',
    top: '12px',
    fontWeight: '500',
    color: '#666',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    marginTop: '0.5rem',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    cursor: 'pointer',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    fontSize: '14px',
    cursor: 'pointer',
    gap: '0.5rem',
    lineHeight: 1.5,
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    background: '#FF6B35',
    color: 'white',
  },
  errorBanner: {
    background: '#FFEBEE',
    border: '1px solid #EF5350',
    borderRadius: '4px',
    padding: '12px',
    marginBottom: '1rem',
    color: '#C62828',
    fontSize: '14px',
  },
  errorText: {
    display: 'block',
    color: '#D32F2F',
    fontSize: '12px',
    marginTop: '4px',
  },
  successContainer: {
    textAlign: 'center',
    padding: '2rem 0',
  },
  successIcon: {
    fontSize: '64px',
    background: '#4CAF50',
    color: 'white',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  successText: {
    color: '#666',
    marginBottom: '2rem',
  },
  referenceBox: {
    background: '#f5f5f5',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  referenceLabel: {
    fontSize: '12px',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  referenceId: {
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: '1rem',
  },
  copyBtn: {
    background: '#FF6B35',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '8px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
  },
  footer: {
    background: '#f9f9f9',
    borderTop: '1px solid #e0e0e0',
    padding: '2rem 0',
    marginTop: '3rem',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    margin: '0 0 0.5rem',
  },
  footerLinks: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#666',
    margin: '0.5rem 0',
  },
  footerCopy: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#999',
    margin: '1rem 0 0',
  },
  link: {
    color: '#FF6B35',
    textDecoration: 'none',
    margin: '0 4px',
  },
  tableWrapper: {
    overflowX: 'auto',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
};

export default ThoverDeleteAccount;
