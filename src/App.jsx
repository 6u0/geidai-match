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
    <div className="min-h-screen bg-tinder text-white">
      <div className="tinder-sheen" aria-hidden="true" />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-10 font-sans">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="tinder-badge">ART</div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">
                Geidai Match
              </p>
              <h1 className="font-serif text-2xl sm:text-3xl">{title}</h1>
            </div>
          </div>
          <div className="hidden rounded-full border border-white/20 px-4 py-2 text-xs tracking-[0.35em] text-white/60 sm:block">
            OSAKA
          </div>
        </header>

        <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center">
          <div className="tinder-card">
            <AnimatePresence mode="wait">
              {step === STEPS.ENTRY && (
                <motion.div
                  key="entry"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                      Admission Check
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl">
                      大阪芸術大学の学生ですか？
                    </h2>
                    <p className="text-white/70">
                      芸大生だけが辿り着ける、極秘のマッチングフロア。
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      className="tinder-cta"
                      onClick={() => setStep(STEPS.GENDER)}
                    >
                      YES
                    </button>
                    <button
                      type="button"
                      className="tinder-cta ghost"
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
                  className="space-y-8"
                >
                  <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                    Select Gender
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
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
                  {gender && (
                    <p className="text-xs tracking-[0.3em] text-white/60">
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
                    <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                      Searching
                    </p>
                    <h2 className="font-serif text-3xl sm:text-4xl">
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
                  className="grid gap-7"
                >
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={tkmt1024}
                        srcSet={`${tkmt512} 512w, ${tkmt1024} 1024w`}
                        sizes="(max-width: 640px) 88px, 120px"
                        alt="塚本邦彦のアイコン"
                        className="h-24 w-24 rounded-3xl border border-white/30 object-cover shadow-2xl sm:h-28 sm:w-28"
                      />
                      <div>
                        <p className="text-xs uppercase tracking-[0.45em] text-white/60">
                          Matched
                        </p>
                        <h2 className="font-serif text-3xl sm:text-4xl">塚本邦彦</h2>
                        <p className="text-white/70">
                          学長らしい格言: 「芸術は、沈黙の中にこそ真価が宿る。」
                        </p>
                      </div>
                    </div>
                    <div className="tinder-meter">
                      <span>Match</span>
                      <strong>98%</strong>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="tinder-chip">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                        Profile
                      </p>
                      <p className="mt-2 text-lg">好きなもの: バッタ</p>
                      <p className="text-white/60">芸術の品格は、日常の細部に宿ります。</p>
                    </div>
                    <div className="tinder-chip">
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                        Message
                      </p>
                      <p className="mt-2 text-lg">塚本邦彦: 「バッタに興味はありますか？」</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
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
                    <button type="button" className="tinder-cta ghost">
                      プロフィールを保存
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
