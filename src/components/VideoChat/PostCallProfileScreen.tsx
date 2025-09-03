import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, X, MessageCircle } from "lucide-react";

interface PostCallProfileScreenProps {
  profile: any;
  onLike: () => void;
  onPass: () => void;
  onMessage: () => void;
  onClose: () => void;
}

export const PostCallProfileScreen = ({ 
  profile, 
  onLike, 
  onPass, 
  onMessage, 
  onClose 
}: PostCallProfileScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold">{profile?.username || "User"}</h2>
            <p className="text-muted-foreground">{profile?.age || "25"} years old</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold mb-2">{t('profile.bio')}</h3>
              <p className="text-muted-foreground">
                {profile?.bio || t('postCall.defaultBio')}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button onClick={onPass} variant="outline" size="icon" className="flex-1 h-12">
              <X className="w-6 h-6 text-red-500" />
            </Button>
            
            <Button onClick={onMessage} variant="outline" size="icon" className="flex-1 h-12">
              <MessageCircle className="w-6 h-6 text-blue-500" />
            </Button>
            
            <Button onClick={onLike} size="icon" className="flex-1 h-12 bg-red-500 hover:bg-red-600">
              <Heart className="w-6 h-6 text-white" />
            </Button>
          </div>

          <Button onClick={onClose} variant="ghost" className="w-full mt-4">
            {t('common.close')}
          </Button>
        </Card>
      </div>
    </div>
  );
};