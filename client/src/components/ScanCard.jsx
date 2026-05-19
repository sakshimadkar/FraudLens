import { AlertTriangle, ShieldCheck, ShieldAlert, Trash2, Calendar, Activity, ChevronDown, ChevronUp, Fingerprint, BrainCircuit, ShieldQuestion, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const ScanCard = ({ scan, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const cardRef = useRef(null);

    const exportPDF = () => {
        if (isExporting) return;
        setIsExporting(true);

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 30;
            let yPos = margin;

            // Dark background
            pdf.setFillColor(15, 15, 15);
            pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), 'F');

            // Title
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(22);
            pdf.setFont("helvetica", "bold");
            pdf.text('FraudLens Threat Report', margin, yPos);
            yPos += 20;

            // Date
            pdf.setTextColor(150, 150, 150);
            pdf.setFontSize(10);
            pdf.setFont("helvetica", "normal");
            pdf.text(`Generated: ${new Date(scan.timestamp).toLocaleString()}`, margin, yPos);
            yPos += 30;

            // Result Badge
            let resultColor = [255, 255, 255];
            if (scan.result === 'Safe') resultColor = [0, 255, 136];
            else if (scan.result === 'Suspicious') resultColor = [255, 157, 0];
            else if (scan.result === 'Dangerous') resultColor = [255, 0, 60];

            pdf.setTextColor(resultColor[0], resultColor[1], resultColor[2]);
            pdf.setFontSize(16);
            pdf.setFont("helvetica", "bold");
            pdf.text(`Status: ${scan.result}`, margin, yPos);
            
            pdf.setTextColor(255, 255, 255);
            pdf.text(`Threat Score: ${scan.riskScore}%`, pageWidth - margin - 120, yPos);
            yPos += 30;

            // Content
            pdf.setFontSize(12);
            pdf.setTextColor(200, 200, 200);
            pdf.setFont("helvetica", "normal");
            const contentLines = pdf.splitTextToSize(`Analyzed ${scan.type === 'url' ? 'URL' : 'Content'}:\n${scan.content}`, pageWidth - margin * 2);
            pdf.text(contentLines, margin, yPos);
            yPos += (contentLines.length * 15) + 20;

            // Reasons
            if (scan.reasons && scan.reasons.length > 0) {
                pdf.setTextColor(255, 157, 0);
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text('Risk Factors:', margin, yPos);
                yPos += 15;

                pdf.setTextColor(200, 200, 200);
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                scan.reasons.forEach(r => {
                    const lines = pdf.splitTextToSize(`• ${r}`, pageWidth - margin * 2);
                    pdf.text(lines, margin, yPos);
                    yPos += lines.length * 15;
                });
                yPos += 10;
            }

            // Recommendation
            if (scan.recommendation) {
                pdf.setTextColor(0, 255, 136);
                pdf.setFontSize(14);
                pdf.setFont("helvetica", "bold");
                pdf.text('AI Recommendation:', margin, yPos);
                yPos += 15;

                pdf.setTextColor(220, 220, 220);
                pdf.setFontSize(12);
                pdf.setFont("helvetica", "normal");
                const recLines = pdf.splitTextToSize(scan.recommendation, pageWidth - margin * 2);
                pdf.text(recLines, margin, yPos);
                yPos += (recLines.length * 15) + 10;
            }

            pdf.save(`FraudLens_${scan.result}_Report.pdf`);
            toast.success('Report downloaded!');
        } catch (error) {
            console.error("Failed to generate PDF", error);
            toast.error('Failed to export PDF');
        } finally {
            setIsExporting(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Safe': return { 
                color: 'text-success', 
                bg: 'bg-success/10', 
                border: 'border-success/30', 
                glow: 'shadow-[0_0_20px_rgba(0,255,136,0.3)]',
                icon: ShieldCheck 
            };
            case 'Suspicious': return { 
                color: 'text-warning', 
                bg: 'bg-warning/10', 
                border: 'border-warning/30', 
                glow: 'shadow-[0_0_20px_rgba(255,157,0,0.3)]',
                icon: AlertTriangle 
            };
            case 'Dangerous': return { 
                color: 'text-danger', 
                bg: 'bg-danger/10', 
                border: 'border-danger/30', 
                glow: 'shadow-[0_0_20px_rgba(255,0,60,0.3)]',
                icon: ShieldAlert 
            };
            default: return { 
                color: 'text-gray-400', 
                bg: 'bg-white/5', 
                border: 'border-white/10', 
                glow: '', 
                icon: Activity 
            };
        }
    };

    const styles = getStatusStyles(scan.result);
    const StatusIcon = styles.icon;

    const hasAdvancedData = scan.phishingIndicators?.length > 0 || scan.socialEngineeringTactics?.length > 0 || scan.confidence !== undefined;

    return (
        <motion.div 
            ref={cardRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`glass p-6 rounded-3xl relative overflow-hidden group transition-all duration-300 border ${styles.border} hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] bg-card flex flex-col`}
        >
            <div className={`absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full blur-[100px] opacity-30 transition-opacity duration-700 group-hover:opacity-60 ${styles.bg}`} />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 border ${styles.border} ${styles.bg} ${styles.color} ${styles.glow}`}>
                    <StatusIcon className="w-4 h-4 animate-pulse" />
                    {scan.result}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                        onClick={exportPDF}
                        disabled={isExporting}
                        title="Export Report to PDF"
                        className="p-2.5 bg-primary/10 hover:bg-primary text-[var(--primary)] hover:text-white border border-primary/20 hover:border-primary rounded-xl transition-all duration-300 shadow-[0_0_10px_var(--primary-glow)] hover:shadow-[0_0_15px_var(--primary-glow)] disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                    {onDelete && (
                        <button 
                            onClick={() => onDelete(scan._id)}
                            title="Delete Scan"
                            className="p-2.5 bg-danger/10 hover:bg-danger text-danger hover:text-white border border-danger/20 hover:border-danger rounded-xl transition-all duration-300 shadow-[0_0_10px_rgba(255,0,60,0.1)] hover:shadow-[0_0_15px_rgba(255,0,60,0.5)]"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-6 relative z-10">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5" />
                    {scan.type === 'url' ? 'Analyzed URL' : 'Analyzed Message'}
                </p>
                <div className="p-4 bg-inner border border-border rounded-xl shadow-inner">
                    <p className="text-gray-200 font-mono text-sm break-all">{scan.content}</p>
                </div>
            </div>

            <div className="p-5 bg-inner rounded-xl border border-border mb-6 space-y-5 relative z-10 shadow-lg">
                {scan.reasons && scan.reasons.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-warning" /> Risk Factors
                        </h4>
                        <ul className="space-y-2">
                            {scan.reasons.map((reason, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                    <span className="text-warning mt-1">•</span>
                                    <span className="leading-relaxed">{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
                {scan.keywords && scan.keywords.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ShieldAlert className="w-4 h-4 text-danger" /> Suspicious Triggers
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {scan.keywords.map((kw, i) => (
                                <span key={i} className="px-3 py-1 bg-danger/10 border border-danger/30 text-danger rounded-md text-xs font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(255,0,60,0.15)]">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
                {scan.recommendation && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-2">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-success" /> AI Recommendation
                        </h4>
                        <div className="p-4 bg-success/10 border border-success/30 rounded-xl shadow-[0_0_15px_rgba(0,255,136,0.1)]">
                            <p className="text-sm text-success font-medium leading-relaxed">{scan.recommendation}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            {hasAdvancedData && (
                <div className="relative z-10 mb-6">
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="w-full flex items-center justify-between p-4 bg-inner-light hover:bg-inner border border-border rounded-xl transition-all font-bold text-sm text-[var(--primary)] shadow-sm"
                    >
                        <span className="flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4" /> 
                            AI Threat Explanation
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-5 bg-inner border border-border rounded-xl space-y-6 shadow-inner">
                                    
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-gray-400">Threat Risk</span>
                                                <span className={styles.color}>{scan.riskScore}%</span>
                                            </div>
                                            <div className="h-2 bg-inner-light rounded-full overflow-hidden border border-border">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: scan.riskScore + '%' }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className={"h-full " + styles.bg.split('/')[0] + " shadow-[0_0_10px_currentColor] " + styles.color}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                                <span className="text-gray-400">AI Confidence</span>
                                                <span className="text-[var(--primary)]">{scan.confidence || 0}%</span>
                                            </div>
                                            <div className="h-2 bg-inner-light rounded-full overflow-hidden border border-border">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: (scan.confidence || 0) + '%' }}
                                                    transition={{ duration: 1, delay: 0.4 }}
                                                    className="h-full bg-[var(--primary)] shadow-[0_0_10px_var(--primary-glow)]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {scan.phishingIndicators?.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <Fingerprint className="w-4 h-4 text-warning" /> Phishing Indicators
                                            </h4>
                                            <div className="space-y-2">
                                                {scan.phishingIndicators.map((ind, i) => (
                                                    <div key={i} className="px-3 py-2 bg-inner-light border border-white/5 rounded-lg text-sm text-gray-300 flex items-center gap-2">
                                                        <ShieldQuestion className="w-3.5 h-3.5 text-warning" />
                                                        {ind}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {scan.socialEngineeringTactics?.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <BrainCircuit className="w-4 h-4 text-danger" /> Social Engineering
                                            </h4>
                                            <div className="space-y-2">
                                                {scan.socialEngineeringTactics.map((tactic, i) => (
                                                    <div key={i} className="px-3 py-2 bg-inner-light border border-white/5 rounded-lg text-sm text-gray-300 flex items-center gap-2">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-danger" />
                                                        {tactic}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border relative z-10">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(scan.timestamp).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Threat Score</span>
                    <span className={"text-xl font-black tracking-tighter drop-shadow-[0_0_8px_currentColor] " + styles.color}>
                        {scan.riskScore}%
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default ScanCard;
