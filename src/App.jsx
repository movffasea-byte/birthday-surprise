import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDown,
  ChevronRight,
  Heart,
  LockKeyhole,
  Sparkles,
  KeyRound,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { memories, reasons } from './data/memories';
import bdaySilly from './assets/photos/bday-silly.jpg';
import bdayFavorite from './assets/photos/bday-favorite.jpg';
import bdayBeautiful from './assets/photos/bday-beautiful.jpg';
import bdayFamily from './assets/photos/bday-family.jpg';
import matrimonyAudio from './assets/music/the-matrimony.webm';

// Midnight on August 23, 2026 in her local Central Time.
// 12:00 AM CDT = 05:00 UTC.
const birthday = new Date('2026-08-23T05:00:00Z');

const previewType =
  import.meta.env.DEV 
   ? new URLSearchParams(window.location.search).get('preview')
   : null;
   
const previewExperience = previewType === 'experience';
const previewDoor =  previewType === 'door';


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
  previewExperience || Date.now() >= birthday.getTime()
);
  
  const [reasonIndex, setReasonIndex] = useState(0);
  const [heartOpen, setHeartOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(null);

  const [musicBlocked, setMusicBlocked] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
  const openDoor = () => {
    if (started || doorOpening) return;

    setDoorOpening(true);

    setTimeout(() => {
      fadeInMusic();
    }, 900);

    setTimeout(() => {
      setStarted(true);
    }, 2200);
  };

  // Development-only door preview.
  if (previewDoor && !started && !doorOpening) {
    const previewTimer = setTimeout(openDoor, 1500);

    return () => clearTimeout(previewTimer);
  }

  // Real birthday countdown.
  const timer = setInterval(() => {
    const remaining = getTimeLeft();

    setTimeLeft(remaining);

    if (!remaining && !started && !doorOpening) {
      openDoor();
    }
  }, 1000);

  return () => clearInterval(timer);
}, [previewDoor, started, doorOpening]);

  useEffect(() => {
    document.body.classList.toggle('experience-open', started);

    return () => {
      document.body.classList.remove('experience-open');
    };
  }, [started]);

  const fadeInMusic = async () => {
  const audio = audioRef.current;

  if (!audio) return;

  audio.volume = 0;

  try {
    await audio.play();

    setMusicBlocked(false);
    setMusicPlaying(true);

    let volume = 0;

    const fade = setInterval(() => {
      volume += 0.04;

      if (volume >= 0.5) {
        audio.volume = 0.5;
        clearInterval(fade);
        return;
      }

      audio.volume = volume;
    }, 120);
  } catch {
    setMusicBlocked(true);
    setMusicPlaying(false);
  }
};

