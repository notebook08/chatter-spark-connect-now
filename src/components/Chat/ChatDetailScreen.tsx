import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface ChatData {
  id: string;
  username: string;
  isOnline: boolean;
  messages: Message[];
}

interface ChatDetailScreenProps {
  chat: ChatData;
  onBack: () => void;
  onSendMessage: (message: string) => void;
  onStartCall: () => void;
  onStartVideoCall: () => void;
}

export const ChatDetailScreen = ({ 
  chat, 
  onBack, 
  onSendMessage, 
  onStartCall, 
  onStartVideoCall 
}: ChatDetailScreenProps) => {
  const { t } = useTranslation();
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
                </div>
                {chat.isOnline && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background"></div>
                )}
              </div>
              
              <div>
                <h2 className="font-semibold">{chat.username}</h2>
                <p className="text-xs text-muted-foreground">
                  {chat.isOnline ? t('chat.online') : t('chat.offline')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={onStartCall}>
              <Phone className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onStartVideoCall}>
              <Video className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`p-3 max-w-[80%] ${
              message.isOwn 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted'
            }`}>
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
              }`}>
                {message.timestamp}
              </p>
            </Card>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t('chat.typeMessage')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button onClick={handleSend} size="icon" className="rounded-full">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};