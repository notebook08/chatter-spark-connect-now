
import { useState, useEffect, useRef } from 'react';
import { Send, Users, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'stranger';
  timestamp: Date;
}

const randomNames = [
  'Alex', 'Jordan', 'Sam', 'Casey', 'Riley', 'Morgan', 'Taylor', 'Avery',
  'Quinn', 'Dakota', 'Skyler', 'Phoenix', 'River', 'Sage', 'Blake', 'Charlie'
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [strangerName, setStrangerName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToStranger = () => {
    setIsConnecting(true);
    setMessages([]);
    
    setTimeout(() => {
      const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
      setStrangerName(randomName);
      setIsConnected(true);
      setIsConnecting(false);
      
      // Stranger sends a greeting
      setTimeout(() => {
        const greetings = [
          "Hey there! How's it going?",
          "Hi! Nice to meet you 👋",
          "Hello! What's up?",
          "Hey! How are you doing today?",
          "Hi there! Ready to chat?"
        ];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        setMessages([{
          id: Date.now().toString(),
          text: greeting,
          sender: 'stranger',
          timestamp: new Date()
        }]);
      }, 1000);
    }, 2000);
  };

  const sendMessage = () => {
    if (!currentMessage.trim() || !isConnected) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'me',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Simulate stranger typing and responding
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        "That's interesting! Tell me more.",
        "I see what you mean 🤔",
        "Really? That's cool!",
        "Haha, that's funny! 😄",
        "I totally agree with you.",
        "That's a great point!",
        "I never thought about it that way.",
        "Thanks for sharing that!",
        "What do you think about...?",
        "That reminds me of something similar."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      const strangerMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'stranger',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, strangerMessage]);
    }, Math.random() * 3000 + 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setMessages([]);
    setStrangerName('');
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Random Chat
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Connect with strangers from around the world</p>
        </div>

        {/* Main Chat Interface */}
        <Card className="overflow-hidden shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isConnected ? (
                  <>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Connected to {strangerName}</span>
                  </>
                ) : isConnecting ? (
                  <>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Connecting...</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="font-semibold">Not connected</span>
                  </>
                )}
              </div>
              
              {isConnected ? (
                <Button
                  onClick={disconnect}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              ) : (
                <Button
                  onClick={connectToStranger}
                  disabled={isConnecting}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 disabled:opacity-50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </Button>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {!isConnected && !isConnecting && (
              <div className="text-center text-gray-500 mt-16">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">Ready to meet someone new?</p>
                <p>Click "Connect" to start chatting with a random stranger!</p>
              </div>
            )}

            {isConnecting && (
              <div className="text-center text-gray-500 mt-16">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium">Finding someone to chat with...</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                    message.sender === 'me'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-md'
                      : 'bg-white border rounded-bl-md'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-2xl rounded-bl-md px-4 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Connect to start chatting"}
                disabled={!isConnected}
                className="flex-1 rounded-full border-2 focus:border-blue-500 transition-colors"
              />
              <Button
                onClick={sendMessage}
                disabled={!isConnected || !currentMessage.trim()}
                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Be respectful and kind to strangers. Have fun chatting!</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
