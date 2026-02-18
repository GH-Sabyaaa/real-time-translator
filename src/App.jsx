import React, { useState } from 'react';
import useSpeechRecognition from './hooks/useSpeechRecognition';
import useTranslationAndSpeech from './hooks/useSpeechAndTranslation';
import LogEntry from './components/LogEntry';

// Default languages (customized)
const DEFAULT_SOURCE_LANG = 'en-US';
const DEFAULT_TARGET_LANG = 'hi';

const App = () => {
    const [isListening, setIsListening] = useState(false);
    const [statusText, setStatusText] = useState('Click Start to begin voice recognition');
    const [floatingText, setFloatingText] = useState('Your translated text will appear here...');
    const [logHistory, setLogHistory] = useState([]);
    const [sourceLang, setSourceLang] = useState(DEFAULT_SOURCE_LANG);
    const [targetLang, setTargetLang] = useState(DEFAULT_TARGET_LANG);

    const addLog = (type, text, source = '') => {
        const entry = {
            type,
            text,
            source,
            timestamp: new Date().toLocaleTimeString(),
        };
        setLogHistory(prev => [entry, ...prev].slice(0, 200));
    };

    // Translation + Text to speech
    const translateAndSpeak = useTranslationAndSpeech(targetLang, addLog, setFloatingText, isListening);

    // Speech recognition
    const { toggleListening } = useSpeechRecognition(
        sourceLang,
        isListening,
        setIsListening,
        setStatusText,
        setFloatingText,
        addLog,
        translateAndSpeak
    );

    // Swap languages feature
    const swapLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
        addLog("system", "Languages swapped");
    };

    // Copy translation feature
    const copyTranslation = () => {
        navigator.clipboard.writeText(floatingText);
        addLog("system", "Translation copied to clipboard");
    };

    return (
        <div className="min-h-screen p-6 bg-slate-900 text-white">
            <div className="max-w-3xl mx-auto">

                {/* HEADER */}
                <header className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold tracking-wide">
                        SpeakBridge AI Translator
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">

                        {/* Source Language */}
                        <select
                            value={sourceLang}
                            onChange={(e) => setSourceLang(e.target.value)}
                            className="px-3 py-2 rounded bg-slate-800 border border-slate-600"
                        >
                            <option value="en-US">English (US)</option>
                            <option value="en-GB">English (UK)</option>
                            <option value="es-ES">Spanish</option>
                            <option value="fr-FR">French</option>
                        </select>

                        {/* Swap Button */}
                        <button
                            onClick={swapLanguages}
                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                        >
                            ⇄ Swap
                        </button>

                        {/* Target Language */}
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="px-3 py-2 rounded bg-slate-800 border border-slate-600"
                        >
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                        </select>

                        {/* Start/Stop Button */}
                        <button
                            onClick={toggleListening}
                            className={`px-4 py-2 rounded font-semibold ${
                                isListening ? 'bg-red-500' : 'bg-green-600'
                            }`}
                        >
                            {isListening ? 'Stop' : 'Start'}
                        </button>
                    </div>
                </header>

                {/* TRANSLATION BOX */}
                <div className="mb-4">
                    <div className="p-4 rounded bg-slate-800 border border-slate-600">
                        <p className="text-sm text-gray-300">{statusText}</p>
                        <h2 className="mt-3 text-xl font-semibold">{floatingText}</h2>

                        {/* Copy Button */}
                        <button
                            onClick={copyTranslation}
                            className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                        >
                            Copy Translation
                        </button>
                    </div>
                </div>

                {/* LOG HISTORY */}
                <section className="mb-6">
                    <h3 className="font-semibold mb-2 text-lg">Activity Log</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {logHistory.length === 0 && (
                            <div className="text-sm text-gray-400">No activity yet.</div>
                        )}

                        {logHistory.map((entry, idx) => (
                            <LogEntry
                                key={`${entry.timestamp}-${idx}`}
                                type={entry.type}
                                text={entry.text}
                                source={entry.source}
                                timestamp={entry.timestamp}
                            />
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="text-xs text-gray-400">
                    Tip: Use Chrome/Edge and allow microphone permissions for best results.
                </footer>

            </div>
        </div>
    );
};

export default App;
