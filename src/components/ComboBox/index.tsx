'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { sendMessageToThreadStream } from '@/utils/threadService'; // Ensure this path is correct
import { useAtom } from 'jotai';
import { footerVisibilityAtom, responseMessageLengthAtom } from '@/utils/store';

interface ComboBoxProps {
  assistantId: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({ assistantId }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1); // -1 means no selection
  const [, setFooterVisible] = useAtom(footerVisibilityAtom);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const suggestions: string[] = ["Who is Christopher?", "What can you do?", "What are your hobbies?"];
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setResponseMessageLength] = useAtom(responseMessageLengthAtom);

  useEffect(() => {
    if (responseMessage) {
      setResponseMessageLength(responseMessage.length);
    }
  }, [responseMessage, setResponseMessageLength]);

  // Retrieve cached response on component mount and input change
  useEffect(() => {
    const cachedResponse = localStorage.getItem("chatResponse");
    if (cachedResponse) {
      setResponseMessage(cachedResponse);
    }
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) return; 
    
    const value = event.target.value;
    setIsFilled(value.length > 0);
    setInputValue(value); 
    setFilteredSuggestions(suggestions.filter(suggestion =>
     !value || suggestion.toLowerCase().includes(value.toLowerCase())
    ));
  };

  const generateNewThreadId = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_URL;
    const controller = new AbortController();
    const signal = controller.signal;
  
    try {
      const response = await fetch(`${baseUrl}/api/thread`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: signal
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Extract threadId from Set-Cookie header if available
      const setCookie = response.headers.get('set-cookie');
      if (setCookie && setCookie.includes('threadId')) {
        const matches = setCookie.match(/threadId=([^;]+)/);
        if (matches && matches[1]) {
          console.log("Extracted threadId from Set-Cookie:", matches[1]);
          return matches[1]; // Use the threadId from the cookie
        }
      }
  
      return data.threadId; // Assuming the thread ID is returned like this
  
    } catch (error) {
      console.error('Failed to generate new thread ID:', error);
      return null; // Handle errors or define fallback behavior
    }
  };

  const sendMessage = async (message: string) => {
    // Reset message and set loading state before any asynchronous operation
    setLoading(true);
    setResponseMessage(null);
    setInputValue('');  // Clear input field immediately
    setIsFocused(false);
    setIsFilled(false);

    try {
     // Generate a new thread ID with timeout
     const threadIdPromise = generateNewThreadId();
     const timeoutPromise = new Promise<string | null>(resolve => {
       setTimeout(() => resolve(null), 1000); // 5 seconds timeout
     });

     const threadId = await Promise.race([threadIdPromise, timeoutPromise]);

     // Ensure a valid threadId is obtained before proceeding
     if (!threadId) {
       setResponseMessage('Failed to obtain thread ID in time.');
       setLoading(false);
       return;
     }

      // Close existing event source if one exists
      if (eventSource) {
        eventSource.close();
        setLoading(false); 
        setEventSource(null);
      }

      const newEventSource = await sendMessageToThreadStream(threadId, message, [], assistantId);
      setEventSource(newEventSource);

      setResponseMessage(null);
      setLoading(true);

      newEventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);

        // Update local state
        setResponseMessage(prevMessages => {
          const updatedMessages = prevMessages ? `${prevMessages}${newMessage.value}` : newMessage.value;

          // Save to localStorage
          localStorage.setItem("chatResponse", updatedMessages);

          return updatedMessages;
        });

      };

      newEventSource.onerror = () => {
        newEventSource.close();
        setLoading(false);
      };

    } catch (error) {
      console.error('Failed to send message:', error);
      setResponseMessage('Failed to send message');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
        sendMessage(filteredSuggestions[selectedIndex]);
        setSelectedIndex(-1); // Reset selection
      } else if (inputValue.trim() !== '') {
        sendMessage(inputValue.trim());
      }
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent cursor movement
      let newIndex = selectedIndex;
      if (e.key === 'ArrowDown') {
        newIndex = (selectedIndex + 1) % filteredSuggestions.length;
      } else if (e.key === 'ArrowUp') {
        newIndex = (selectedIndex - 1 + filteredSuggestions.length) % filteredSuggestions.length;
      }
      setSelectedIndex(newIndex);
      setInputValue(filteredSuggestions[newIndex]); // Update input value
      setIsFilled(filteredSuggestions.length > 0);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };


  const handleButtonClick = () => {
    // If the input value is empty and the input is not focused, focus the input.
    if (inputValue.trim() === '' && !isFocused) {
      inputRef.current?.focus();
      return; // Exit the function after focusing the input.
    }
  
    // If the input has a value, simulate pressing Enter to send the message.
    if (inputValue.trim() !== '') {
      handleKeyPress({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setFooterVisible(false);
  };

  const handleBlur = () => {
    // Delay the blur action to allow the click event to fire on the suggestions.
    setTimeout(() => {
      setIsFocused(false);
      setFooterVisible(true);
    }, 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setIsFocused(false);
    setFooterVisible(true);
    setIsFilled(suggestion.length > 0);
    sendMessage(suggestion);
   
  };

  useEffect(() => {
    if (inputValue === '') {
      setFilteredSuggestions(suggestions);
    }
  }, [inputValue]);

  // Cleanup EventSource when component unmounts
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [eventSource]);
  

  return (
    <div className="relative flex flex-col space-y-2 max-w-[500px] justify-center items-center">
      <div className="flex items-center relative w-full">
        <input
          ref={inputRef}
          id="queryInput"
          className="peer p-2 pt-5 px-4 w-full min-w-[270px] text-base border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none disabled:bg-gray-200 dark:border-zinc-700 dark:bg-transparent dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 dark:disabled:bg-zinc-700"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          list="suggestions"
          autoComplete="off"
          disabled={loading}
        />
        <button 
          aria-label="Send message"
          disabled={loading}
          className="absolute bottom-3 md:bottom-1.5 right-3 md:right-2 bg-black dark:bg-white rounded-lg border border-black p-0.5 text-white transition-colors disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:bottom-3 md:right-3"
          onClick={handleButtonClick}
        >
          <span data-state="closed">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white dark:text-black">
              <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </span>
        </button>
      </div>
      <label
        htmlFor="queryInput"
        className={`absolute left-4 transition-all text-gray-500 dark:text-gray-400 ${isFocused || isFilled ? '-top-1 text-xs text-blue-500' : 'top-2 text-sm text-gray-500'}`}
      >
        Ask me anything...
      </label>
      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute text-left z-50 w-full md:mt-10 top-12 md:top-10 left-0 mt-1 p-2 bg-white dark:bg-custom-light-gray dark:text-white border border-gray-300 rounded-md">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              className={`w-full text-left block p-2 ${index === selectedIndex ? 'bg-zinc-700' : ''} dark:hover:bg-zinc-700 cursor-pointer`}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      {loading && <p aria-live="polite" aria-atomic="true" className="text-sm text-gray-500 dark:text-gray-400">Sending...</p>}
      <div className={`relative text-left w-full mt-6 flex-1 px-4 whitespace-pre-wrap border rounded-lg border-gray-300 dark:border-zinc-700 ${!responseMessage ? 'opacity-0' : ''}`}>
        {responseMessage ? (
          <p className="text-sm" dangerouslySetInnerHTML={{ __html: responseMessage
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/^- (.*)/gm, "<li>$1</li>")
              .replace(/<li>/, "<ul class='list-disc pl-5'><li>")
              .replace(/<\/li>$/, "</li></ul>") }} />
        ) : (
          <p className="text-sm">Passionate, creative, motivated.</p>
        )}
      </div>
    </div>
  );
};

export default ComboBox;
