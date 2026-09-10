import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Eye, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  UserCheck, 
  Flame, 
  Radio, 
  CheckSquare, 
  Square,
  Award,
  Video,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export default function Awareness() {
  const location = useLocation();
  const isInsideDashboard = location.pathname.startsWith('/dashboard');

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState({});

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const checklist = [
    {
      title: "Check the original source",
      desc: "Where was this video first published? Is it from an official verified publisher or an unverified social media account or forwarded message?",
    },
    {
      title: "Check whether reputable news outlets report it",
      desc: "If a video presents sensational or controversial claims, verify whether reputable journalistic organizations (e.g., Reuters, AP, BBC) have corroborated it.",
    },
    {
      title: "Look for audio/video mismatch (Lip-Sync)",
      desc: "Do the spoken syllables and phonetic sounds match the speaker's lip visemes, or does the audio lead/lag behind mouth movements?",
    },
    {
      title: "Inspect facial movements & edge artifacts",
      desc: "Watch for unnatural blinking (or complete absence of blinks), blurry halos along the jawline, and inconsistent lighting angles across the face.",
    },
    {
      title: "Do not share unverified content",
      desc: "Break the viral chain of misinformation. Avoid reposting or forwarding provocative clips until their authenticity is established.",
    },
    {
      title: "Use AI forensic verification tools",
      desc: "Evaluate suspicious footage with explainable forensic platforms like DeepShield XAI to examine frame synchrony and confidence metrics.",
    },
  ];

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;

  // Quiz State
  const quizQuestions = [
    {
      question: "Which of the following is the most reliable visual indicator of a manipulated (deepfake) video?",
      options: [
        { text: "Crisp audio synchronization and studio-grade lighting", isCorrect: false },
        { text: "Unnatural lip-sync latency and facial boundary warp artifacts", isCorrect: true },
        { text: "Natural blinking frequency of 15 to 20 times per minute", isCorrect: false },
        { text: "Smooth camera panning without background noise", isCorrect: false },
      ],
      explanation: "Deepfakes often struggle with millisecond-level phonetic alignment (lip-sync) and leave warp artifacts along the jawline and mouth boundary."
    },
    {
      question: "What does 'Voice Cloning' refer to in synthetic media technology?",
      options: [
        { text: "Recording speech with a high-end condenser microphone", isCorrect: false },
        { text: "Adding echo and equalization effects in audio post-production", isCorrect: false },
        { text: "Using neural networks to synthesize a person's exact vocal timbre and pitch from audio samples", isCorrect: true },
        { text: "Automated real-time translation of subtitles into regional dialects", isCorrect: false },
      ],
      explanation: "Neural voice cloning models require only a few seconds of clear reference audio to generate synthetic speech mimicking any target speaker."
    },
    {
      question: "If you encounter a shocking video of a public figure making unexpected statements, what is the best first response?",
      options: [
        { text: "Forward it immediately across social groups to warn friends", isCorrect: false },
        { text: "Verify the original publishing source and cross-reference credible news platforms", isCorrect: true },
        { text: "Assume it must be genuine because video recordings cannot be fabricated", isCorrect: false },
        { text: "Delete your messaging applications permanently", isCorrect: false },
      ],
      explanation: "Checking the primary publishing source and searching for corroboration across credible news organizations stops false narratives at their inception."
    },
    {
      question: "Why do Lip-Sync manipulated videos frequently fail temporal forensic analysis?",
      options: [
        { text: "Digital cameras cannot encode natural skin tones accurately", isCorrect: false },
        { text: "Audio phonemes (acoustic sounds) and visual visemes (lip shapes) exhibit millisecond temporal latency", isCorrect: true },
        { text: "All deepfake video algorithms automatically produce grayscale outputs", isCorrect: false },
        { text: "Video streaming platforms automatically mute audio during synthetic speech", isCorrect: false },
      ],
      explanation: "Human speech demands millisecond-level synchronization between acoustic phonemes and visual lip visemes. Generative AI often struggles with fast temporal coherence."
    },
    {
      question: "How does DeepShield XAI determine whether a video is authentic or manipulated?",
      options: [
        { text: "By analyzing the download filename of the video container", isCorrect: false },
        { text: "By tracking 3D facial landmarks with MediaPipe and calculating Lip-Sync Error Distance (LSE-D)", isCorrect: true },
        { text: "By inspecting the total number of views on social media platforms", isCorrect: false },
        { text: "By crowdsourcing public opinion votes", isCorrect: false },
      ],
      explanation: "DeepShield pairs 3D mesh contour tracking with deep neural audio-visual synchrony models to produce objective, explainable forensic metrics."
    },
  ];

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState(false);

  const handleSelectOption = (qIdx, optIdx) => {
    if (selectedAnswers[qIdx] !== undefined) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < quizQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowQuizResult(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setShowQuizResult(false);
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        score += 1;
      }
    });
    return score;
  };

  const quizScore = calculateScore();

  return (
    <div className={`transition-colors duration-200 ${isInsideDashboard ? 'max-w-7xl mx-auto space-y-12 pb-16 animate-in fade-in duration-300' : 'min-h-screen bg-slate-50 dark:bg-[#0B0D17] text-slate-900 dark:text-white pt-28 px-4 sm:px-8 pb-20 font-sans'}`}>
      
      {/* ========================================================================= */}
      {/* HERO SECTION                                                             */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-purple-500/20">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Media Integrity & Digital Literacy
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Deepfake Awareness & <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300 bg-clip-text text-transparent">
              Forensic Knowledge Hub
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            The proliferation of synthetic video and cloned audio media presents significant risks to public trust. 
            Use this comprehensive guide to understand how deepfakes operate, how to detect subtle forensic anomalies, and how to verify suspicious content.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
            >
              <Video className="w-4 h-4" />
              Analyze Video Now
            </Link>
            <a
              href="#quiz"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold text-sm backdrop-blur-md transition-all"
            >
              <HelpCircle className="w-4 h-4 text-pink-400" />
              Test Your Knowledge (Quiz)
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. 🤖 WHAT IS A DEEPFAKE?                                                 */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              What is a Deepfake?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Clear concept breakdown in straightforward terminology
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-[#121829]/90 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl space-y-4">
            <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40">
              <p className="text-base font-medium text-purple-900 dark:text-purple-200 leading-relaxed">
                <span className="font-bold text-purple-700 dark:text-purple-300">Simple Definition: </span>
                A deepfake is synthetic media where Artificial Intelligence and Deep Learning algorithms are used to digitally 
                manipulate or fabricate a person's face, voice, or actions into <strong className="underline decoration-purple-500">hyper-realistic fake content</strong> that appears authentic to the naked eye.
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Deepfake = "Deep Learning" + "Fake"</strong>. This technology relies on sophisticated neural network architectures—most notably Generative Adversarial Networks (GANs) and modern Latent Diffusion Models.
              </p>
              <p>
                An AI model analyzes thousands of image frames and audio recordings of an individual to learn their distinctive facial geometry, micro-expressions, speech patterns, and acoustic harmonics. The algorithm can then map these attributes onto an actor or an entirely fabricated script.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-purple-950/40">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
                  How It's Created
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Target audio and video references are fed into neural encoders that synthesize manipulated frames with pixel-level precision.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-purple-950/40">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                  Why It's Dangerous
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  To casual human observation, high-resolution synthetic media can be nearly impossible to distinguish from authentic footage.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-transparent dark:from-purple-900/20 dark:via-indigo-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-500/30 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm mb-3">
                <Flame className="w-4 h-4" /> Did You Know?
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Rapid Synthesis in Minutes
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                With accessible consumer GPUs and pre-trained neural checkpoints, realistic voice clones and face swaps can now be produced in mere minutes with minimal technical expertise.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#0e1424] border border-slate-200 dark:border-purple-900/40 text-xs space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">DeepShield Defense:</span>
              <p className="text-slate-500 dark:text-slate-400">
                We perform sub-frame mathematical analysis of phoneme-viseme coherence and 3D landmark mesh dynamics that human eyes routinely miss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. 👀 HOW TO SPOT A DEEPFAKE                                              */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How to Spot a Deepfake (Forensic Signals)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              6 tell-tale forensic indicators to watch for when evaluating suspicious video media
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "1. Lip-Sync Mismatch",
              desc: "Spoken phonetic sounds do not align naturally with visual mouth shapes (visemes). Rapid speech sequences frequently expose timing discrepancies.",
              icon: Volume2,
              color: "text-purple-600 dark:text-purple-400",
              badge: "Audio-Visual Flaw"
            },
            {
              title: "2. Unnatural Facial Movements",
              desc: "Stiff robotic expressions, absence of natural micro-contractions across cheek muscles, and disconnected emotional gestures.",
              icon: UserCheck,
              color: "text-pink-600 dark:text-pink-400",
              badge: "Facial Jitter"
            },
            {
              title: "3. Audio/Video Timing Latency",
              desc: "Temporal desynchronization between audio pressure waves and video frame sequences, notably on plosive consonants like P, B, and M.",
              icon: Radio,
              color: "text-blue-600 dark:text-blue-400",
              badge: "Temporal Lag"
            },
            {
              title: "4. Unusual Blinking & Eye Gaze",
              desc: "The subject either blinks abnormally infrequently or exhibits unnatural mechanical blinking rates. Eye reflections may appear mismatched.",
              icon: Eye,
              color: "text-amber-600 dark:text-amber-400",
              badge: "Ocular Anomaly"
            },
            {
              title: "5. Voice Abnormalities",
              desc: "Monotone acoustic cadence, metallic digital artifacts, erratic pitch jumps, and the total absence of natural breathing pauses.",
              icon: Bot,
              color: "text-emerald-600 dark:text-emerald-400",
              badge: "Synthetic Audio"
            },
            {
              title: "6. Visual Boundary Glitches",
              desc: "Blurry artifacts and halos along the jawline, shimmering boundaries around hair strands, and warped dental textures during speech.",
              icon: AlertTriangle,
              color: "text-rose-600 dark:text-rose-400",
              badge: "Edge Artifacts"
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/30 rounded-2xl p-6 shadow-sm dark:shadow-md hover:border-purple-400 dark:hover:border-purple-500/50 transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-purple-950/50 ${item.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 🎭 TYPES OF DEEPFAKE                                                  */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-pink-100 dark:bg-pink-600/20 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Types of Deepfakes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Understanding the different categories of synthetic manipulation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Face Swap",
              desc: "Digitally replacing the facial identity of an actor in an authentic video frame with the face of a target person.",
              tech: "Autoencoders & 2D/3D Facial Warping",
              example: "Superimposing celebrity or executive faces into unauthorized or compromising footage"
            },
            {
              title: "Lip-Sync Manipulation",
              desc: "Retaining the original face and scene while modifying mouth landmarks to align with fabricated or dubbed speech.",
              tech: "SyncNet & Audio-to-Viseme GANs",
              example: "Making a political figure appear to deliver controversial or manufactured statements"
            },
            {
              title: "Voice Cloning",
              desc: "Synthesizing an exact replica of a person's vocal pitch, timbre, cadence, and accent using minimal reference audio.",
              tech: "Neural Text-To-Speech (TTS) & Vocoders",
              example: "Fraudulent phone calls impersonating family members or corporate officers demanding urgent transfers"
            },
            {
              title: "Face Re-enactment",
              desc: "Transferring real-time facial expressions, gaze, and head poses from a source actor directly onto a target's video avatar.",
              tech: "Facial Landmark & Motion Transfer Models",
              example: "Puppeteering a public figure's expressions interactively during live video calls"
            },
            {
              title: "Fully AI-Generated Video",
              desc: "Generating complete photorealistic video sequences and synthetic humans from text prompts without any original base footage.",
              tech: "Video Diffusion Models (e.g., Sora, Runway, Gen-2)",
              example: "Fabricating synthetic disaster events, simulated crises, or non-existent public gatherings"
            },
            {
              title: "Puppet & Morphing",
              desc: "Animating a single static photograph with realistic eye motion, subtle head turns, and conversational facial gestures.",
              tech: "First-Order Motion Models & Keypoint Warping",
              example: "Animating historical portraits, synthetic profile avatars, or deceptive social accounts"
            },
          ].map((type, idx) => (
            <div key={idx} className="bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                  Class 0{idx + 1}
                </span>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {type.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {type.desc}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-purple-900/30 text-[11px]">
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Core Tech: </span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{type.tech}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500">Common Scenario: </span>
                  <span className="font-medium text-purple-700 dark:text-purple-300">{type.example}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ⚠️ REAL-WORLD RISKS                                                    */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-600/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real-World Risks & Threats
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Why synthetic media verification is critical for personal, corporate, and public safety
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "Fake News & Disinformation",
              desc: "Disseminating fabricated speeches to mislead electorates, distort political discourse, and manipulate public opinion.",
              severity: "High Impact"
            },
            {
              title: "Impersonation & Executive Fraud",
              desc: "Synthesizing executive vocal profiles to instruct corporate finance personnel to execute unauthorized wire transfers.",
              severity: "Financial Risk"
            },
            {
              title: "Extortion & Digital Arrest Scams",
              desc: "Simulating law enforcement officials or judicial officers in video calls to intimidate victims into compliance.",
              severity: "Cyber Crime"
            },
            {
              title: "Misinformation & Panic",
              desc: "Broadcasting synthetic videos of industrial disasters, armed conflicts, or market crashes to trigger public panic.",
              severity: "Public Safety"
            },
            {
              title: "Reputation Damage & Defamation",
              desc: "Generating non-consensual imagery and falsified leak footage to harass, extort, or defame individuals.",
              severity: "Personal Hazard"
            },
            {
              title: "Social Engineering & Phishing",
              desc: "Deploying synthetic avatars in enterprise video conferences to compromise identity credentials and corporate networks.",
              severity: "Enterprise Threat"
            },
          ].map((risk, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-[#121829]/80 border border-slate-200 dark:border-purple-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {risk.title}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
                  {risk.severity}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {risk.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. 🔎 “THINK BEFORE YOU TRUST” CHECKLIST (INTERACTIVE)                     */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              “Think Before You Trust” Checklist
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Interactive 6-step verification rulebook before trusting or sharing any video content
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121829]/90 border border-slate-200 dark:border-purple-900/40 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-purple-900/30">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Verification Readiness Score
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click on the items below as you complete each safety verification step.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                {totalChecked} of {checklist.length} Verified
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item, idx) => {
              const isChecked = !!checkedItems[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                    isChecked
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-600/40 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-purple-900/20 hover:border-purple-400 dark:hover:border-purple-600/40'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold transition-colors ${isChecked ? 'text-emerald-900 dark:text-emerald-300 line-through opacity-80' : 'text-slate-900 dark:text-white'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. 🧪 AWARENESS QUIZ — 🔥 (INTERACTIVE WITH INSTANT SCORE)               */}
      {/* ========================================================================= */}
      <section id="quiz" className="space-y-6 scroll-mt-28">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Awareness Quiz <span className="text-base">🔥</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Test your ability to spot digital manipulation and earn your Cyber Guardian certification
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#121829]/90 border border-slate-200 dark:border-purple-900/40 rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
          {!showQuizResult ? (
            <div className="space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-purple-900/30">
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  Question {currentQIndex + 1} of {quizQuestions.length}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {Math.round(((currentQIndex + 1) / quizQuestions.length) * 100)}% Completed
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-purple-950/50 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {quizQuestions[currentQIndex].question}
              </h3>

              {/* Options Grid */}
              <div className="space-y-3">
                {quizQuestions[currentQIndex].options.map((opt, optIdx) => {
                  const isChosen = selectedAnswers[currentQIndex] === optIdx;
                  const hasAnswered = selectedAnswers[currentQIndex] !== undefined;

                  let cardStyle = "bg-slate-50 dark:bg-[#0f1424] border-slate-200 dark:border-purple-900/30 hover:border-purple-400 text-slate-800 dark:text-slate-200";
                  
                  if (hasAnswered) {
                    if (opt.isCorrect) {
                      cardStyle = "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold shadow-sm";
                    } else if (isChosen && !opt.isCorrect) {
                      cardStyle = "bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500 text-rose-900 dark:text-rose-200 font-semibold";
                    } else {
                      cardStyle = "opacity-50 border-slate-200 dark:border-slate-800 text-slate-400";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(currentQIndex, optIdx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all text-sm flex items-center justify-between cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {hasAnswered && opt.isCorrect && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm ml-2">
                          ✓ Correct
                        </span>
                      )}
                      {hasAnswered && isChosen && !opt.isCorrect && (
                        <span className="text-rose-600 dark:text-rose-400 font-extrabold text-sm ml-2">
                          ✗ Incorrect
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Forensic Explanation Note */}
              {selectedAnswers[currentQIndex] !== undefined && (
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/50 space-y-1 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
                    Forensic Explanation:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {quizQuestions[currentQIndex].explanation}
                  </p>
                </div>
              )}

              {/* Next / Submit Button */}
              <div className="flex justify-end pt-2">
                <button
                  disabled={selectedAnswers[currentQIndex] === undefined}
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 text-white font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  {currentQIndex === quizQuestions.length - 1 ? "Finish & View Score" : "Next Question"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Score Card */
            <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="inline-flex p-4 rounded-3xl bg-purple-100 dark:bg-purple-600/20 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30">
                <Award className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Your Deepfake Awareness Score: <span className="text-purple-600 dark:text-purple-400">{quizScore} / {quizQuestions.length}</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  {quizScore === 5 && "Outstanding! You possess sharp forensic awareness against synthetic AI media."}
                  {quizScore >= 3 && quizScore < 5 && "Great job! You have strong vigilance, with just a few subtleties to keep an eye on."}
                  {quizScore < 3 && "Good effort! Review the forensic signals above and always cross-check suspicious videos."}
                </p>
              </div>

              <div className="inline-block px-4 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/50">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                  Badge: {quizScore >= 4 ? "🛡️ Certified Cyber Guardian" : "🔍 Forensic Scout"}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-purple-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-purple-950/40 text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-purple-600/30 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2"
                >
                  <Video className="w-4 h-4" /> Put It To The Test: Analyze a Video
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 🚨 REPORT / VERIFY CTA                                                 */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 text-white p-8 sm:p-12 shadow-2xl border border-purple-400/30">
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              Direct Action
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Encountered a Suspicious Video? Verify It Now.
            </h3>
            <p className="text-purple-100 text-sm leading-relaxed">
              Don't rely on guesswork. Upload the video to DeepShield's Explainable AI pipeline for frame-level sync tracking, MediaPipe 3D landmark mesh analysis, and instant verdict reporting.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white text-purple-900 hover:bg-slate-100 font-extrabold text-base shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <Video className="w-5 h-5 text-purple-700" />
              Analyze a Video
              <ArrowRight className="w-5 h-5 text-purple-700" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}