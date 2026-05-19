import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, Search, History, ChevronRight } from 'lucide-react';

const Landing = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-32">
            <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 text-center lg:text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6"
                    >
                        <Shield className="w-4 h-4" />
                        AI-POWERED FRAUD PROTECTION
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-6xl md:text-7xl font-extrabold tracking-tighter leading-none mb-6"
                    >
                        Detect Scams <br />
                        <span className="text-primary">Before They Hit.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0"
                    >
                        FraudLens uses advanced Llama 3.3 AI to analyze suspicious messages and URLs, keeping you and your data safe from phishing and fraudulent attacks.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                    >
                        <Link to="/register" className="btn-primary flex items-center gap-2">
                            Start Free Scan <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link to="/login" className="px-6 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all">
                            Member Login
                        </Link>
                    </motion.div>
                </div>

                <div className="flex-1 relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 glass p-8 rounded-3xl border-primary/20 shadow-[0_0_50px_rgba(0,242,255,0.1)]"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="p-3 bg-danger/20 rounded-xl text-danger">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold">Encrypted Analysis</p>
                                    <p className="text-sm text-gray-400">Your data is never stored without consent.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="p-3 bg-success/20 rounded-xl text-success">
                                    <Search className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold">Real-time Detection</p>
                                    <p className="text-sm text-gray-400">Instant results powered by Llama 3.3.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="p-3 bg-secondary/20 rounded-xl text-secondary">
                                    <History className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold">Threat History</p>
                                    <p className="text-sm text-gray-400">Keep track of every suspicious link you find.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[120px] -z-10" />
                </div>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 border-t border-border pt-16">
                {[
                    { label: 'Threats Detected', value: '1.2M+' },
                    { label: 'Active Users', value: '50K+' },
                    { label: 'Accuracy Rate', value: '99.9%' },
                    { label: 'Analysis Time', value: '<2s' },
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <p className="text-3xl font-bold text-gray-100 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Landing;
