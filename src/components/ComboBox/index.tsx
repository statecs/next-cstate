'use client';

import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { sendMessageToThread } from '@/utils/threadService'; // Ensure this path is correct

interface ComboBoxProps {
  threadId: string;
  assistantId: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({ threadId, assistantId }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const suggestions: string[] = ["Who is Christopher?", "What can I do?", "What are my hobbies?"];
  const inputRef = useRef<HTMLInputElement>(null);

  // Retrieve cached response on component mount and input change
  useEffect(() => {
    const cachedResponse = localStorage.getItem("chatResponse");
    if (cachedResponse) {
      setResponseMessage(cachedResponse);
    }
  }, [inputValue]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsFilled(e.target.value.length > 0);
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      setLoading(true);
      setResponseMessage(null); // Reset response message on new request
      try {
        const response = await sendMessageToThread(threadId, inputValue, [], assistantId);
        localStorage.setItem("chatResponse", response); // Cache the response
        setResponseMessage(response); // Assume the response contains a 'message' field
        setInputValue('');
        setIsFocused(false);
        setIsFilled(false);
      } catch (error) {
        console.error('Failed to send message:', error);
        setResponseMessage('Failed to send message'); // Display error feedback
      } finally {
        setLoading(false);
      }
    }
  };

  const handleButtonClick = () => {
    if (inputValue.trim() === '') {
      inputRef.current?.focus();
    } else {
      handleKeyPress({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="relative flex flex-col space-y-2 max-w-[700px] justify-center items-center">
      <div className="flex items-center relative w-full">
        <input
          ref={inputRef}
          id="queryInput"
          className="peer p-2 pt-5 w-full min-w-[270px] border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none disabled:bg-gray-200 dark:border-zinc-700 dark:bg-transparent dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-300 dark:disabled:bg-zinc-700"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=" "
          list="suggestions"
          disabled={loading}
        />
        <button 
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
        className={`absolute left-3 transition-all text-gray-500 dark:text-gray-400 ${isFocused || isFilled ? '-top-1 text-xs text-blue-500' : 'top-2 text-sm text-gray-500'}`}
      >
        Ask me anything...
      </label>
      <datalist id="suggestions">
        {suggestions.map((suggestion, index) => (
          <option key={index} value={suggestion} />
        ))}
      </datalist>
      {loading && <p className="text-sm text-gray-500 dark:text-gray-400">Sending...</p>}
      {responseMessage && (
        <div className="relative mt-6 flex-1 px-4 sm:px-6 whitespace-pre-wrap">
          <p className="text-sm text-green-500 dark:text-green-400">{responseMessage}</p>
        </div>
      )}
    </div>
  );
  
};

export default ComboBox;
