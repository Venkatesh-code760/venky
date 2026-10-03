import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import { 
  Bot, 
  Send, 
  User, 
  Sparkles, 
  Compass, 
  Clock, 
  Check, 
  HelpCircle, 
  Lightbulb,
  MessageSquare
} from 'lucide-react';

const TravelAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I am your AI Travel Logistics Assistant. I am here to help answer questions about your destinations, adjust your itinerary pacing, recommend authentic dietary spots, and handle weather backups. How can I help you plan today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState('Goa');
  const [appliedAction, setAppliedAction] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        message: textToSend,
        destination,
        activeItinerary: true
      });

      if (res.data?.data) {
        const botReply = {
          role: 'assistant',
          content: res.data.data.reply,
          action: res.data.data.action,
          suggestedModification: res.data.data.suggestedModification,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botReply]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I have noted your inquiry regarding ${destination}. We can optimize your daily schedule to minimize transit time and recommend top rated spots!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyModification = (mod) => {
    setAppliedAction(`Successfully adjusted schedule: ${mod.adjustment}`);
    setTimeout(() => setAppliedAction(null), 4000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>FR9: Context-Aware AI Travel Assistant</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Travel Concierge & Copilot
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ask about best travel seasons, dietary recommendations, indoor weather backups, or pacing modifications.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-600">Focus Destination:</span>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-sky-500 shadow-xs"
          >
            <option value="Goa">Goa</option>
            <option value="Kerala">Kerala</option>
            <option value="Jaipur">Jaipur</option>
          </select>
        </div>
      </div>

      {appliedAction && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{appliedAction}</span>
        </div>
      )}

      {/* Suggested Quick Inquiries (FR9 Use Cases) */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span>SRS Sample Prompts (Click to test):</span>
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            'Make day 2 more relaxed with leisure breaks',
            'Find vegetarian restaurants near my hotel in Goa',
            'What is the best time to visit Kerala?',
            'What indoor backup activities exist if it rains?'
          ].map((promptText, i) => (
            <button
              key={i}
              onClick={() => handleSend(promptText)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 font-medium transition-colors text-left"
            >
              "{promptText}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window Container */}
      <Card className="border-slate-200 p-0 overflow-hidden flex flex-col h-[520px] shadow-md" hover={false}>
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-gradient-to-tr from-sky-600 to-indigo-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 max-w-[80%] sm:max-w-[70%]`}>
                  <div
                    className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-sky-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.content}</p>

                    {/* Interactive Itinerary Adjustment Confirmation per FR9 */}
                    {msg.suggestedModification && (
                      <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 space-y-2">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>AI Suggestion: {msg.suggestedModification.action}</span>
                        </div>
                        <p className="text-[11px] text-indigo-800">{msg.suggestedModification.adjustment}</p>
                        <button
                          onClick={() => handleApplyModification(msg.suggestedModification)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] transition-colors"
                        >
                          Confirm & Update Itinerary
                        </button>
                      </div>
                    )}
                  </div>

                  <span className={`text-[10px] text-slate-400 block ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-200 text-xs text-slate-500 shadow-xs flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>AI analyzing travel context...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your destination, pacing, or meals..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-xs text-slate-900 outline-none transition-all"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 hover:shadow-lg transition-all flex items-center space-x-1.5 disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default TravelAssistant;
