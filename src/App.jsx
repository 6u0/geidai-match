import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import tkmt512 from './assets/tkmt512.jpg'
import tkmt1024 from './assets/tkmt1024.jpg'
import matchSound from './assets/威風堂々 - 5578639 (mp3cut.net).mp3'

const STEPS = {
  ENTRY: 'entry',
  DENIED: 'denied',
  GENDER: 'gender',
  LOADING: 'loading',
  RESULT: 'result',
}
const MATCH_COUNT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbz3YABGCTpuzVbSm1k2Qbxiab7CK_w21bvQtUxxsbSCFANB5WH3V6vFRKlflhMvwJjK/exec'

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.35 } },
}

const burstItems = [
  { emoji: '💘', x: 10, y: 12, delay: 0.05, size: 'lg', drift: 86 },
  { emoji: '✨', x: 24, y: 10, delay: 0.1, size: 'md', drift: -70 },
  { emoji: '💖', x: 40, y: 14, delay: 0.14, size: 'lg', drift: 74 },
  { emoji: '💫', x: 58, y: 10, delay: 0.18, size: 'md', drift: -82 },
  { emoji: '❤️', x: 76, y: 12, delay: 0.22, size: 'lg', drift: 68 },
  { emoji: '🌟', x: 90, y: 16, delay: 0.26, size: 'md', drift: -76 },
  { emoji: '💗', x: 18, y: 40, delay: 0.3, size: 'sm', drift: 46 },
  { emoji: '💞', x: 42, y: 46, delay: 0.34, size: 'md', drift: -44 },
  { emoji: '✨', x: 66, y: 44, delay: 0.38, size: 'sm', drift: 40 },
  { emoji: '💘', x: 84, y: 48, delay: 0.42, size: 'md', drift: -38 },
]

