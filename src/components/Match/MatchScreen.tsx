import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Heart } from "lucide-react";

interface Match {
  id: string;
  username: string;
  age: number;
  photo?: string;
  lastSeen?: string;
}

interface MatchScreenProps {
  matches: Match[];
  onStartChat: (matchId: string) => void;
  onViewProfile: (matchId: string) => void;
}

export const MatchScreen = ({ matches, onStartChat, onViewProfile }: MatchScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('matches.title')}</h1>
        
        {matches.length === 0 ? (
          <Card className="p-8 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('matches.noMatches')}</h3>
            <p className="text-muted-foreground">{t('matches.noMatchesText')}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{match.username}</h3>
                    <p className="text-sm text-muted-foreground">{match.age} years old</p>
                    {match.lastSeen && (
                      <p className="text-xs text-muted-foreground">{t('matches.lastSeen')}: {match.lastSeen}</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => onViewProfile(match.id)}
                      variant="outline" 
                      size="sm"
                    >
                      {t('common.view')}
                    </Button>
                    
                    <Button 
                      onClick={() => onStartChat(match.id)}
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {t('matches.chat')}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};