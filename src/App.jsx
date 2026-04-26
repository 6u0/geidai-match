import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

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
    <div className="min-h-screen bg-luxury text-white">
      <div className="lux-stars" aria-hidden="true" />
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-16 font-sans">
        <header className="mb-10 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.5em] text-gold/70">
              Osaka University of Arts
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl">
              {title}
            </h1>
          </div>
          <div className="hidden rounded-full border border-gold/30 px-5 py-2 text-xs tracking-[0.4em] text-gold/80 sm:block">
            2026
          </div>
        </header>

        <section className="glass-panel relative overflow-hidden">
          <div className="lux-glow" aria-hidden="true" />
          <AnimatePresence mode="wait">
            {step === STEPS.ENTRY && (
              <motion.div
                key="entry"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-10"
              >
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.4em] text-gold/70">
                    Admission Check
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl">
                    大阪芸術大学の学生ですか？
                  </h2>
                  <p className="max-w-2xl text-white/70">
                    本サービスは大阪芸術大学の在学生に限定された、特別なマッチング体験です。
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    className="lux-button"
                    onClick={() => setStep(STEPS.GENDER)}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    className="lux-button ghost"
                    onClick={() => setStep(STEPS.DENIED)}
                  >
                    NO
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
                className="space-y-6"
              >
                <h2 className="font-serif text-3xl">大阪芸術大学の学生以外は利用できません</h2>
                <p className="text-white/70">またの機会をお待ちしています。</p>
                <button
                  type="button"
                  className="lux-button ghost"
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
                className="space-y-8"
              >
                <p className="text-sm uppercase tracking-[0.4em] text-gold/70">
                  Select Gender
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {['女性', '男性', '回答しない'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className="lux-select"
                      onClick={() => {
                        setGender(option)
                        setStep(STEPS.LOADING)
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {gender && (
                  <p className="text-xs tracking-[0.3em] text-gold/70">
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
                className="grid gap-8"
              >
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.4em] text-gold/70">
                    Searching
                  </p>
                  <h2 className="font-serif text-3xl sm:text-4xl">
                    マッチング相手を探しています...
                  </h2>
                </div>
                <div className="lux-loader">
                  <motion.span
                    className="lux-loader-bar"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.6, ease: 'easeInOut' }}
                  />
                </div>
                <p className="text-white/60">
                  芸術性、品格、思想の共鳴度を評価しています。
                </p>
              </motion.div>
            )}

            {step === STEPS.RESULT && (
              <motion.div
                key="result"
                variants={fadeVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid gap-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.4em] text-gold/70">
                      Matched
                    </p>
                    <h2 className="font-serif text-4xl">塚本邦彦</h2>
                    <p className="text-white/70">
                      学長らしい格言: 「芸術は、沈黙の中にこそ真価が宿る。」
                    </p>
                  </div>
                  <span className="hidden rounded-full border border-gold/40 px-4 py-2 text-xs tracking-[0.35em] text-gold/70 sm:block">
                    Premium
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr]">
                  <div className="lux-profile">
                    <p className="text-xs uppercase tracking-[0.35em] text-gold/70">
                      Profile
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-white/50">名前</p>
                        <p className="text-lg">塚本邦彦</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">好きなもの</p>
                        <p className="text-lg">バッタ</p>
                      </div>
                      <div>
                        <p className="text-xs text-white/50">一言</p>
                        <p className="text-lg">
                          芸術の品格は、日常の細部に宿ります。
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="lux-card">
                    <p className="text-xs uppercase tracking-[0.35em] text-gold/70">
                      Match Score
                    </p>
                    <p className="font-serif text-5xl text-gold">98</p>
                    <p className="text-white/60">
                      学長級の感性に最も近い候補として選出されました。
                    </p>
                  </div>
                </div>
                <motion.div
                  className="lux-profile"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-gold/70">
                    Message
                  </p>
                  <p className="mt-3 text-lg">
                    塚本邦彦: 「バッタに興味はありますか？」
                  </p>
                </motion.div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    className="lux-button"
                    onClick={() => {
                      setGender('')
                      setStep(STEPS.ENTRY)
                    }}
                  >
                    もう一度試す
                  </button>
                  <button type="button" className="lux-button ghost">
                    プロフィールを保存
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  )
}

export default App
