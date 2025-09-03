import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Search } from "lucide-react";

export interface ChatPreview {
  id: string;
  username: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface ChatListScreenProps {
  chats: ChatPreview[];
  onOpenChat: (chatId: string) => void;
}

export const ChatListScreen = ({ chats, onOpenChat }: ChatListScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('chat.title')}</h1>
          <Button variant="outline" size="icon">
            <Search className="w-5 h-5" />
          </Button>
        </div>
        
        {chats.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('chat.noChats')}</h3>
            <p className="text-muted-foreground">{t('chat.noChatsText')}</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <Card 
                key={chat.id} 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onOpenChat(chat.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate">{chat.username}</h3>
                      <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  
                  {chat.unreadCount > 0 && (
                    <div className="bg-primary text-primary-foreground text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};