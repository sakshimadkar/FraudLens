import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Search, Filter, Trash2, Shield } from 'lucide-react';
import ScanCard from '../components/ScanCard';
import toast from 'react-hot-toast';

const History = () => {
    const { api } = useAuth();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/scan/history');
            setScans(res.data);
        } catch (err) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/scan/${id}`);
            setScans(scans.filter(s => s._id !== id));
            toast.success('Scan deleted');
        } catch (err) {
            toast.error('Failed to delete scan');
        }
    };

    const filteredScans = filter === 'All' ? scans : scans.filter(s => s.result === filter);

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                        <HistoryIcon className="text-primary w-10 h-10" /> Scan History
                    </h1>
                    <p className="text-gray-400">Manage and review your past security analysis.</p>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-1 rounded-xl border border-white/10">
                    {['All', 'Safe', 'Suspicious', 'Dangerous'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === f ? 'bg-primary text-black' : 'hover:bg-white/5 text-gray-400'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="glass h-64 rounded-3xl animate-pulse" />)}
                </div>
            ) : filteredScans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {filteredScans.map(scan => (
                            <ScanCard key={scan._id} scan={scan} onDelete={handleDelete} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="glass p-20 rounded-[40px] text-center max-w-2xl mx-auto border-dashed border-2 border-white/5">
                    <div className="p-6 bg-white/5 rounded-full w-fit mx-auto mb-6">
                        <Shield className="w-12 h-12 text-gray-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">No scans found</h3>
                    <p className="text-gray-400 mb-8">You haven't performed any {filter !== 'All' ? filter.toLowerCase() : ''} scans yet.</p>
                </div>
            )}
        </div>
    );
};

export default History;
