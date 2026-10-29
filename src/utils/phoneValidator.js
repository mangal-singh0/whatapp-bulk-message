/**
 * Utility functions for Phone Number Parsing, Cleaning and Validation
 */

/**
 * Clean and validate a list of raw phone strings
 * @param {string} rawText - Raw input text from textarea
 * @param {string} defaultCountryCode - e.g. "91"
 */
export function parseAndValidateNumbers(rawText, defaultCountryCode = '91') {
  if (!rawText || !rawText.trim()) {
    return {
      items: [],
      stats: { total: 0, valid: 0, duplicates: 0, invalid: 0 },
      validList: []
    };
  }

  // Split by newline, comma, semicolon, pipe, tab or space
  const rawTokens = rawText
    .split(/[\r\n,;| \t]+/)
    .map(token => token.trim())
    .filter(token => token.length > 0);

  const total = rawTokens.length;
  const seenNumbers = new Set();
  let duplicateCount = 0;
  let invalidCount = 0;
  let validCount = 0;

  const items = [];
  const validList = [];

  const cleanCountryCode = (defaultCountryCode || '91').replace(/\D/g, '');

  for (let i = 0; i < rawTokens.length; i++) {
    const raw = rawTokens[i];
    
    // Strip everything except digits
    let digitsOnly = raw.replace(/\D/g, '');

    // Handle leading zeros (e.g. 09876543210 -> 9876543210)
    if (digitsOnly.startsWith('0') && digitsOnly.length > 10) {
      digitsOnly = digitsOnly.replace(/^0+/, '');
    }

    let finalNumber = digitsOnly;
    let isValid = false;

    // Validation logic:
    // Case 1: Exactly 10 digits -> Add default country code
    if (digitsOnly.length === 10) {
      finalNumber = cleanCountryCode + digitsOnly;
      isValid = true;
    }
    // Case 2: Number already includes country code (between 11 and 15 digits)
    else if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
      // If it starts with 0, strip and check
      if (digitsOnly.startsWith('0')) {
        digitsOnly = digitsOnly.replace(/^0+/, '');
        if (digitsOnly.length === 10) {
          finalNumber = cleanCountryCode + digitsOnly;
          isValid = true;
        } else if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
          finalNumber = digitsOnly;
          isValid = true;
        }
      } else {
        finalNumber = digitsOnly;
        isValid = true;
      }
    }
    // Case 3: Less than 10 or greater than 15 digits -> Invalid
    else {
      isValid = false;
      finalNumber = digitsOnly;
    }

    if (!isValid) {
      invalidCount++;
      items.push({
        id: `num-${i}-${Date.now()}`,
        raw,
        cleaned: finalNumber,
        formatted: raw,
        isValid: false,
        isDuplicate: false,
        status: 'pending'
      });
      continue;
    }

    // Check for duplicates among valid numbers
    if (seenNumbers.has(finalNumber)) {
      duplicateCount++;
      items.push({
        id: `num-${i}-${Date.now()}`,
        raw,
        cleaned: finalNumber,
        formatted: formatPhoneNumber(finalNumber),
        isValid: true,
        isDuplicate: true,
        status: 'pending'
      });
    } else {
      seenNumbers.add(finalNumber);
      validCount++;
      const itemObj = {
        id: `num-${i}-${Date.now()}`,
        raw,
        cleaned: finalNumber,
        formatted: formatPhoneNumber(finalNumber),
        isValid: true,
        isDuplicate: false,
        status: 'pending'
      };
      items.push(itemObj);
      validList.push(itemObj);
    }
  }

  return {
    items,
    validList,
    stats: {
      total,
      valid: validCount,
      duplicates: duplicateCount,
      invalid: invalidCount
    }
  };
}

/**
 * Helper to visually format phone number nicely (e.g. +91 98765 43210)
 */
export function formatPhoneNumber(cleaned) {
  if (!cleaned) return '';
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return `+${cleaned}`;
}

/**
 * Build WhatsApp Web or Desktop URL
 */
export function buildWhatsAppUrl(phoneNumber, message, isDesktopApp = false) {
  const encodedText = encodeURIComponent(message || '');
  const baseUrl = isDesktopApp
    ? 'https://api.whatsapp.com/send'
    : 'https://web.whatsapp.com/send';
  
  return `${baseUrl}?phone=${phoneNumber}&text=${encodedText}`;
}