function App() {
  const [step, setStep] = useState(STEPS.ENTRY)
  const [gender, setGender] = useState('')
  const matchAudioRef = useRef(null)
  const isAudioUnlockedRef = useRef(false)
  const tweetText =
    '大阪芸大専用マッチングアプリで1人とマッチしました！\n#MATCH_GEIDAI\nhttps://6u0.github.io/geidai-match/'

  useEffect(() => {
    const audio = new Audio(matchSound)
    audio.preload = 'auto'
    audio.load()
    matchAudioRef.current = audio
    return () => {
      matchAudioRef.current?.pause()
      matchAudioRef.current = null
    }
  }, [])

  const unlockAudioIfNeeded = () => {
    if (isAudioUnlockedRef.current) return
    const audio = matchAudioRef.current
    if (!audio) return

    audio.muted = true
    audio
      .play()
      .then(() => {
        audio.pause()
        audio.currentTime = 0
        audio.muted = false
        isAudioUnlockedRef.current = true
      })
      .catch(() => {
        audio.muted = false
      })
  }

  const handleTweetResult = () => {
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(tweetUrl, '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    if (step !== STEPS.LOADING) return
    const timer = setTimeout(() => setStep(STEPS.RESULT), 2600)
    return () => clearTimeout(timer)
  }, [step])

  useEffect(() => {
    if (step !== STEPS.RESULT) return
    const audio = matchAudioRef.current
    if (audio) {
      audio.currentTime = 0
      audio.play().catch(() => {})
    }
    // Fire-and-forget call to increment match count on GAS.
    fetch(MATCH_COUNT_ENDPOINT).catch(() => {})
  }, [step])

  const title = useMemo(() => {
    if (step === STEPS.DENIED) return '利用条件の確認'
    if (step === STEPS.GENDER) return '性別を選択してください'
    if (step === STEPS.LOADING) return '照合中'
    if (step === STEPS.RESULT) return 'マッチング成立'
    return '大阪芸術大学マッチング'
  }, [step])

  return (
    <div className="min-h-screen bg-tinder text-slate-900">
      <div className="tinder-sheen" aria-hidden="true" />
      <main className="mx-auto flex h-[100dvh] w-full max-w-md flex-col px-3 py-2 font-sans sm:px-4 sm:py-4">
        <header className="mb-3 flex items-center justify-between sm:mb-6">
          <div className="flex items-center gap-2">
            <div className="tinder-badge">MATCH</div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
              Geidai
            </p>
          </div>
          <p className="text-xs font-semibold text-slate-400">{title}</p>
        </header>

        <section className="flex flex-1 flex-col">
          <div className="tinder-card flex flex-1 flex-col">
            <AnimatePresence mode="wait">
              {step === STEPS.ENTRY && (
                <motion.div
                  key="entry"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-1 flex-col justify-between"
                >
                  <div className="space-y-4">
                    <h2 className="text-3xl font-semibold leading-tight">
                      大阪芸術大学の学生ですか？
                    </h2>
                    <p className="text-sm text-slate-500">
                      在学生限定のマッチングです。
                    </p>
                  </div>
                  <div className="tinder-action-row">
                    <button
                      type="button"
                      className="tinder-round-button is-no"
                      onClick={() => setStep(STEPS.DENIED)}
                      aria-label="NO"
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      className="tinder-round-button is-yes"
                      onClick={() => setStep(STEPS.GENDER)}
                      aria-label="YES"
                    >
                      YES
                    </button>
                  </div>
                </motion.div>
              )}

              {step === STEPS.DENIED && (
                <motion.div
                  key="denied"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-1 flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h2 className="text-2xl font-semibold">対象外です</h2>
                    <p className="text-sm text-slate-500">
                      大阪芸術大学の学生以外は利用できません。
                    </p>
                  </div>
                  <button
                    type="button"
                    className="tinder-cta ghost"
                    onClick={() => setStep(STEPS.ENTRY)}
                  >
                    戻る
                  </button>
                </motion.div>
              )}

              {step === STEPS.GENDER && (
                <motion.div
                  key="gender"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-1 flex-col justify-between"
                >
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">性別を選択</h2>
                    <div className="grid gap-3">
                      {['女性', '男性', '回答しない'].map((option) => (
                        <button
                          key={option}
                          type="button"
                          className="tinder-select"
                          onClick={() => {
                            unlockAudioIfNeeded()
                            setGender(option)
                            setStep(STEPS.LOADING)
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  {gender && (
                    <p className="text-xs tracking-[0.3em] text-slate-500">
                      選択中: {gender}
                    </p>
                  )}
                </motion.div>
              )}

              {step === STEPS.LOADING && (
                <motion.div
                  key="loading"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-1 flex-col justify-between"
                >
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.45em] text-slate-500">
                      Matching
                    </p>
                    <h2 className="text-2xl font-semibold">
                      マッチング相手を探しています...
                    </h2>
                  </div>
                  <div className="tinder-loader">
                    <motion.span
                      className="tinder-loader-bar"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2.6, ease: 'easeInOut' }}
                    />
                  </div>
                  <p className="text-sm text-slate-500">マッチ度を計測しています。</p>
                </motion.div>
              )}

              {step === STEPS.RESULT && (
                <motion.div
                  key="result"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative flex flex-1 flex-col justify-between gap-6"
                >
                  <div className="tinder-burst" aria-hidden="true">
                    {burstItems.map((item, index) => (
                      <motion.span
                        key={`${item.emoji}-${index}`}
                        className={`tinder-burst-item ${item.size}`}
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        initial={{ opacity: 0, scale: 0.4, y: 16 }}
                        animate={{
                          opacity: [0, 1, 1, 0],
                          scale: [0.7, 1.7, 1.3, 0.7],
                          y: [-40 - index * 6, -220 - index * 9, 180 + index * 12],
                          x: item.drift,
                          rotate: item.drift > 0 ? 38 : -38,
                        }}
                        transition={{
                          duration: 3,
                          delay: item.delay,
                          ease: 'easeInOut',
                        }}
                      >
                        {item.emoji}
                      </motion.span>
                    ))}
                    {burstItems.slice(0, 6).map((item, index) => (
                      <motion.span
                        key={`trail-${item.emoji}-${index}`}
                        className={`tinder-burst-item trail ${item.size}`}
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        initial={{ opacity: 0, scale: 0.3, y: 10 }}
                        animate={{
                          opacity: [0, 0.8, 0],
                          scale: [0.3, 1.1, 0.6],
                          y: [-10 - index * 4, -140 - index * 8, 120 + index * 10],
                          x: item.drift * 0.6,
                          rotate: item.drift > 0 ? 18 : -18,
                        }}
                        transition={{
                          duration: 2.2,
                          delay: item.delay + 0.15,
                          ease: 'easeOut',
                        }}
                      >
                        {item.emoji}
                      </motion.span>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={tkmt1024}
                        srcSet={`${tkmt512} 512w, ${tkmt1024} 1024w`}
                        sizes="(max-width: 640px) 88px, 120px"
                        alt="塚本邦彦のアイコン"
                        className="h-24 w-24 rounded-3xl border border-slate-200 object-cover shadow-xl"
                      />
                      <div>
                        <p className="text-xs uppercase tracking-[0.45em] text-slate-500">Match</p>
                        <h2 className="text-2xl font-semibold">塚本邦彦</h2>
                      </div>
                    </div>
                    <div className="tinder-meter">
                      <span>Match</span>
                      <strong>98%</strong>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="tinder-chip">
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        Profile
                      </p>
                      <p className="mt-2 text-lg">好きなもの: バッタ</p>
                      <p className="text-slate-600">芸術の品格は、日常の細部に宿ります。</p>
                    </div>
                    <motion.div
                      className="tinder-chip"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.4 }}
                    >
                      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                        Message
                      </p>
                      <div className="tinder-message">
                        <img
                          src={tkmt512}
                          alt="塚本邦彦"
                          className="tinder-avatar-image"
                        />
                        <div className="tinder-bubble">
                          <motion.p
                            className="tinder-message-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.3 }}
                          >
                            マッチありがとうございます。
                          </motion.p>
                        </div>
                      </div>
                      <div className="tinder-message second">
                        <img
                          src={tkmt512}
                          alt="塚本邦彦"
                          className="tinder-avatar-image"
                        />
                        <motion.div
                          className="tinder-bubble"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2, duration: 0.35 }}
                        >
                          <motion.span
                            className="tinder-typing"
                            aria-hidden="true"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0, transitionEnd: { display: 'none' } }}
                            transition={{ delay: 2.4, duration: 0.2 }}
                          >
                            <span />
                            <span />
                            <span />
                          </motion.span>
                          <motion.p
                            className="tinder-message-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.5, duration: 0.3 }}
                          >
                            バッタに興味はありますか？
                          </motion.p>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="grid gap-3">
                    <button
                      type="button"
                      className="tinder-cta ghost"
                      onClick={handleTweetResult}
                    >
                      Xでシェア
                    </button>
                    <button
                      type="button"
                      className="tinder-cta"
                      onClick={() => {
                        setGender('')
                        setStep(STEPS.ENTRY)
                      }}
                    >
                      もう一度試す
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
