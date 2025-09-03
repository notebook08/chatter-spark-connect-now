import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

interface VideoCallScreenProps {
  onEndCall: () => void;
  onCallEnded: (profile?: any) => void;
}

export const VideoCallScreen = ({ onEndCall, onCallEnded }: VideoCallScreenProps) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const handleEndCall = () => {
    onEndCall();
    // Simulate showing profile after call
    setTimeout(() => {
      onCallEnded({ username: "Match User", age: 25 });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Video Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="w-full h-full bg-gray-900 rounded-none">
          <div className="w-full h-full flex items-center justify-center text-white">
            {isVideoOff ? (
              <div className="text-center">
                <div className="text-6xl mb-4">👤</div>
                <p>{t('videoCall.videoOff')}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📹</div>
                <p>{t('videoCall.connecting')}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex space-x-4">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            className="w-12 h-12 rounded-full"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            onClick={() => setIsVideoOff(!isVideoOff)}
            variant={isVideoOff ? "destructive" : "secondary"}
            size="icon"
            className="w-12 h-12 rounded-full"
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>

          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="icon"
            className="w-12 h-12 rounded-full"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};