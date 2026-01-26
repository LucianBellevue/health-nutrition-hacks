import { FAQItem } from '@/components/FAQSection';

/**
 * Extract FAQ items from MDX content
 * Looks for FAQSection components with items prop
 * 
 * Example:
 * <FAQSection
 *   items={[
 *     { question: "...", answer: "..." }
 *   ]}
 * />
 */
export function extractFAQsFromMDX(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Pattern to match FAQSection components
  // Handles multiline and various formatting styles
  const faqSectionRegex = /<FAQSection\s+([\s\S]*?)\s*\/>/g;
  
  let match;
  while ((match = faqSectionRegex.exec(content)) !== null) {
    const attributes = match[1];
    
    // Try to extract items prop - handles both JSX object and array syntax
    // Pattern: items={[...]} or items={[{...}]}
    // Use balanced brace matching to handle nested structures
    const itemsPropMatch = attributes.match(/items\s*=\s*\{/);
    
    if (itemsPropMatch) {
      const startIndex = itemsPropMatch.index! + itemsPropMatch[0].length;
      let braceDepth = 1;
      let i = startIndex;
      let inString = false;
      let stringChar = '';
      
      // Find the matching closing brace by tracking depth
      while (i < attributes.length && braceDepth > 0) {
        const char = attributes[i];
        const prevChar = i > 0 ? attributes[i - 1] : '';
        
        // Handle string literals (don't count braces inside strings)
        if ((char === '"' || char === "'") && prevChar !== '\\') {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
            stringChar = '';
          }
        } else if (!inString) {
          if (char === '{') {
            braceDepth++;
          } else if (char === '}') {
            braceDepth--;
          }
        }
        
        i++;
      }
      
      if (braceDepth === 0) {
        // Extract the content between the braces
        const itemsString = attributes.slice(startIndex, i - 1).trim();
      
        // Try to parse as JSON-like structure
        // Handle both array literal and object literal syntax
        try {
          // Clean up the string - remove comments, handle JSX syntax
          const cleaned = itemsString
            .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
            .replace(/\/\/.*$/gm, '') // Remove line comments
            .trim();
          
          // If it starts with [, it's an array
          if (cleaned.startsWith('[')) {
            // Try to extract individual FAQ objects
            const faqObjects = extractFAQObjectsFromArray(cleaned);
            faqs.push(...faqObjects);
          }
        } catch (error) {
          console.warn('Failed to parse FAQ items:', error);
        }
      } else {
        // Brace matching failed - malformed JSX
        console.warn('Failed to extract FAQ items: unbalanced braces in items prop');
      }
    }
  }
  
  return faqs;
}

/**
 * Extract FAQ objects from array string
 * Handles various formatting styles
 */
function extractFAQObjectsFromArray(arrayString: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  
  // Remove outer brackets
  const inner = arrayString.slice(1, -1).trim();
  
  // Split by objects - look for { ... } patterns
  // This is a simple parser that handles basic cases
  let depth = 0;
  let currentObject = '';
  let inString = false;
  let stringChar = '';
  
  for (let i = 0; i < inner.length; i++) {
    const char = inner[i];
    const prevChar = i > 0 ? inner[i - 1] : '';
    
    // Handle string literals
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = '';
      }
      currentObject += char;
      continue;
    }
    
    if (inString) {
      currentObject += char;
      continue;
    }
    
    // Track object depth
    if (char === '{') {
      depth++;
      currentObject += char;
    } else if (char === '}') {
      depth--;
      currentObject += char;
      
      // If we've closed an object, try to parse it
      if (depth === 0 && currentObject.trim()) {
        const faq = parseFAQObject(currentObject.trim());
        if (faq) {
          faqs.push(faq);
        }
        currentObject = '';
      }
    } else if (depth > 0) {
      currentObject += char;
    } else if (char === ',' && currentObject.trim()) {
      // End of object, parse it
      const faq = parseFAQObject(currentObject.trim());
      if (faq) {
        faqs.push(faq);
      }
      currentObject = '';
    } else if (depth === 0 && char.trim()) {
      currentObject += char;
    }
  }
  
  // Handle last object if any
  if (currentObject.trim()) {
    const faq = parseFAQObject(currentObject.trim());
    if (faq) {
      faqs.push(faq);
    }
  }
  
  return faqs;
}

/**
 * Parse a single FAQ object string into FAQItem
 * Handles: { question: "...", answer: "..." }
 */
function parseFAQObject(objString: string): FAQItem | null {
  try {
    // Extract question
    const questionMatch = objString.match(/question\s*:\s*["']([^"']*)["']/);
    // Also handle JSX template strings and multiline
    const questionMatch2 = objString.match(/question\s*:\s*["']([^"']*(?:\\.[^"']*)*)["']/s);
    const question = questionMatch?.[1] || questionMatch2?.[1];
    
    // Extract answer - handle multiline strings
    const answerMatch = objString.match(/answer\s*:\s*["']([^"']*(?:\\.[^"']*)*)["']/s);
    const answer = answerMatch?.[1];
    
    if (question && answer) {
      // Unescape strings
      return {
        question: question.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\n/g, '\n').trim(),
        answer: answer.replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\n/g, '\n').trim(),
      };
    }
  } catch (error) {
    console.warn('Failed to parse FAQ object:', error);
  }
  
  return null;
}

/**
 * Extract FAQs from post metadata (JSON format)
 * Used as fallback or for posts stored in metadata
 */
export function extractFAQsFromMetadata(metadata: unknown): FAQItem[] {
  if (!metadata || typeof metadata !== 'object' || metadata === null) {
    return [];
  }
  
  const metadataObj = metadata as { faqs?: unknown };
  const faqs = metadataObj.faqs;
  if (!Array.isArray(faqs)) {
    return [];
  }
  
  return faqs
    .filter((faq: unknown): faq is { question: string; answer: string } => 
      typeof faq === 'object' && faq !== null && 'question' in faq && 'answer' in faq && typeof (faq as { question: unknown }).question === 'string' && typeof (faq as { answer: unknown }).answer === 'string'
    )
    .map((faq) => ({
      question: String(faq.question).trim(),
      answer: String(faq.answer).trim(),
    }));
}
