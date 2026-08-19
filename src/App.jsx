import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ChevronRight,
  Heart,
  LockKeyhole,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { memories, reasons } from './data/memories';

// Midnight on August 23, 2026 in her local Central Time.
// 12:00 AM CDT = 05:00 UTC.
const birthday = new Date('2026-08-23T05:00:00Z');

function getTimeLeft() {
  const diff = birthday.getTime() - Date.now();

  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function App() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [doorOpening, setDoorOpening] = useState(false);
  const [started, setStarted] = useState(
    Date.now() >= birthday.getTime()
  );
  const [reasonIndex, setReasonIndex] = useState(0);
  const [heartOpen, setHeartOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeLeft();

      setTimeLeft(remaining);

      if (!remaining && !started && !doorOpening) {
        setDoorOpening(true);

        setTimeout(() => {
          setStarted(true);
        }, 2200);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [started, doorOpening]);

  useEffect(() => {
    document.body.classList.toggle('experience-open', started);

    return () => {
      document.body.classList.remove('experience-open');
    };
  }, [started]);

  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });

  return (
    <main>
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.section
            key="gate"
            className="midnight-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="stars" aria-hidden="true" />

            <motion.div
              className="midnight-glow"
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.55, 0.35],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut',
              }}
            />

            <div className="midnight-content">
              <motion.div
                className="lock-mark"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
              >
                {doorOpening ? (
                  <KeyRound size={30} strokeWidth={1.4} />
                ) : (
                  <LockKeyhole size={30} strokeWidth={1.4} />
                )}
              </motion.div>

              <p className="eyebrow">
                A little surprise for you
              </p>

              <h1>
                The door opens
                <br />
                at midnight.
              </h1>

              <p className="subtle midnight-subtle">
                Something I made especially for you is waiting
                on the other side.
              </p>

              <div className="door-wrap">
                <div
                  className={`birthday-door ${
                    doorOpening ? 'opening' : ''
                  }`}
                >
                  <motion.div
                    className="door-panel door-left"
                    animate={
                      doorOpening
                        ? { rotateY: -105, x: '-4%' }
                        : { rotateY: 0, x: '0%' }
                    }
                    transition={{
                      duration: 1.8,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    <div className="door-inner">
                      <Heart
                        size={70}
                        fill="currentColor"
                        strokeWidth={1.2}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="door-panel door-right"
                    animate={
                      doorOpening
                        ? { rotateY: 105, x: '4%' }
                        : { rotateY: 0, x: '0%' }
                    }
                    transition={{
                      duration: 1.8,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                  >
                    <div className="door-inner">
                      <Heart
                        size={70}
                        fill="currentColor"
                        strokeWidth={1.2}
                      />
                    </div>
                  </motion.div>

                  <div className="door-light">
                    <Heart
                      size={86}
                      fill="currentColor"
                      strokeWidth={1}
                    />
                  </div>

                  <div className="door-handle" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {doorOpening ? (
                  <motion.div
                    key="opening"
                    className="opening-message"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="birthday-now">
                      The moment has arrived. ❤️
                    </p>
                  </motion.div>
                ) : timeLeft ? (
                  <motion.div
                    key="countdown"
                    className="countdown"
                                       aria-label="Countdown to birthday"
                  >
                    <span>
                      <strong>{timeLeft.days}</strong> days
                    </span>

                    <span>
                      <strong>
                        {String(timeLeft.hours).padStart(2, '0')}
                      </strong>{' '}
                      hrs
                    </span>

                    <span>
                      <strong>
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </strong>{' '}
                      min
                    </span>

                    <span>
                      <strong>
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </strong>{' '}
                      sec
                    </span>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {!doorOpening && timeLeft && (
                <p className="gate-note">
                  Keep this little secret until midnight. ❤️
                </p>
              )}
            </div>
          </motion.section>
        ) : (
          <motion.div
            key="experience"
            className="experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <section className="hero" id="top">
              <div className="hero-glow" />

              <div className="hero-content">
                <p className="eyebrow">23 • 08 • 2026</p>

                <h2>
                  Happy Birthday,
                  <br />
                  <em>My Love.</em>
                </h2>

                <p className="hero-copy">
                  Today is about celebrating you — the person who makes my
                  world warmer, brighter, softer, and so much more worth
                  living.
                </p>

                <button
                  className="scroll-button"
                  onClick={() => goTo('story')}
                >
                  Begin our little story <ArrowDown size={18} />
                </button>
              </div>
            </section>

            <section
              className="section story-section"
              id="story"
            >
              <SectionHeading
                kicker="OUR STORY"
                title="Every chapter brought me closer to you."
              />

              <div className="timeline">
                {memories.map((memory) => (
                  <motion.article
                    className="memory-card"
                    key={memory.title}
                    whileHover={{ y: -8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 240,
                      damping: 18,
                    }}
                  >
                    <span>{memory.year}</span>
                    <h3>{memory.title}</h3>
                    <p>{memory.text}</p>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="section reasons-section">
              <SectionHeading
                kicker="FOR YOU"
                title="A few reasons my heart keeps choosing you."
              />

              <div className="reason-stage">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reasonIndex}
                    className="reason-card"
                    initial={{
                      opacity: 0,
                      rotateY: 20,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      rotateY: 0,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      rotateY: -20,
                      x: -20,
                    }}
                    transition={{ duration: 0.35 }}
                  >
                    <Sparkles size={24} />

                    <p>{reasons[reasonIndex]}</p>

                    <small>
                      {reasonIndex + 1} / {reasons.length}
                    </small>
                  </motion.div>
                </AnimatePresence>

                <button
                  className="secondary-button"
                  onClick={() =>
                    setReasonIndex(
                      (index) =>
                        (index + 1) % reasons.length
                    )
                  }
                >
                  Give me another reason <ChevronRight size={18} />
                </button>
              </div>
            </section>

            <section className="section gallery-section">
              <SectionHeading
                kicker="OUR MEMORIES"
                title="The pictures come later. The feeling is already here."
              />

              <div className="gallery-placeholder">
                <div className="photo-frame large">
                  <span>Your favourite photo</span>
                </div>

                <div className="photo-frame">
                  <span>A silly moment</span>
                </div>

                <div className="photo-frame">
                  <span>A beautiful moment</span>
                </div>

                <div className="photo-frame wide">
                  <span>
                    One of the memories I never want to forget
                  </span>
                </div>
              </div>

              <p className="hint">
                We’ll replace these frames with your real photos.
              </p>
            </section>

            <section className="section letter-section">
              <div className="letter-card">
                <p className="eyebrow">
                  A LETTER FOR YOU
                </p>

                <h2>My love,</h2>

                <p>
                  You are the best situation oflife that i have encountered in my existence
                  knowing you is like going on an adventure that brings peace and joy, i will forever bless the day i met you, 
                  yesterday Today Tomorrow i will always choose.
                </p>

                <p>
                  We’ll make this part personal — your story,
                  your inside jokes, the things I admire about
                  you, and everything I want you to know on this
                  birthday.
                </p>

                <p className="signature">
                  Always yours.
                </p>
              </div>
            </section>

            <section className="section heart-section">
              <SectionHeading
                kicker="ONE LAST THING"
                title="There’s something inside this heart."
              />

              <button
                className={`interactive-heart ${
                  heartOpen ? 'opened' : ''
                }`}
                onClick={() => setHeartOpen(true)}
                aria-label="Open the heart"
              >
                <Heart
                  size={130}
                  fill="currentColor"
                  strokeWidth={1.2}
                />

                {!heartOpen && (
                  <span>
                    <LockKeyhole size={18} />
                    Tap the heart
                  </span>
                )}
              </button>

              <AnimatePresence>
                {heartOpen && (
                  <motion.div
                    className="hidden-message"
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <p className="eyebrow">
                      FOUND INSIDE
                    </p>

                    <h2>
                      You are my favourite part of every
                      tomorrow.
                    </h2>

                    <p>
                      And this is only the beginning of your
                      birthday surprise. ❤️
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            <footer className="footer">
              <Heart
                fill="currentColor"
                size={22}
              />

              <p>
                Made with love, for one woman in a world of
                seven billion.
              </p>

              <button
                className="top-link"
                onClick={() => goTo('top')}
              >
                Back to the beginning ↑
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function SectionHeading({ kicker, title }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{kicker}</p>
      <h2>{title}</h2>
    </div>
  );
}

export default App;