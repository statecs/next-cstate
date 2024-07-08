'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { sendMessageToThreadStream, sendMessageToClaudeAPI } from '@/utils/threadService'; // Ensure this path is correct
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
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [, setFooterVisible] = useAtom(footerVisibilityAtom);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const suggestions: string[] = ["Who is Christopher?", "What can you do?", "What are your hobbies?"];
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setResponseMessageLength] = useAtom(responseMessageLengthAtom);
  const [selectedModel, setSelectedModel] = useState<string>("assistant"); // New state for model selection
  const selectRef = useRef<HTMLSelectElement>(null);

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
    // Function to get the threadId from localStorage
    const getThreadIdFromLocalStorage = () => {
      return localStorage.getItem('threadId');
    };

    // Check if threadId exists in localStorage
    let threadId = getThreadIdFromLocalStorage();

    // If threadId exists in localStorage, use it
    if (threadId) {
      return threadId;
    }

    // Otherwise, make the API call to get a new threadId
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

      // Store threadId in localStorage
      localStorage.setItem('threadId', data.threadId);
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
        setTimeout(() => resolve(null), 2000); // 5 seconds timeout
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

        if (newMessage.error === "Internal Server Error") {
          setResponseMessage("Oops! Our API decided to take a coffee break. While it's sipping espresso, why not grab a book? Who knows, you might learn something before our code remembers how to function. Error: \"Failed to receive message\" (and basic manners, apparently).");
          newEventSource.close();
          setLoading(false);
          return;
        }

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
        handleSendMessage(filteredSuggestions[selectedIndex]);
        setSelectedIndex(-1);
      } else if (inputValue.trim() !== '') {
        handleSendMessage(inputValue.trim());
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
  
    if (inputValue.trim() !== '') {
      handleSendMessage(inputValue.trim());
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

    if (selectedModel === "claude") {
      sendMessageToClaude(suggestion);
    } else {
     sendMessage(suggestion);
    }
   
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

useEffect(() => {
  window.copyCode = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const range = document.createRange();
      range.selectNodeContents(el);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
      }
    }
  };
}, []);

const sendMessageToClaude = async (message: string) => {
  setLoading(true);
  setResponseMessage(null);
  setInputValue('');
  setIsFocused(false);
  setIsFilled(false);

  try {
    const response = await sendMessageToClaudeAPI(message);
    
    // Update local state
    setResponseMessage(response);

    // Save to localStorage
    localStorage.setItem("chatResponse", response);

  } catch (error) {
    console.error('Failed to send message to Claude:', error);
    setResponseMessage('Failed to send message to Claude');
  } finally {
    setLoading(false);
  }
};

  const handleSendMessage = async (message: string) => {
    if (selectedModel === "claude") {
      await sendMessageToClaude(message);
    } else {
      await sendMessage(message);
    }
  };

  const adjustSelectWidth = () => {
    if (selectRef.current) {
      const selectedOption = selectRef.current.options[selectRef.current.selectedIndex];
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.fontSize = '10px'; // Match the font size of your select
      tempSpan.textContent = selectedOption.textContent;
      document.body.appendChild(tempSpan);
      const width = tempSpan.getBoundingClientRect().width;
      document.body.removeChild(tempSpan);
      selectRef.current.style.width = `${width + 25}px`; // Add some padding
    }
  };

  useEffect(() => {
    adjustSelectWidth();
  }, [selectedModel]);

  return (
    <>
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
      
      <div className="w-full flex justify-start items-center">
      <label htmlFor="assistant-select" className="sr-only text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
        Assistant:
      </label>
      <div className="flex flex-row items-center space-x-1">
        <div className="relative inline-block -mt-2 mb-1">
          <select
           ref={selectRef}
            id="assistant-select"
            value={selectedModel}
            onChange={(e) => {
              setSelectedModel(e.target.value);
              adjustSelectWidth();
            }}
            className="
              w-auto py-0.5 pl-1 pr-4 text-[10px]
              text-gray-500 dark:text-gray-400 
              bg-transparent
              border-none outline-none
              cursor-pointer
              appearance-none
              transition-all duration-300
              hover:bg-gray-100 dark:hover:bg-zinc-700
              focus:bg-gray-100 dark:focus:bg-zinc-700
              rounded-md
            "
          >
            <option value="assistant">GPT-4o</option>
            <option value="claude">Sonnet 3.5</option>
          </select>
          <div className="pointer-events-none absolute pt-1 inset-y-0 right-0 flex items-center text-gray-500 dark:text-gray-400">
            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
      {loading && <p aria-live="polite" aria-atomic="true" className="text-sm text-gray-500 dark:text-gray-400">Sending...</p>}
      <div className={`relative text-left w-full mt-6 flex-1 px-4 whitespace-pre-wrap border rounded-lg border-gray-300 dark:border-zinc-700 ${!responseMessage ? 'opacity-0' : ''}`}>
      {responseMessage ? (
  <p
    className="text-sm"
    dangerouslySetInnerHTML={{
      __html: responseMessage
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/^- (.*)/gm, "<li>$1</li>")
        .replace(/<li>/, "<ul class='list-disc pl-5'><li>")
        .replace(/<\/li>$/, "</li></ul>")
        .replace(/```(\w+)?\s*([\s\S]*?)```/g, (_, lang, content) => {
          const trimmedContent = content.trim();
          const escapedContent = trimmedContent
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
          const language = lang
            ? `<div class="text-sm font-semibold dark:text-gray-300 truncate">${lang}</div>`
            : '';
          const id = Math.random().toString(36).substr(2, 9);
          return `
            <div class="relative flex flex-col bg-zinc-50 dark:bg-custom-light-gray border dark:border-zinc-700 rounded-md overflow-hidden my-4 w-full max-w-full">
              <div class="flex justify-between items-center p-2 bg-gray-100 dark:bg-zinc-700 max-h-5 overflow-hidden">
                <div class="flex-grow mr-2 overflow-hidden">
                  ${language}
                </div>
                <button onclick="window.copyCode('${id}')" class="flex-shrink-0 text-xs dark:hover:bg-gray-500 dark:text-gray-200 font-bold py-0.5 px-1.5 rounded inline-flex items-center">
                  <svg class="fill-current w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17 6h-5V2H7C5.346 2 4 3.346 4 5v10c0 1.654 1.346 3 3 3h10c1.654 0 3-1.346 3-3V9a3 3 0 00-3-3zm1 9c0 .551-.449 1-1 1H7c-.551 0-1-.449-1-1V5c0-.551.449-1 1-1h4v3h6v8z"/></svg>
                  <span class="hidden sm:inline">Copy</span>
                </button>
              </div>
              <pre id="${id}" class="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-gray-800 dark:text-gray-200 max-h-60 bg-zinc-50 dark:bg-custom-light-gray">${escapedContent}</pre>
            </div>
          `.trim();
        })
       
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full h-auto" />')
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g, 
          '<a href="$2" class="underline underline-offset-4 dark:text-white hover:text-gray-400 inline-flex items-center" target="_blank" rel="noopener noreferrer">$1<svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>'
        ) }}
          />
        ) : (
          <p className="text-sm">Passionate, creative, motivated.</p>
        )}
      </div>
    </div>
    </>
  );
};

export default ComboBox;
