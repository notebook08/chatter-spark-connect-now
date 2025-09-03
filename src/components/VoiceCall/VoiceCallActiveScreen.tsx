import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface VoiceCallActiveScreenProps {
  onEndCall: () => void;
  onCallComplete: (profile?: any) => void;
}

export const VoiceCallActiveScreen = ({ onEndCall, onCallComplete }: VoiceCallActiveScreenProps) => {
  const { t } = useTranslation();
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeMuted, setIsVolumeMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simulate connection delay
    const connectTimer = setTimeout(() => {
      setIsConnected(true);
    }, 3000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (isConnected) {
      const timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    onEndCall();
    // Simulate showing profile after call
    setTimeout(() => {
      onCallComplete({ username: "Voice Match", age: 27 });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center bg-white/10 backdrop-blur-lg border-white/20">
        {/* Avatar */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-6xl">🎧</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            {isConnected ? t('voiceCall.connected') : t('voiceCall.connecting')}
          </h2>
          
          {isConnected ? (
            <div className="text-white/80">
              <p className="mb-1">{t('voiceCall.duration')}: {formatDuration(duration)}</p>
            </div>
          ) : (
            <div className="flex justify-center items-center space-x-1 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-6 mb-8">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 border-white/30 hover:bg-white/30"
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            onClick={() => setIsVolumeMuted(!isVolumeMuted)}
            variant={isVolumeMuted ? "destructive" : "secondary"}
            size="icon"
            className="w-14 h-14 rounded-full bg-white/20 border-white/30 hover:bg-white/30"
          >
            {isVolumeMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </Button>

          <Button
            onClick={handleEndCall}
            variant="destructive"
            size="icon"
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-6 h-6" />
          </Button>
        </div>

        {/* Status */}
        <div className="text-sm text-white/60">
          {isMuted && <p>{t('voiceCall.micMuted')}</p>}
          {isVolumeMuted && <p>{t('voiceCall.volumeMuted')}</p>}
        </div>
      </Card>
    </div>
  );
};