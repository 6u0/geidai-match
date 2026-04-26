import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import tkmt512 from './assets/tkmt512.jpg'
import tkmt1024 from './assets/tkmt1024.jpg'

const STEPS = {
  ENTRY: 'entry',
  DENIED: 'denied',
  GENDER: 'gender',
  LOADING: 'loading',
  RESULT: 'result',
}

const fadeVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.35 } },
}

const burstItems = ['💘', '✨', '💖', '💫', '❤️', '🌟']

function App() {
  const [step, setStep] = useState(STEPS.ENTRY)
  const [gender, setGender] = useState('')

  useEffect(() => {
    if (step !== STEPS.LOADING) return
    const timer = setTimeout(() => setStep(STEPS.RESULT), 2600)
    return () => clearTimeout(timer)
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
      <main className="mx-auto flex min-h-[100svh] w-full max-w-md flex-col px-4 py-4 font-sans">
        <header className="mb-6 flex items-center justify-between">
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
                        key={`${item}-${index}`}
                        className="tinder-burst-item"
                        initial={{ opacity: 0, scale: 0.4, y: 16 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.4, 1.1, 0.8],
                          y: [-20 - index * 6, -120 - index * 12],
                          x: index % 2 === 0 ? 30 + index * 6 : -30 - index * 6,
                          rotate: index % 2 === 0 ? 18 : -18,
                        }}
                        transition={{
                          duration: 1.6,
                          delay: 0.15 + index * 0.05,
                          ease: 'easeOut',
                        }}
                      >
                        {item}
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
                          <span className="tinder-typing" aria-hidden="true">
                            <span />
                            <span />
                            <span />
                          </span>
                          <motion.p
                            className="tinder-message-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.3 }}
                          >
                            マッチありがとうございます。
                          </motion.p>
                          <motion.p
                            className="tinder-message-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.9, duration: 0.3 }}
                          >
                            「バッタに興味はありますか？」
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
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
