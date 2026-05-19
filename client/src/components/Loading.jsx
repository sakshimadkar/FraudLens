import { motion } from 'framer-motion';

const Loading = ({ text = "Analyzing..." }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-6">
            <div className="relative w-20 h-20">
                <motion.div 
                    className="absolute inset-0 border-4 border-primary/20 rounded-full"
                />
                <motion.div 
                    className="absolute inset-0 border-4 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                    className="absolute inset-4 border-4 border-secondary/20 rounded-full"
                />
                <motion.div 
                    className="absolute inset-4 border-4 border-b-secondary rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-primary font-bold tracking-widest uppercase text-sm"
            >
                {text}
            </motion.p>
        </div>
    );
};

export default Loading;
