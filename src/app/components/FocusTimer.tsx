import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from '../types';
import { Play, Pause, Square, CheckCircle2, X } from 'lucide-react';
import { getCategoryColor } from '../utils/statsUtils';

interface FocusTimerProps {
    activity: Activity;
    onComplete: (actualDuration: number) => void;
    onCancel: () => void;
}

export function FocusTimer({ activity, onComplete, onCancel }: FocusTimerProps) {
    const [timeLeft, setTimeLeft] = useState(activity.value * 60); // in seconds
    const [isActive, setIsActive] = useState(false); // Auto-start is handled by effect
    const [totalTime, setTotalTime] = useState(activity.value * 60);
    const [isCompleted, setIsCompleted] = useState(false);

    // Auto-start when component mounts
    useEffect(() => {
        setIsActive(true);
    }, []);

    useEffect(() => {
        let interval: number | undefined;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !isCompleted) {
            // Timer finished
            setIsCompleted(true);
            setIsActive(false);
            // Auto-complete after a short delay to show 00:00
            setTimeout(() => {
                onComplete(Math.round(totalTime / 60));
            }, 1500);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isCompleted, onComplete, totalTime]);

    const toggleTimer = () => setIsActive(!isActive);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const color = getCategoryColor(activity.category);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl"
        >
            <div className="absolute top-6 right-6">
                <button
                    onClick={onCancel}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center w-full max-w-md px-8"
            >
                <div className="mb-12">
                    <h2 className="text-3xl font-black text-foreground mb-2">{activity.name}</h2>
                    <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm">Mode Focus</p>
                </div>

                {/* Circular Progress */}
                <div className="relative w-72 h-72 mx-auto mb-12">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="144"
                            cy="144"
                            r="130"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-muted/20"
                        />
                        {/* Progress Circle */}
                        <circle
                            cx="144"
                            cy="144"
                            r="130"
                            stroke={color}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 130}
                            strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>

                    {/* Time Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-6xl font-black tabular-nums tracking-tighter text-foreground">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-wide">
                            Restant
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={toggleTimer}
                        className="p-6 rounded-full bg-foreground text-background hover:scale-105 active:scale-95 transition-all shadow-xl"
                    >
                        {isActive ? (
                            <Pause className="w-8 h-8 fill-current" />
                        ) : (
                            <Play className="w-8 h-8 fill-current ml-1" />
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
