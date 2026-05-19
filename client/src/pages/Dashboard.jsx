import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Search, History, AlertTriangle, TrendingUp, CheckCircle, Radio, Activity, AlertOctagon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import ScanCard from '../components/ScanCard';

const MOCK_THREATS = [
    { id: 1, type: 'Phishing Campaign', source: 'SMS / WhatsApp', target: 'Banking Users', severity: 'Critical', desc: 'Mass SMS campaign asking users to update PAN card via malicious link.', icon: AlertOctagon },
    { id: 2, type: 'Fake Job Scam', source: 'LinkedIn / Email', target: 'Tech Professionals', severity: 'High', desc: 'Fraudulent work-from-home offers demanding upfront equipment fees.', icon: AlertTriangle },
    { id: 3, type: 'Malware App', source: '3rd Party Stores', target: 'Android Users', severity: 'Critical', desc: 'Fake delivery app stealing SMS OTPs in the background.', icon: Shield },
    { id: 4, type: 'Crypto Fraud', source: 'Telegram', target: 'Retail Investors', severity: 'Medium', desc: 'Pump and dump scheme organized in massive Telegram groups.', icon: Activity },
    { id: 5, type: 'Impersonation', source: 'Phone Call', target: 'Elderly', severity: 'High', desc: 'Scammers posing as police demanding immediate bail transfers.', icon: AlertTriangle },
];

const Dashboard = () => {
    const { api, user } = useAuth();
    const [stats, setStats] = useState({ total: 0, safe: 0, dangerous: 0, suspicious: 0 });
    const [recentScans, setRecentScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [liveThreats, setLiveThreats] = useState(MOCK_THREATS.slice(0, 3));

    useEffect(() => {
        fetchDashboardData();

        // Simulate live feed by rotating threats every 8 seconds
        const interval = setInterval(() => {
            setLiveThreats(prev => {
                const nextThreat = MOCK_THREATS[Math.floor(Math.random() * MOCK_THREATS.length)];
                const newThreat = { ...nextThreat, id: Date.now(), time: 'Just now' };
                return [newThreat, ...prev.slice(0, 2)].map((t, i) => ({ ...t, time: i === 0 ? 'Just now' : i === 1 ? '1 min ago' : '3 mins ago' }));
            });
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/scan/history');
            const data = res.data;
            setRecentScans(data.slice(0, 3));
            
            const total = data.length;
            const safe = data.filter(s => s.result === 'Safe').length;
            const dangerous = data.filter(s => s.result === 'Dangerous').length;
            const suspicious = data.filter(s => s.result === 'Suspicious').length;
            
            setStats({ total, safe, dangerous, suspicious });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Scans', value: stats.total, icon: Search, color: 'text-[var(--primary)]', bg: 'bg-[var(--primary)]/10', glow: 'shadow-[0_0_15px_var(--primary-glow)]' },
        { label: 'Safe Content', value: stats.safe, icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', glow: 'shadow-[0_0_15px_rgba(0,255,136,0.2)]' },
        { label: 'Threats Blocked', value: stats.dangerous, icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10', glow: 'shadow-[0_0_15px_rgba(255,0,60,0.2)]' },
        { label: 'Security Score', value: stats.total === 0 ? '100%' : `${Math.round((stats.safe/stats.total)*100)}%`, icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10', glow: 'shadow-[0_0_15px_rgba(112,0,255,0.2)]' },
    ];

    const getSeverityStyles = (severity) => {
        switch(severity) {
            case 'Critical': return 'text-danger bg-danger/10 border-danger/30 shadow-[0_0_15px_rgba(255,0,60,0.2)]';
            case 'High': return 'text-warning bg-warning/10 border-warning/30 shadow-[0_0_15px_rgba(255,157,0,0.2)]';
            default: return 'text-[var(--primary)] bg-[var(--primary)]/10 border-[var(--primary)]/30 shadow-[0_0_15px_var(--primary-glow)]';
        }
    };

    const chartData = [
        { name: 'Safe', value: stats.safe, color: '#00ff88' },
        { name: 'Suspicious', value: stats.suspicious, color: '#ff9d00' },
        { name: 'Dangerous', value: stats.dangerous, color: '#ff003c' }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-12 relative"
            >
                <div className="absolute -top-20 -left-10 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />
                <h1 className="text-5xl font-black mb-3 tracking-tighter">Welcome back, <span className="text-[var(--primary)] drop-shadow-[0_0_20px_var(--primary-glow)]">{user?.name}</span></h1>
                <p className="text-gray-400 text-lg font-medium">Your global cybersecurity overview for today.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="glass p-6 rounded-3xl border border-border hover:border-[var(--primary)]/30 hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all bg-card flex flex-col justify-between group cursor-default relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[var(--primary)]/10 transition-colors duration-500" />
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ${stat.glow} w-fit mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-1">{stat.label}</p>
                            <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {stats.total > 0 && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-3xl border border-border bg-card mb-12"
                >
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[var(--primary)]" />
                        Threat Analytics Overview
                    </h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.filter(d => d.value > 0)}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {chartData.filter(d => d.value > 0).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}40)` }} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="lg:col-span-2"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">Recent Scans</h2>
                        <Link to="/history" className="text-[var(--primary)] hover:underline text-sm font-bold flex items-center gap-1 uppercase tracking-widest">
                            View All <History className="w-4 h-4" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => <div key={i} className="glass h-40 rounded-2xl animate-pulse bg-inner" />)}
                        </div>
                    ) : recentScans.length > 0 ? (
                        <div className="space-y-6">
                            {recentScans.map(scan => (
                                <ScanCard key={scan._id} scan={scan} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass p-12 rounded-3xl text-center border border-border bg-card">
                            <div className="p-4 bg-inner rounded-full w-fit mx-auto mb-4 border border-border">
                                <Shield className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="text-gray-400 mb-6">No scans performed yet.</p>
                            <Link to="/scanner" className="btn-primary inline-flex">Start First Scan</Link>
                        </div>
                    )}
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="space-y-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <Radio className="w-6 h-6 text-danger animate-pulse" /> 
                            Live Threat Feed
                        </h2>
                    </div>

                    <div className="glass p-6 rounded-3xl border border-border bg-card overflow-hidden">
                        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Monitoring Global Networks</span>
                        </div>

                        <div className="space-y-4 relative">
                            <AnimatePresence>
                                {liveThreats.map((threat, index) => (
                                    <motion.div 
                                        key={threat.id}
                                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        layout
                                        className="p-4 bg-inner border border-border rounded-xl group hover:border-white/20 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${getSeverityStyles(threat.severity)}`}>
                                                {threat.severity}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{threat.time || 'Live'}</span>
                                        </div>
                                        <h4 className="font-bold text-sm mb-1 text-gray-200 flex items-center gap-2">
                                            <threat.icon className="w-3.5 h-3.5 text-gray-400" />
                                            {threat.type}
                                        </h4>
                                        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{threat.desc}</p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Target: {threat.target}</span>
                                            <span>•</span>
                                            <span>Via: {threat.source}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link to="/scanner" className="block glass p-6 rounded-3xl hover:border-[var(--primary)]/50 transition-all group bg-card border border-border relative overflow-hidden shadow-lg hover:shadow-[0_0_30px_var(--primary-glow)]">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-4 bg-inner border border-[var(--primary)]/30 rounded-2xl text-[var(--primary)] group-hover:scale-110 transition-transform shadow-[0_0_15px_var(--primary-glow)]">
                                    <Search className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-100">Analyze Content</p>
                                    <p className="text-sm text-gray-400">Scan suspicious URLs or images</p>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
