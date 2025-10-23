import React, { useState, useEffect, useRef } from 'react';

/**
 * Ultra-simple character-by-character typing animation component
 */
const TypingText = ({ lines, typingSpeed = 50, lineDelay = 200, getLineStyle, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const animationRef = useRef(null);
  
  // Update the ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (lines.length === 0) return;
    
    // Clear any existing animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Reset and start typing
    setIsTyping(true);
    setDisplayedText('');
    setCurrentIndex(0);
    
    const allText = lines.join('\n');
    let index = 0;
    
    const typeNextChar = () => {
      if (index >= allText.length) {
        setIsTyping(false);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
        return;
      }
      
      setDisplayedText(allText.substring(0, index + 1));
      index++;
      
      animationRef.current = setTimeout(typeNextChar, typingSpeed);
    };
    
    // Start typing after a short delay
    animationRef.current = setTimeout(typeNextChar, 100);
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [lines, typingSpeed]); // Removed onComplete from dependencies

  // Split the displayed text back into lines for rendering
  const displayedLines = displayedText.split('\n');

  return (
    <div>
      {displayedLines.map((line, index) => {
        const originalLine = lines[index] || '';
        const lineStyle = getLineStyle ? getLineStyle(originalLine) : '';
        const isCurrentLine = index === displayedLines.length - 1;
        const isCurrentLineTyping = isCurrentLine && isTyping && currentIndex < lines.join('\n').length;
        
        // Special handling for the cat command line
        if (originalLine === "xynq@invertbox:~$ cat welcome_message.txt" || originalLine === "xynq@invertbox:~$ cat 欢迎信息.txt") {
          return (
            <div key={index} className={`terminal-line ${lineStyle}`}>
              {originalLine.includes('欢迎信息') ? 
                <>xynq@invertbox:~$ cat <span style={{color: '#888888'}}>欢迎信息.txt</span></> :
                <>xynq@invertbox:~$ cat <span style={{color: '#888888'}}>welcome_message.txt</span></>
              }
              {isCurrentLineTyping && <span className="cursor">█</span>}
            </div>
          );
        }
        
        return (
          <div key={index} className={`terminal-line ${lineStyle}`}>
            {line}
            {isCurrentLineTyping && <span className="cursor">█</span>}
          </div>
        );
      })}
    </div>
  );
};

export default TypingText;
