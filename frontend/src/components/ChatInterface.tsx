
import React, { useState, useRef } from 'react';
import { Send, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "hey bestie! ready to spill the tea? i'm here to listen and support you through anything 💜",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
  
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
  
    // 🔗 Make real API call to your FastAPI backend
    const apiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
    fetch(`${apiBase}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user_input: text.trim() })
    })
      .then(res => res.json())
      .then(data => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      })
      .catch(err => {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: "⚠️ Something went wrong while contacting the therapist.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
        setIsTyping(false);
        console.error("Error:", err);
      });
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // In a real app, you'd send this to a speech-to-text service
        sendMessage("voice message received! (speech recognition coming soon) 🎤");
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-pink-200">
      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.isUser
                  ? 'bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-pink-200">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="what's on your mind bestie? 💭"
              className="rounded-full border-pink-300 focus:border-pink-400 focus:ring-pink-400"
              disabled={isRecording}
            />
          </div>
          
          {/* Voice button */}
          <Button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            variant="outline"
            size="icon"
            className={`rounded-full border-2 transition-all ${
              isRecording 
                ? 'border-red-400 bg-red-50 text-red-600 animate-pulse' 
                : 'border-pink-400 hover:bg-pink-50 text-pink-600'
            }`}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Send button */}
          <Button
            type="submit"
            disabled={!inputValue.trim() || isRecording}
            className="rounded-full bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white shadow-lg disabled:opacity-50"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          {isRecording ? 'recording your vibes... tap to stop 🔴' : 'your safe space to be real 💜'}
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
