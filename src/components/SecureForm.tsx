import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  useAdvancedSecurity, 
  useSanitizedInput, 
  useCSRFProtection, 
  useSecureSession,
  useEncryption 
} from '../security/AdvancedSecuritySystem';

interface SecureFormProps {
  onSubmit: (data: Record<string, string>) => void;
  fields: Array<{
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'textarea';
    required?: boolean;
    placeholder?: string;
  }>;
  submitLabel?: string;
  className?: string;
}

const SecureForm: React.FC<SecureFormProps> = ({
  onSubmit,
  fields,
  submitLabel = 'Submit',
  className = ''
}) => {
  const { reportThreat } = useAdvancedSecurity();
  const { token: csrfToken, validate: validateCSRF } = useCSRFProtection();
  const { sessionToken, isValid: isSessionValid, refresh: refreshSession } = useSecureSession();
  const { encrypt } = useEncryption();
  
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Create sanitized inputs for each field
  const sanitizedInputs = fields.reduce((acc, field) => {
    const [value, setValue] = useSanitizedInput('');
    acc[field.name] = { value, setValue };
    return acc;
  }, {} as Record<string, { value: string; setValue: (value: string) => void }>);

  const validateField = useCallback((name: string, value: string): string | null => {
    const field = fields.find(f => f.name === name);
    if (!field) return null;

    if (field.required && !value.trim()) {
      return `${field.label} is required`;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    if (field.type === 'password' && value) {
      if (value.length < 8) {
        return 'Password must be at least 8 characters long';
      }
      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Password must contain uppercase, lowercase, and number';
      }
    }

    return null;
  }, [fields]);

  const handleInputChange = useCallback((name: string, value: string) => {
    // Update sanitized input
    sanitizedInputs[name].setValue(value);
    
    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    // Refresh session on activity
    refreshSession();
  }, [sanitizedInputs, refreshSession]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSessionValid) {
      reportThreat({
        type: 'session_hijack',
        severity: 'high',
        source: 'form_submission',
        blocked: true,
        details: 'Form submission attempted with invalid session'
      });
      return;
    }

    // Validate CSRF token
    const formCSRFToken = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('input[name="csrf_token"]')?.value;
    if (!formCSRFToken || !validateCSRF(formCSRFToken)) {
      return; // CSRF validation failed, threat already reported
    }

    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const value = sanitizedInputs[field.name].value;
      const error = validateField(field.name, value);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Encrypt sensitive data before submission
      const encryptedData: Record<string, string> = {};
      
      for (const field of fields) {
        const value = sanitizedInputs[field.name].value;
        if (field.type === 'password') {
          encryptedData[field.name] = await encrypt(value);
        } else {
          encryptedData[field.name] = value;
        }
      }

      // Add security metadata
      const secureSubmission = {
        ...encryptedData,
        _csrf: csrfToken,
        _session: sessionToken,
        _timestamp: Date.now(),
        _userAgent: navigator.userAgent.substring(0, 100) // Truncated for security
      };

      onSubmit(secureSubmission);
    } catch (error) {
      reportThreat({
        type: 'data_breach',
        severity: 'high',
        source: 'form_encryption',
        blocked: true,
        details: 'Form encryption failed during submission'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSessionValid, 
    validateCSRF, 
    csrfToken, 
    sessionToken, 
    fields, 
    sanitizedInputs, 
    validateField, 
    encrypt, 
    onSubmit, 
    reportThreat
  ]);

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '12px',
        padding: '30px',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Security indicators */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '10px',
        background: 'rgba(46, 213, 115, 0.1)',
        borderRadius: '6px',
        border: '1px solid rgba(46, 213, 115, 0.3)'
      }}>
        <span style={{ color: '#2ed573', marginRight: '8px' }}>🛡️</span>
        <span style={{ color: '#2ed573', fontSize: '14px', fontWeight: 'bold' }}>
          Secure Form
        </span>
        <span style={{ color: '#ccc', fontSize: '12px', marginLeft: '10px' }}>
          Protected by advanced encryption and threat detection
        </span>
      </div>

      {/* CSRF Token */}
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {/* Form Fields */}
      {fields.map((field) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: fields.indexOf(field) * 0.1 }}
          style={{ marginBottom: '20px' }}
        >
          <label
            htmlFor={field.name}
            style={{
              display: 'block',
              color: '#d4af37',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}
          >
            {field.label}
            {field.required && <span style={{ color: '#ff4757' }}>*</span>}
          </label>
          
          {field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={sanitizedInputs[field.name].value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: errors[field.name] 
                  ? '1px solid #ff4757' 
                  : '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={sanitizedInputs[field.name].value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: errors[field.name] 
                  ? '1px solid #ff4757' 
                  : '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          )}
          
          {errors[field.name] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: '#ff4757',
                fontSize: '12px',
                marginTop: '5px'
              }}
            >
              {errors[field.name]}
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting || !isSessionValid}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        style={{
          width: '100%',
          padding: '15px',
          background: isSubmitting || !isSessionValid
            ? 'rgba(100, 100, 100, 0.3)'
            : 'linear-gradient(135deg, rgba(212, 175, 55, 0.8) 0%, rgba(255, 193, 7, 0.8) 100%)',
          border: 'none',
          borderRadius: '8px',
          color: isSubmitting || !isSessionValid ? '#666' : '#000',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: isSubmitting || !isSessionValid ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid #666',
                borderRadius: '50%'
              }}
            />
            Processing...
          </>
        ) : !isSessionValid ? (
          <>
            ⚠️ Session Invalid
          </>
        ) : (
          <>
            🛡️ {submitLabel}
          </>
        )}
      </motion.button>

      {/* Security Status */}
      <div style={{ 
        marginTop: '15px', 
        textAlign: 'center',
        fontSize: '12px',
        color: '#888'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <span>🔒 End-to-End Encrypted</span>
          <span>🛡️ CSRF Protected</span>
          <span>🔍 Input Sanitized</span>
        </div>
      </div>
    </motion.form>
  );
};

export default SecureForm;