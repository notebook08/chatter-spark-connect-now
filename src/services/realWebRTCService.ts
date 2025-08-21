import { WebRTCUtils } from '../utils/webrtcUtils';
import { webrtcDiagnostics } from '../utils/webrtcDiagnostics';

interface SignalingMessage {
  type: 'offer' | 'answer' | 'ice-candidate';
  data: any;
  to_user_id: string;
  from_user_id: string;
  call_session_id: string;
}

export class RealWebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private userId: string;
  private partnerId: string | null = null;
  private callSessionId: string | null = null;
  private reconnectionAttempts: number = 0;
  private readonly MAX_RECONNECTION_ATTEMPTS = 3;
  private readonly ICE_RESTART_TIMEOUT = 5000;

  constructor(userId: string) {
    this.userId = userId;
  }

  async initializeConnection(): Promise<boolean> {
    try {
      console.log('🚀 Initializing WebRTC connection...');
      
      // Run quick diagnostic first
      const diagnostic = await webrtcDiagnostics.quickDiagnostic();
      if (!diagnostic.canProceed) {
        console.error('❌ Pre-flight checks failed:', diagnostic.blockers);
        throw new Error(`WebRTC initialization blocked: ${diagnostic.blockers.join(', ')}`);
      }
      
      console.log('✅ Pre-flight checks passed');

      // Check WebRTC support
      if (!WebRTCUtils.isWebRTCSupported()) {
        throw new Error('WebRTC is not supported in this browser');
      }

      // Ensure secure context
      if (!WebRTCUtils.isSecureContext()) {
        throw new Error('Secure context (HTTPS) required for WebRTC');
      }

      // Create peer connection with improved configuration
      const config = WebRTCUtils.getICEServers();
      console.log('🔧 Creating peer connection with config:', config);
      
      this.peerConnection = new RTCPeerConnection(config);
      
      // Set up enhanced connection monitoring
      this.setupConnectionStateHandling();
      this.setupICEHandling();
      
      console.log('✅ WebRTC connection initialized successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Failed to initialize WebRTC connection:', error);
      
      // Run full diagnostics on failure
      console.log('🔍 Running full diagnostics to identify the issue...');
      const fullReport = await webrtcDiagnostics.runFullDiagnostics();
      
      // Log critical failures
      if (fullReport.summary.criticalFailures.length > 0) {
        console.error('🚨 Critical failures detected:', fullReport.summary.criticalFailures);
      }
      
      throw new Error(`Connection initialization failed: ${error.message}`);
    }
  }

  private setupConnectionStateHandling(): void {
    if (!this.peerConnection) return;

    this.peerConnection.onconnectionstatechange = () => {
      console.log(`Connection state changed to: ${this.peerConnection?.connectionState}`);
      
      switch (this.peerConnection?.connectionState) {
        case 'connected':
          console.log('✅ Connection established successfully');
          this.reconnectionAttempts = 0; // Reset counter on successful connection
          this.onConnectionEstablished?.();
          break;
          
        case 'disconnected':
          console.log('⚠️ Connection lost, attempting to reconnect...');
          this.handleDisconnection();
          break;
          
        case 'failed':
          console.error('❌ Connection failed');
          this.handleConnectionFailure();
          break;
          
        case 'closed':
          console.log('Connection closed');
          this.cleanup();
          this.onCallEnded?.();
          break;
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteStream = event.streams[0];
      this.onRemoteStream?.(this.remoteStream);
    };
  }

  private setupICEHandling(): void {
    if (!this.peerConnection) return;

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.partnerId) {
        this.sendSignalingMessage('ice-candidate', {
          candidate: event.candidate.toJSON()
        });
      }
    };

    this.peerConnection.onicegatheringstatechange = () => {
      console.log(`ICE gathering state: ${this.peerConnection?.iceGatheringState}`);
    };

    this.peerConnection.oniceconnectionstatechange = () => {
      console.log(`ICE connection state: ${this.peerConnection?.iceConnectionState}`);
      
      if (this.peerConnection?.iceConnectionState === 'failed') {
        this.handleICEFailure();
      }
    };
  }

  private async handleDisconnection(): Promise<void> {
    if (this.reconnectionAttempts >= this.MAX_RECONNECTION_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      this.handleConnectionFailure();
      return;
    }

    this.reconnectionAttempts++;
    console.log(`Reconnection attempt ${this.reconnectionAttempts}/${this.MAX_RECONNECTION_ATTEMPTS}`);

    try {
      await this.restartICE();
    } catch (error) {
      console.error('Failed to reconnect:', error);
      setTimeout(() => this.handleDisconnection(), this.ICE_RESTART_TIMEOUT);
    }
  }

  private async restartICE(): Promise<void> {
    if (!this.peerConnection || !this.partnerId) return;

    try {
      const offer = await this.peerConnection.createOffer({ iceRestart: true });
      await this.peerConnection.setLocalDescription(offer);
      
      await this.sendSignalingMessage('offer', { sdp: offer.sdp });
      
      console.log('ICE restart initiated successfully');
    } catch (error) {
      console.error('ICE restart failed:', error);
      throw error;
    }
  }

  private handleICEFailure(): void {
    console.log('Handling ICE failure...');
    this.handleDisconnection();
  }

  private handleConnectionFailure(): void {
    this.onError?.('Connection failed after multiple attempts');
    this.cleanup();
  }

  private cleanup(): void {
    console.log('Cleaning up WebRTC resources...');
    
    // Stop all media tracks
    this.localStream?.getTracks().forEach(track => {
      track.stop();
      console.log(`Stopped local track: ${track.kind}`);
    });
    
    this.remoteStream?.getTracks().forEach(track => {
      track.stop();
      console.log(`Stopped remote track: ${track.kind}`);
    });
    
    // Close and cleanup peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    // Reset state
    this.localStream = null;
    this.remoteStream = null;
    this.partnerId = null;
    this.callSessionId = null;
    this.reconnectionAttempts = 0;
  }

  // Signaling methods
  private async sendSignalingMessage(type: string, data: any): Promise<void> {
    if (!this.callSessionId || !this.partnerId) {
      throw new Error('Cannot send signaling message: missing session or partner ID');
    }

    const message: SignalingMessage = {
      type: type as 'offer' | 'answer' | 'ice-candidate',
      data: data,
      to_user_id: this.partnerId,
      from_user_id: this.userId,
      call_session_id: this.callSessionId
    };

    try {
      // Implementation of actual sending mechanism would go here
      console.log('Sending signaling message:', message);
    } catch (error) {
      console.error('Failed to send signaling message:', error);
      throw error;
    }
  }

  // Public methods
  async initializeMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Add tracks to peer connection if it exists
      if (this.peerConnection && this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }
      
      return this.localStream;
    } catch (error: any) {
      let errorMessage = 'Failed to access media devices';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Please allow camera and microphone access';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera or microphone found';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Media device is already in use';
      }
      
      throw new Error(errorMessage);
    }
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error('Connection not initialized');
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Failed to create offer:', error);
      throw error;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Connection not initialized');
    }

    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (error) {
      console.error('Failed to handle answer:', error);
      throw error;
    }
  }

  async addICECandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (!this.peerConnection) {
      throw new Error('Connection not initialized');
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error('Failed to add ICE candidate:', error);
      throw error;
    }
  }

  setPartnerAndSession(partnerId: string, sessionId: string): void {
    this.partnerId = partnerId;
    this.callSessionId = sessionId;
  }

  disconnect(): void {
    this.cleanup();
  }

  // Fixed methods with proper signatures and media initialization
  async createCall(callType: 'video' | 'voice'): Promise<string> {
    this.callSessionId = `call_${Date.now()}_${Math.random()}`;
    
    // Initialize connection and media
    await this.initializeConnection();
    
    // Get user media based on call type
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: callType === 'video'
    };
    
    await this.initializeMedia(constraints);
    
    console.log(`✅ Created ${callType} call with ID: ${this.callSessionId}`);
    return this.callSessionId;
  }

  async joinCall(callId: string, callType: 'video' | 'voice'): Promise<void> {
    this.callSessionId = callId;
    
    // Initialize connection and media
    await this.initializeConnection();
    
    // Get user media based on call type
    const constraints: MediaStreamConstraints = {
      audio: true,
      video: callType === 'video'
    };
    
    await this.initializeMedia(constraints);
    
    console.log(`✅ Joined ${callType} call with ID: ${callId}`);
  }

  async endCall(): Promise<void> {
    this.cleanup();
    this.onCallEnded?.();
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  async toggleAudio(): Promise<void> {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }

  async toggleVideo(): Promise<void> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }

  // Event handlers
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionEstablished?: () => void;
  onCallEnded?: () => void;
  onError?: (error: string) => void;
}