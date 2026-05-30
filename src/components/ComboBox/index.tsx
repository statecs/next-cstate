'use client';

import React, { useState, useRef, useEffect, useMemo, KeyboardEvent } from 'react';
import { sendMessageToResponseStream, sendMessageToClaudeAPI, textToSpeech } from '@/utils/threadService';
import { useAtom } from 'jotai';
import { footerVisibilityAtom, responseMessageLengthAtom } from '@/utils/store';
import { Volume2Icon, PauseIcon, LoaderIcon } from 'lucide-react';
import VoiceInput from '../VoiceInput';

const SUGGESTIONS: string[] = [
  "What's your approach to accessibility?",
  'Walk me through your latest project',
  'How do you use AI in design?',
];

const ComboBox: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [, setFooterVisible] = useAtom(footerVisibilityAtom);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const responseMessageRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setResponseMessageLength] = useAtom(responseMessageLengthAtom);
  const [selectedModel, setSelectedModel] = useState<string>('assistant');

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [isVoiceInputActive, setIsVoiceInputActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const filtered = useMemo(
    () =>
      SUGGESTIONS.filter(
        s => !inputValue.trim() || s.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [inputValue]
  );

  const showSuggestList = isFocused && filtered.length > 0 && !loading && !responseMessage;

  const getPreviousResponseId = () => localStorage.getItem('previousResponseId');

  useEffect(() => {
    responseMessageRef.current = responseMessage;
  }, [responseMessage]);

  useEffect(() => {
    if (responseMessage) setResponseMessageLength(responseMessage.length);
  }, [responseMessage, setResponseMessageLength]);

  // Retrieve cached response on mount
  useEffect(() => {
    const cachedResponse = localStorage.getItem('chatResponse');
    if (cachedResponse) setResponseMessage(cachedResponse);
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event) return;
    setInputValue(event.target.value);
  };

  const sendMessage = async (message: string) => {
    setLoading(true);
    setResponseMessageLength(1);
    setResponseMessage(null);
    setInputValue('');

    try {
      const response = await sendMessageToResponseStream(message, getPreviousResponseId());
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response body');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = JSON.parse(line.slice(6));
          if (data.type === 'delta') {
            setResponseMessage(prev => {
              const updated = prev ? `${prev}${data.value}` : data.value;
              localStorage.setItem('chatResponse', updated);
              return updated;
            });
          } else if (data.type === 'done') {
            localStorage.setItem('previousResponseId', data.responseId);
            setLoading(false);
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setResponseMessage('Failed to send message');
      setLoading(false);
    }
  };

  const sendMessageToClaude = async (message: string) => {
    setLoading(true);
    setResponseMessage(null);
    setInputValue('');

    try {
      const response = await sendMessageToClaudeAPI(message);
      setResponseMessage(response);
      localStorage.setItem('chatResponse', response);
    } catch (error) {
      console.error('Failed to send message to Claude:', error);
      setResponseMessage('Failed to send message to Claude');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (selectedModel === 'claude') {
      await sendMessageToClaude(message);
    } else {
      await sendMessage(message);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (showSuggestList && highlightIdx >= 0 && highlightIdx < filtered.length) {
        e.preventDefault();
        handleSuggestionClick(filtered[highlightIdx]);
        setHighlightIdx(-1);
        setIsFocused(false);
        return;
      }
      if (inputValue.trim() !== '') {
        handleSendMessage(inputValue.trim());
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      if (!showSuggestList) return;
      e.preventDefault();
      setHighlightIdx(prev => (prev + 1) % filtered.length);
      return;
    }
    if (e.key === 'ArrowUp') {
      if (!showSuggestList) return;
      e.preventDefault();
      setHighlightIdx(prev => (prev - 1 + filtered.length) % filtered.length);
      return;
    }
    if (e.key === 'Escape') {
      setIsFocused(false);
      setHighlightIdx(-1);
    }
  };

  const handleButtonClick = () => {
    if (inputValue.trim() === '') {
      inputRef.current?.focus();
      return;
    }
    handleSendMessage(inputValue.trim());
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setFooterVisible(true);
    handleSendMessage(suggestion);
  };

  useEffect(() => {
    const onAskShow = () => {
      setResponseMessage(null);
      localStorage.removeItem('chatResponse');
      window.setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 0);
    };
    document.addEventListener('aurora:ask-show', onAskShow);
    return () => document.removeEventListener('aurora:ask-show', onAskShow);
  }, []);

  useEffect(() => {
    // Reset highlight when filtered list changes (typing narrows the list)
    setHighlightIdx(-1);
  }, [filtered.length]);

  useEffect(() => {
    (window as any).copyCode = (id: string) => {
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

  const handleTextToSpeech = async () => {
    if (!responseMessage) return;
    try {
      setIsLoading(true);
      if (!audioUrl) {
        const audioBlob = await textToSpeech(responseMessage);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load();
        }
      }
      if (audioRef.current) {
        if (isPlaying) audioRef.current.pause();
        else await audioRef.current.play();
        setIsPlaying(!isPlaying);
      }
    } catch (error) {
      console.error('Failed to handle text to speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.onended = () => setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  useEffect(() => {
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [responseMessage]);

  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
    setResponseMessage(null);
  };

  const handleAssistantResponse = (response: string) => {
    setResponseMessage(response);
    responseMessageRef.current = response;
    localStorage.setItem('chatResponse', response);
  };

  const handleVoiceInputState = (isActive: boolean) => setIsVoiceInputActive(isActive);

  const hideSuggestions = loading || !!responseMessage;

  return (
    <div className="aurora-ama-form">
      <div className="aurora-ama-input">
        <input
          ref={inputRef}
          id="queryInput"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={() => {
            setIsFocused(true);
            setFooterVisible(false);
          }}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false);
              setHighlightIdx(-1);
              setFooterVisible(true);
            }, 180);
          }}
          placeholder="Ask me anything about my work…"
          autoComplete="off"
          disabled={loading}
          aria-label="Ask me anything"
          aria-autocomplete="list"
          aria-expanded={showSuggestList}
          aria-controls="aurora-ama-suggest-list"
          aria-activedescendant={
            showSuggestList && highlightIdx >= 0
              ? `aurora-ama-suggest-${highlightIdx}`
              : undefined
          }
          role="combobox"
        />
        <VoiceInput
          onVoiceInput={handleVoiceInput}
          onAssistantResponse={handleAssistantResponse}
          onVoiceInputStateChange={handleVoiceInputState}
        />
        <button
          type="button"
          aria-label="Send message"
          disabled={loading || inputValue.trim() === ''}
          className="aurora-ama-send"
          onClick={handleButtonClick}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showSuggestList && (
          <ul
            id="aurora-ama-suggest-list"
            role="listbox"
            className="aurora-ama-suggest"
          >
            {filtered.map((s, i) => (
              <li key={s} role="presentation">
                <button
                  id={`aurora-ama-suggest-${i}`}
                  type="button"
                  role="option"
                  aria-selected={highlightIdx === i}
                  onMouseEnter={() => setHighlightIdx(i)}
                  onMouseDown={e => e.preventDefault() /* keep input focused */}
                  onClick={() => {
                    handleSuggestionClick(s);
                    setIsFocused(false);
                    setHighlightIdx(-1);
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!hideSuggestions && (
        <div className="aurora-ama-pills" role="group" aria-label="Suggested questions">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestionClick(s)}
              disabled={loading}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="aurora-ama-modeltabs-wrap">
        <span className="aurora-ama-modeltabs-label" aria-hidden="true">Model</span>
        <div className="aurora-ama-modeltabs" role="group" aria-label="Assistant model">
          <button
            type="button"
            aria-pressed={selectedModel === 'assistant'}
            onClick={() => setSelectedModel('assistant')}
          >
            GPT
          </button>
          <button
            type="button"
            aria-pressed={selectedModel === 'claude'}
            onClick={() => setSelectedModel('claude')}
          >
            Claude
          </button>
        </div>
      </div>

      {loading && (
        <p aria-live="polite" aria-atomic="true" className="aurora-ama-loading">
          Sending…
        </p>
      )}

      {responseMessage && (
        <div className="aurora-ama-response">
          <p
            dangerouslySetInnerHTML={{
              __html: responseMessage
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/^- (.*)/gm, '<li>$1</li>')
                .replace(/<li>/, "<ul class='list-disc pl-5 whitespace-normal'><li>")
                .replace(/<\/li>$/, '</li></ul>')
                .replace(/```(\w+)?\s*([\s\S]*?)```/g, (_, lang, content) => {
                  const trimmedContent = content.trim();
                  const escapedContent = trimmedContent
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                  const language = lang
                    ? `<div class="text-sm font-semibold truncate" style="color:var(--aurora-muted)">${lang}</div>`
                    : '';
                  const id = Math.random().toString(36).substr(2, 9);
                  return `
                    <div class="relative flex flex-col rounded-md overflow-hidden my-4 w-full max-w-full" style="background:rgba(0,0,0,.35);border:1px solid var(--aurora-line)">
                      <div class="flex justify-between items-center p-2 max-h-5 overflow-hidden" style="background:rgba(255,255,255,.04)">
                        <div class="flex-grow mr-2 overflow-hidden">${language}</div>
                        <button onclick="window.copyCode('${id}')" class="flex-shrink-0 text-xs font-bold py-0.5 px-1.5 rounded inline-flex items-center" style="color:var(--aurora-muted)">
                          <svg class="fill-current w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M17 6h-5V2H7C5.346 2 4 3.346 4 5v10c0 1.654 1.346 3 3 3h10c1.654 0 3-1.346 3-3V9a3 3 0 00-3-3zm1 9c0 .551-.449 1-1 1H7c-.551 0-1-.449-1-1V5c0-.551.449-1 1-1h4v3h6v8z"/></svg>
                          <span class="hidden sm:inline">Copy</span>
                        </button>
                      </div>
                      <pre id="${id}">${escapedContent}</pre>
                    </div>
                  `.trim();
                })
                .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full h-auto" />')
                .replace(
                  /\[([^\]]+)\]\(([^)]+)\)/g,
                  '<a href="$2" target="_blank" rel="noopener noreferrer">$1<svg class="ml-1 h-4 w-4 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>'
                ),
            }}
          />
          {!isVoiceInputActive && (
            <button
              onClick={handleTextToSpeech}
              className="aurora-ama-audio-btn"
              aria-label={isPlaying ? 'Audio playing' : isLoading ? 'Loading audio' : 'Play audio'}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderIcon className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <PauseIcon className="h-4 w-4" />
              ) : (
                <Volume2Icon className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      )}

      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ComboBox;
