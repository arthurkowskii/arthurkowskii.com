/**
 * Client-side Form Validation Utilities
 * Provides secure input validation for form elements
 */

/**
 * Validation rules and patterns
 */
export const ValidationRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  
  url: {
    pattern: /^https?:\/\/.+$/,
    message: 'Please enter a valid HTTP or HTTPS URL'
  },
  
  text: {
    pattern: /^.{1,100}$/,
    message: 'Text must be between 1 and 100 characters'
  },
  
  longText: {
    pattern: /^[\s\S]{1,1000}$/,
    message: 'Text must be between 1 and 1000 characters'
  },
  
  bio: {
    pattern: /^[\s\S]{1,5000}$/,
    message: 'Bio must be between 1 and 5000 characters'
  },
  
  filename: {
    pattern: /^[a-zA-Z0-9._-]+$/,
    message: 'Filename can only contain letters, numbers, dots, hyphens, and underscores'
  }
};

/**
 * Sanitize input value
 * @param {string} value - Input value to sanitize
 * @param {string} type - Type of input (text, email, url, etc.)
 * @returns {string} Sanitized value
 */
export function sanitizeInput(value, type = 'text') {
  if (!value || typeof value !== 'string') {
    return '';
  }
  
  // Basic XSS prevention - remove script tags and event handlers
  let sanitized = value
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:text\/html/gi, '');
  
  // Type-specific sanitization
  switch (type) {
    case 'email':
      // Remove any HTML tags from email
      sanitized = sanitized.replace(/<[^>]*>/g, '').trim();
      break;
      
    case 'url':
      // Ensure URL starts with http/https
      sanitized = sanitized.trim();
      if (sanitized && !sanitized.match(/^https?:\/\//)) {
        sanitized = 'https://' + sanitized;
      }
      break;
      
    case 'text':
    case 'longText':
    case 'bio':
      // Allow basic formatting but remove dangerous content
      sanitized = sanitized.trim();
      break;
      
    case 'filename':
      // Strict filename sanitization
      sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 255);
      break;
  }
  
  return sanitized;
}

/**
 * Validate input value against rules
 * @param {string} value - Value to validate
 * @param {string} type - Validation type
 * @param {object} customRules - Custom validation rules
 * @returns {object} Validation result
 */
export function validateInput(value, type = 'text', customRules = {}) {
  const rules = { ...ValidationRules, ...customRules };
  const rule = rules[type];
  
  if (!rule) {
    return { isValid: true, message: '' };
  }
  
  const sanitizedValue = sanitizeInput(value, type);
  const isValid = rule.pattern.test(sanitizedValue);
  
  return {
    isValid,
    message: isValid ? '' : rule.message,
    sanitizedValue
  };
}

/**
 * Validate entire form
 * @param {HTMLFormElement} form - Form element to validate
 * @param {object} fieldRules - Validation rules for each field
 * @returns {object} Form validation result
 */
export function validateForm(form, fieldRules = {}) {
  if (!(form instanceof HTMLFormElement)) {
    return { isValid: false, errors: ['Invalid form element'] };
  }
  
  const formData = new FormData(form);
  const errors = [];
  const sanitizedData = {};
  
  // Validate each field
  for (const [fieldName, value] of formData.entries()) {
    const fieldType = fieldRules[fieldName] || 'text';
    const validation = validateInput(value, fieldType);
    
    if (!validation.isValid) {
      errors.push(`${fieldName}: ${validation.message}`);
    }
    
    sanitizedData[fieldName] = validation.sanitizedValue;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}

/**
 * Add real-time validation to form elements
 * @param {HTMLElement} container - Container with form elements
 * @param {object} fieldRules - Validation rules for fields
 */
export function attachValidation(container, fieldRules = {}) {
  if (!container) return;
  
  const inputs = container.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    const fieldName = input.name;
    const fieldType = fieldRules[fieldName] || 'text';
    
    // Add validation on blur
    input.addEventListener('blur', (e) => {
      const validation = validateInput(e.target.value, fieldType);
      
      // Remove existing error messages
      const existingError = input.parentElement.querySelector('.validation-error');
      if (existingError) {
        existingError.remove();
      }
      
      // Add error message if validation failed
      if (!validation.isValid) {
        const errorElement = document.createElement('div');
        errorElement.className = 'validation-error';
        errorElement.textContent = validation.message;
        errorElement.style.color = '#dc2626';
        errorElement.style.fontSize = '14px';
        errorElement.style.marginTop = '4px';
        
        input.parentElement.appendChild(errorElement);
        input.style.borderColor = '#dc2626';
      } else {
        input.style.borderColor = '';
      }
      
      // Update input value with sanitized version
      if (validation.sanitizedValue !== e.target.value) {
        e.target.value = validation.sanitizedValue;
      }
    });
    
    // Add input event for real-time feedback
    input.addEventListener('input', (e) => {
      // Remove error styling on input
      const errorElement = input.parentElement.querySelector('.validation-error');
      if (errorElement) {
        errorElement.style.opacity = '0.6';
      }
      input.style.borderColor = '';
    });
  });
}

/**
 * Secure form submission handler
 * @param {HTMLFormElement} form - Form to handle
 * @param {object} options - Submission options
 * @returns {Promise} Submission promise
 */
export async function secureFormSubmit(form, options = {}) {
  const {
    fieldRules = {},
    endpoint,
    method = 'POST',
    onSuccess = () => {},
    onError = () => {}
  } = options;
  
  // Prevent default form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm(form, fieldRules);
    
    if (!validation.isValid) {
      onError(validation.errors);
      return;
    }
    
    try {
      // Submit sanitized data
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest' // CSRF protection
        },
        body: JSON.stringify(validation.sanitizedData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      onSuccess(result);
      
    } catch (error) {
      onError(['Submission failed: ' + error.message]);
    }
  });
}