const toggleMusic = async () => {
  const audio = audioRef.current;

  if (!audio) return;

  if (audio.paused) {
    try {
      await audio.play();
      setMusicBlocked(false);
      setMusicPlaying(true);
    } catch {
      setMusicBlocked(true);
    }
    return;
  }

  audio.pause();
  setMusicPlaying(false);
};

  const goTo = (id) =>
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    });

  return (
    <main>

   {(started || doorOpening) && (
      <audio
        ref={audioRef}
        src={matrimonyAudio}
        preload="auto"
        loop
      />
   )}

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

         <div className="music-control">
            {musicBlocked && (
              <button
                type="button"
                className="music-button"
                onClick={fadeInMusic}
                aria-label="Start birthday music"
              >
                <Volume2 size={16} />
                <span>Tap to hear this moment</span>
              </button>
            )}

            {!musicBlocked && (
              <button
                type="button"
                className="music-icon-button"
                onClick={toggleMusic}
                aria-label={musicPlaying ? 'Pause music' : 'Play music'}
              >
                {musicPlaying ? (
                  <Volume2 size={18} />
                ) : (
                  <VolumeX size={18} />
                )}
              </button>
            )}
          </div>   

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
                  Today is about celebrating the person who makes my
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

            <section className="section gallery-section" id="memories">
              <SectionHeading
                kicker="OUR MEMORIES"
                title="A few moments I’ll always keep close to my heart."
              />

              <motion.div
                className="gallery-intro"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7 }}
              >
                <span>OUR LITTLE MOMENTS</span>
                <p>
                  Some memories deserve more than a place in a gallery.
                  They deserve to be felt again.
                </p>
              </motion.div>

              <div className="cinematic-gallery">
                <motion.button
                  type="button"
                  className="cinematic-photo photo-1"
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.7 }}
                  onClick={() => setActivePhoto(0)}
                >
                  <img
                    src={bdaySilly}
                    alt="One of our silly moments"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="cinematic-vignette" />

                  <div className="cinematic-caption">
                    <span>THE SILLY ONES</span>
                    <strong>
                      Because apparently we know how to make each other laugh.
                    </strong>
                  </div>

                  <div className="photo-number">01</div>
                </motion.button>

                <motion.button
                  type="button"
                  className="cinematic-photo photo-2"
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.8, delay: 0.08 }}
                  onClick={() => setActivePhoto(1)}
                >
                  <img
                    src={bdayFavorite}
                    alt="My favourite photo of you"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="cinematic-vignette" />

                  <div className="cinematic-caption">
                    <span>MY FAVOURITE</span>
                    <strong>
                      One of those pictures I could look at forever.
                    </strong>
                  </div>

                  <div className="photo-number">02</div>
                </motion.button>

                <motion.button
                  type="button"
                  className="cinematic-photo photo-3"
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.8, delay: 0.16 }}
                  onClick={() => setActivePhoto(2)}
                >
                  <img
                    src={bdayBeautiful}
                    alt="A beautiful moment"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="cinematic-vignette" />

                  <div className="cinematic-caption">
                    <span>BEAUTIFUL YOU</span>
                    <strong>
                      Your eyes still gets me every time.
                    </strong>
                  </div>

                  <div className="photo-number">03</div>
                </motion.button>

                <motion.button
                  type="button"
                  className="cinematic-photo photo-4"
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.8, delay: 0.24 }}
                  onClick={() => setActivePhoto(3)}
                >
                  <img
                    src={bdayFamily}
                    alt="A family memory"
                    loading="lazy"
                    decoding="async"
                  />

                  <div className="cinematic-vignette" />

                  <div className="cinematic-caption">
                    <span>OUR JOURNEY</span>
                    <strong>
                      A glimpse of the family and future we're building.
                    </strong>
                  </div>

                  <div className="photo-number">04</div>
                </motion.button>
              </div>

              <p className="gallery-note">
                Tap a memory to see it properly. ❤️
              </p>
            </section>


      <section className="section letter-section" id="letter">
            <motion.div
                className="letter-card"
                initial={{ opacity: 0, y: 45, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <motion.p
                  className="eyebrow"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                >
                  A LETTER FOR YOU
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                >
                  My Moonpie,
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.75 }}
                >
                  You are the best situation of life that I have encountered
                  in my existence. Knowing you is like going on an adventure
                  that brings peace and joy. I will forever bless the day I
                  met you. Yesterday, today, tomorrow I will always choose you.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.75 }}
                >
                  The moments you smile, frown, rejoice, appreciate, cry,
                  complain, compliment, encourage, discourage, teach, learn,
                  play, laugh, sing, dance, walk, talk, listen, share —
                  and everything in between — are the moments I will always
                  cherish and hold dear to my heart.
                </motion.p>

                <motion.div
                  className="letter-divider"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9, duration: 0.7 }}
                />

                <motion.p
                  className="letter-closing"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.7 }}
                >
                  And on your birthday, I just want you to know that
                  choosing you is still one of the easiest decisions my heart makes.
                </motion.p>

                <motion.p
                  className="signature"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.7 }}
                >
                  Always yours.
                </motion.p>
              </motion.div>
          </section>
    

    <section className="section heart-section final-heart-section">
      <motion.div
        className="final-heart-intro"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.8 }}
      >
        <p className="eyebrow">ONE LAST THING</p>

        <h2>
          There’s something
          <br />
          <em>inside this heart.</em>
        </h2>

        <p className="final-heart-subtitle">
          You’ve reached the end of the story…
          <br />
          but not the end of us.
        </p>
      </motion.div>

      <motion.button
        type="button"
        className={`final-heart ${heartOpen ? 'opened' : ''}`}
        onClick={() => setHeartOpen(true)}
        whileTap={{ scale: 0.92 }}
        animate={
          heartOpen
            ? {
                scale: [1, 1.22, 1],
                rotate: [0, -3, 3, 0],
              }
            : {
                scale: [1, 1.05, 1],
              }
        }
        transition={{
          duration: heartOpen ? 1.1 : 2.2,
          repeat: heartOpen ? 0 : Infinity,
          ease: 'easeInOut',
        }}
        aria-label="Open the final heart"
      >
        <Heart
          size={170}
          fill="currentColor"
          strokeWidth={1}
        />

        {!heartOpen && (
          <span>
            <LockKeyhole size={17} />
            Open my heart
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {heartOpen && (
          <motion.div
            className="final-message"
            initial={{
              opacity: 0,
              y: 35,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className="final-spark"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              <Sparkles size={22} />
            </motion.div>

            <p className="eyebrow">FOUND INSIDE</p>

            <h2>
              You are my favourite part
              <br />
              of every tomorrow.
            </h2>

            <p className="final-message-copy">
              Many more birthdays, memories, adventures,
              ordinary days and extraordinary ones await us.
            </p>

            <p className="final-message-copy">
              And through all of them, I want to keep doing
              the simplest thing I know how to do:
              <strong> choosing you.</strong>
            </p>

            <div className="final-divider" />

            <p className="final-promise">
              Till hell freezes.
              <br />
              Till thy kingdom come.
            </p>

            <p className="final-signature">
              Forever yours, Moonpie. ❤️
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