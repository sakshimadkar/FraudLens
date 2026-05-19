class AudioNotifier {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    playTone(freq, type, duration, vol, startTime) {
        if (this.muted) return;
        this.init();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
        
        // Smooth transition
        gain.gain.setValueAtTime(0, this.ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }

    playSuccess() {
        if (this.muted) return;
        // Soft chime (major third interval)
        this.playTone(523.25, 'sine', 0.5, 0.1, 0);    // C5
        this.playTone(659.25, 'sine', 0.6, 0.1, 0.1);  // E5
    }

    playWarning() {
        if (this.muted) return;
        // Low, slightly dissonant tone
        this.playTone(200, 'triangle', 0.6, 0.15, 0);
        this.playTone(190, 'triangle', 0.6, 0.15, 0);
    }
}

export const audioNotifier = new AudioNotifier();
