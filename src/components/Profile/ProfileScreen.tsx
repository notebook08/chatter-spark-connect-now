import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings, Edit, Crown } from "lucide-react";

interface ProfileScreenProps {
  profile: any;
  onEdit: () => void;
  onUpgradePremium: () => void;
}

export const ProfileScreen = ({ profile, onEdit, onUpgradePremium }: ProfileScreenProps) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-4">
        <Card className="p-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>
            <h1 className="text-2xl font-bold">{profile?.username || "User"}</h1>
            {profile?.isPremium && (
              <div className="flex items-center justify-center mt-2">
                <Crown className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">{t('profile.premium')}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">{t('profile.bio')}</h3>
              <p className="text-muted-foreground">{profile?.bio || t('profile.noBio')}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">{t('profile.interests')}</h3>
              <div className="flex flex-wrap gap-2">
                {profile?.interests?.length ? (
                  profile.interests.map((interest: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground">{t('profile.noInterests')}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={onEdit} variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              {t('profile.edit')}
            </Button>
            {!profile?.isPremium && (
              <Button onClick={onUpgradePremium} className="flex-1">
                <Crown className="w-4 h-4 mr-2" />
                {t('profile.upgradePremium')}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};