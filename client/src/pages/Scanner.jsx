import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Link as LinkIcon, MessageSquare, Image as ImageIcon, UploadCloud, X, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import ScanCard from '../components/ScanCard';
import Tesseract from 'tesseract.js';
import { audioNotifier } from '../utils/audio';

const Scanner = () => {
    const { api } = useAuth();
    const [content, setContent] = useState('');
    const [type, setType] = useState('message');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isMuted, setIsMuted] = useState(audioNotifier.muted);
    
    const toggleMute = () => {
        setIsMuted(audioNotifier.toggleMute());
    };
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) processImage(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) processImage(file);
        else toast.error('Please upload a valid image file');
    };

    const processImage = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setContent('');
            setResult(null);
        };
        reader.readAsDataURL(file);
    };

    const clearImage = () => {
        setImagePreview(null);
        setContent('');
        setResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const extractTextFromImage = async () => {
        if (!imagePreview) return null;
        setOcrLoading(true);
        try {
            const { data: { text } } = await Tesseract.recognize(imagePreview, 'eng');
            setContent(text);
            return text;
        } catch (error) {
            toast.error('Failed to extract text from image');
            return null;
        } finally {
            setOcrLoading(false);
        }
    };

    const handleScan = async (e) => {
        e.preventDefault();
        
        let finalContent = content;

        if (type === 'image') {
            if (!imagePreview) return toast.error('Please upload an image first');
            finalContent = await extractTextFromImage();
            if (!finalContent || !finalContent.trim()) {
                return toast.error('No readable text found in the image');
            }
        } else {
            if (!content.trim()) return toast.error('Please enter some content');
        }

        setLoading(true);
        setResult(null);
        try {
            const res = await api.post('/scan', { 
                content: finalContent, 
                type: type === 'url' ? 'url' : 'message' 
            });
            setResult(res.data);
            if (res.data.result === 'Safe') {
                audioNotifier.playSuccess();
            } else {
                audioNotifier.playWarning();
            }
            toast.success('Analysis complete!');
        } catch (err) {
            toast.error('Failed to perform scan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 relative">
            <button 
                onClick={toggleMute}
                className="absolute top-6 right-6 p-3 rounded-full bg-inner-light border border-border text-gray-400 hover:text-[var(--primary)] hover:border-[var(--primary)] transition-all z-20 shadow-sm"
                title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">AI Scam Detector</h1>
                <p className="text-gray-400 text-lg">Paste a URL, message, or screenshot to analyze it for fraud.</p>
            </div>

            <div className="glass p-8 rounded-3xl mb-12 relative z-10">
                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={() => { setType('message'); setResult(null); }}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${type === 'message' ? 'bg-primary text-[var(--primary-text)] shadow-[0_0_15px_var(--primary-glow)]' : 'bg-inner-light text-gray-400 hover:bg-inner border border-border'}`}
                    >
                        <MessageSquare className="w-5 h-5" /> Message
                    </button>
                    <button 
                        onClick={() => { setType('url'); setResult(null); }}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${type === 'url' ? 'bg-primary text-[var(--primary-text)] shadow-[0_0_15px_var(--primary-glow)]' : 'bg-inner-light text-gray-400 hover:bg-inner border border-border'}`}
                    >
                        <LinkIcon className="w-5 h-5" /> URL
                    </button>
                    <button 
                        onClick={() => { setType('image'); setResult(null); }}
                        className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${type === 'image' ? 'bg-primary text-[var(--primary-text)] shadow-[0_0_15px_var(--primary-glow)]' : 'bg-inner-light text-gray-400 hover:bg-inner border border-border'}`}
                    >
                        <ImageIcon className="w-5 h-5" /> Image
                    </button>
                </div>

                <form onSubmit={handleScan} className="space-y-6">
                    {type === 'image' ? (
                        <div className="space-y-4">
                            {!imagePreview ? (
                                <div 
                                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-gray-400 bg-inner-light'}`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                    <UploadCloud className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-xl font-bold mb-2">Upload a Screenshot</h3>
                                    <p className="text-gray-400 text-sm">Drag and drop an image, or click to browse</p>
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden border border-border bg-inner p-4">
                                    <button 
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-6 right-6 p-2 bg-danger/80 hover:bg-danger text-white rounded-full transition-all shadow-lg z-20"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <img src={imagePreview} alt="Preview" className="w-full max-h-[400px] object-contain rounded-lg" />
                                </div>
                            )}
                            {content && type === 'image' && (
                                <div className="p-4 bg-inner border border-border rounded-xl">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Extracted Text</h4>
                                    <p className="text-gray-200 text-sm font-mono leading-relaxed break-words">{content}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <textarea 
                            className="input-field min-h-[150px] resize-none text-lg bg-inner-light border-border"
                            placeholder={type === 'url' ? 'Paste the full URL here...' : 'Paste the message content here...'}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}
                    
                    <button 
                        disabled={loading || ocrLoading || (type === 'image' && !imagePreview)}
                        className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg disabled:opacity-50"
                    >
                        {ocrLoading ? 'Extracting Text (OCR)...' : loading ? 'Analyzing Threats...' : (
                            <>
                                <Search className="w-6 h-6" /> {type === 'image' ? 'Extract & Analyze' : 'Analyze Content'}
                            </>
                        )}
                    </button>
                </form>
            </div>

            <AnimatePresence mode="wait">
                {(loading || ocrLoading) && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass rounded-3xl"
                    >
                        <Loading text={ocrLoading ? "Extracting text using Optical Character Recognition..." : "AI is analyzing threat patterns..."} />
                    </motion.div>
                )}

                {result && !loading && !ocrLoading && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="text-primary w-6 h-6 animate-pulse" />
                            <h2 className="text-2xl font-bold tracking-tight">Analysis Results</h2>
                        </div>
                        <ScanCard scan={result} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Scanner;
