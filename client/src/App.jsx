import { useEffect, useState } from 'react';

const programmes = {
  early: { number: '01', label: 'Early years', age: 'Ages 3–5', kicker: 'Play • Belong • Discover', title: 'A bright beginning for lifelong learners.', body: 'Purposeful play, language-rich spaces and caring routines help young learners feel secure as they explore their world.', points: ['Creative exploration', 'Early literacy & numeracy', 'Social-emotional growth'] },
  primary: { number: '02', label: 'Primary', age: 'Grades 1–5', kicker: 'Build • Question • Connect', title: 'Strong foundations, alive with curiosity.', body: 'Clear teaching and hands-on enquiry develop confident readers, capable mathematicians and thoughtful collaborators.', points: ['Core academic mastery', 'Project-based learning', 'Arts, sport & expression'] },
  middle: { number: '03', label: 'Middle school', age: 'Grades 6–8', kicker: 'Think • Create • Lead', title: 'Independent minds, ready for what comes next.', body: 'Students connect subject knowledge to complex problems while building ownership, resilience and leadership.', points: ['Subject depth', 'STEM & design thinking', 'Leadership opportunities'] },
  academy: { number: '04', label: 'Academy', age: 'Focused support', kicker: 'Focus • Practise • Progress', title: 'Personal support that turns effort into progress.', body: 'Small-group guidance and deliberate practice give learners the clarity and confidence to reach their next milestone.', points: ['Targeted support', 'Exam preparation', 'Progress feedback'] },
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProgramme, setActiveProgramme] = useState('early');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll-progress', `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => { revealObserver.disconnect(); window.removeEventListener('scroll', updateProgress); };
  }, []);

  async function submitEnquiry(event) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', message: '' });
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));
    const apiBase = import.meta.env.VITE_API_URL || '';
    try {
      const response = await fetch(`${apiBase}/api/enquiries`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to submit enquiry.');
      setStatus({ type: 'success', message: data.message });
      form.reset();
    } catch (error) {
      if (!apiBase && window.location.hostname.endsWith('chatgpt.site')) {
        const saved = JSON.parse(localStorage.getItem('ask-demo-enquiries') || '[]');
        localStorage.setItem('ask-demo-enquiries', JSON.stringify([...saved, { ...payload, createdAt: new Date().toISOString() }]));
        setStatus({ type: 'success', message: 'Demo enquiry saved in this browser. Connect VITE_API_URL to send it to MongoDB.' });
        form.reset();
      } else setStatus({ type: 'error', message: error.message });
    } finally { setSubmitting(false); }
  }

  const active = programmes[activeProgramme];
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="reading-progress" aria-hidden="true"></div>
    <div className="announcement"><p><span>Admissions 2026</span> Begin your child’s ASK journey</p><div className="announcement-meta"><span>Mon–Sat · 8:00–16:00</span><a href="#admissions">Start an enquiry <span aria-hidden="true">↗</span></a></div></div>
    <header className="site-header" id="top">
      <a className="brand" href="#top" aria-label="ASK School home"><img src="/assets/ask-logo.png" alt="ASK School logo" /><span><strong>ASK</strong><small>School &amp; Academy</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="#about">Our school</a><a href="#learning">Learning</a><a href="#campus">Experience</a><a href="#life">School life</a><a href="#admissions">Admissions</a></nav>
      <a className="header-cta" href="#admissions">Arrange a visit <span aria-hidden="true">↗</span></a>
      <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}><span></span><span></span></button>
      <nav className={`mobile-nav ${menuOpen ? 'open' : ''}`} id="mobile-menu" aria-label="Mobile navigation" onClick={() => setMenuOpen(false)}><a href="#about">Our school</a><a href="#learning">Learning</a><a href="#campus">Experience</a><a href="#life">School life</a><a href="#admissions">Admissions</a></nav>
    </header>

    <main id="main">
      <section className="hero">
        <div className="hero-copy reveal"><p className="eyebrow"><span></span> A school built around possibility</p><h1>Bright minds.<br /><em>Brave futures.</em></h1><p className="hero-lead">A joyful place to question, create and grow — where every learner is known, challenged and ready to shape tomorrow.</p><div className="hero-actions"><a className="button primary" href="#admissions">Explore admissions <span>↗</span></a><a className="text-link" href="#campus"><span className="play">▶</span> Experience ASK</a></div><div className="hero-note"><span className="spark">✦</span><p><strong>From early years to academy</strong><br />One thoughtful learning journey</p></div></div>
        <div className="hero-visual reveal delay-1"><div className="image-frame"><img src="/assets/classroom-hero.png" alt="Students collaborating on a classroom project with their teacher" /><div className="image-wash"></div></div><div className="hero-badge badge-top"><span>01</span><p>Ideas become<br /><strong>possibilities</strong></p></div><div className="hero-badge badge-bottom"><span className="badge-icon">✦</span><p>Learning with<br /><strong>purpose & joy</strong></p></div><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div></div>
      </section>

      <section className="expectation-strip reveal" aria-label="What families can expect"><p>What families can expect</p><div><span><b>01</b> Strong foundations</span><span><b>02</b> Caring relationships</span><span><b>03</b> Confident communication</span><span><b>04</b> Future-ready thinking</span></div></section>

      <section className="manifesto" id="about"><div className="section-number reveal">01 / OUR PROMISE</div><div className="manifesto-copy reveal"><p>More than a classroom</p><h2>Education should feel like an <em>invitation</em> — to wonder, to make, and to become.</h2></div><div className="manifesto-detail reveal delay-1"><p>At ASK, academics and character move together. Learners build strong foundations while discovering the courage to ask better questions.</p><a className="arrow-link" href="#learning">Our learning philosophy <span>→</span></a></div></section>

      <section className="values" aria-label="Our values">
        <article className="value-card blue reveal"><span className="value-no">01</span><div className="value-icon">✦</div><h3>Curious by nature</h3><p>Questions lead the way. We nurture independent thinkers who keep looking closer.</p></article>
        <article className="value-card red reveal delay-1"><span className="value-no">02</span><div className="value-icon">◎</div><h3>Kind in action</h3><p>Empathy is practised every day — in the classroom, on the field and in the community.</p></article>
        <article className="value-card yellow reveal delay-2"><span className="value-no">03</span><div className="value-icon">↗</div><h3>Ready for tomorrow</h3><p>Knowledge meets creativity, communication and the confidence to make a difference.</p></article>
      </section>

      <section className="campus-story" id="campus">
        <div className="campus-images reveal">
          <figure className="campus-main"><img src="/assets/campus-life.png" alt="Illustrative view of students arriving at a modern school campus" /><figcaption>Illustrative campus vision</figcaption></figure>
          <figure className="campus-small"><img src="/assets/early-years.png" alt="Young learners reading with their teacher" /></figure>
          <div className="campus-stamp"><strong>ASK</strong><span>Learn • Belong • Lead</span></div>
        </div>
        <div className="campus-copy reveal delay-1"><p className="eyebrow"><span></span> The ASK experience</p><h2>A place designed for<br /><em>belonging and becoming.</em></h2><p>Thoughtful spaces are only the beginning. The real difference is how learners feel within them: welcomed, secure and inspired to take the next brave step.</p><div className="experience-list"><div><span>01</span><p><strong>Known by name</strong><small>Relationships create the confidence to learn.</small></p></div><div><span>02</span><p><strong>Purposeful challenge</strong><small>High expectations meet the right support.</small></p></div><div><span>03</span><p><strong>Room to discover</strong><small>Ideas move from curiosity into action.</small></p></div></div><a className="arrow-link" href="#admissions">Arrange a guided visit <span>→</span></a></div>
      </section>

      <section className="learning" id="learning"><div className="learning-intro reveal"><div><p className="eyebrow light"><span></span> The learning journey</p><h2>Every stage,<br /><em>thoughtfully shaped.</em></h2></div><p>Age-aware experiences. Strong foundations. Room for every student to find their spark.</p></div><div className="program-shell reveal"><div className="program-tabs" role="tablist" aria-label="Learning stages">{Object.entries(programmes).map(([key, item]) => <button key={key} role="tab" aria-selected={activeProgramme === key} onClick={() => setActiveProgramme(key)}><span>{item.number}</span>{item.label}<small>{item.age}</small></button>)}</div><div className="program-content"><div className="program-panel active" role="tabpanel"><span className="program-kicker">{active.kicker}</span><h3>{active.title}</h3><p>{active.body}</p><ul>{active.points.map((point) => <li key={point}>{point}</li>)}</ul></div><div className="program-art" aria-hidden="true"><div className="sun"></div><div className="book-shape"></div><div className="program-word">ASK</div></div></div></div></section>

      <section className="school-life" id="life"><div className="life-heading reveal"><div className="section-number">02 / BEYOND THE LESSON</div><h2>School is where life<br /><em>comes alive.</em></h2></div><div className="life-grid"><LifeCard label="CREATE" art="art-studio" word="ART" title="Arts & expression" text="A space for original voices, brave ideas and imagination without limits." /><LifeCard label="MOVE" art="sport" word="GO!" title="Sport & wellbeing" text="Teamwork, movement and healthy habits that grow strength from the inside out." delay="delay-1" /><LifeCard label="EXPLORE" art="science" word="?" title="Clubs & discovery" text="New interests become real skills through science, technology and student-led clubs." delay="delay-2" /></div></section>
      <section className="motto-band" aria-label="School motto"><div>WE BUILD THE NATION <span>✦</span> WE BUILD THE NATION <span>✦</span> WE BUILD THE NATION <span>✦</span></div></section>

      <section className="admission-journey">
        <div className="journey-heading reveal"><p className="eyebrow"><span></span> A clear path to joining ASK</p><h2>Start with a conversation.<br /><em>We’ll guide the rest.</em></h2></div>
        <div className="journey-steps"><JourneyStep number="01" title="Send an enquiry" text="Tell us the learning stage you’re considering." /><JourneyStep number="02" title="Visit the school" text="Meet the team and experience the learning environment." /><JourneyStep number="03" title="Complete next steps" text="Receive age-appropriate guidance from admissions." /><JourneyStep number="04" title="Begin the journey" text="Join a community built around every learner’s growth." /></div>
      </section>

      <section className="admissions" id="admissions"><div className="admissions-card reveal"><div className="admissions-logo"><img src="/assets/ask-logo.png" alt="" /></div><div className="admissions-copy"><p className="eyebrow"><span></span> Your journey starts here</p><h2>Come and see what<br /><em>learning can feel like.</em></h2><p>Meet our team, explore the learning spaces and ask every question on your mind.</p></div><form className="enquiry-form" onSubmit={submitEnquiry}><label>Parent or guardian name<input name="name" autoComplete="name" required minLength="2" placeholder="Your full name" /></label><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" required placeholder="+92 300 000 0000" /></label><label>Interested in<select name="stage" required defaultValue=""><option value="" disabled>Choose a learning stage</option><option>Early years</option><option>Primary</option><option>Middle school</option><option>Academy</option></select></label><button className="button primary" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Request a school visit'} <span>↗</span></button><p className={`form-status ${status.type}`} role="status" aria-live="polite">{status.message}</p></form></div></section>

      <section className="faq"><div className="faq-heading reveal"><div className="section-number">03 / GOOD TO KNOW</div><h2>Questions,<br /><em>answered.</em></h2></div><div className="accordion reveal"><details><summary>How does the admissions process work?<span>+</span></summary><p>Start with an enquiry or school visit. The admissions team can then share the age-appropriate next steps and required documents.</p></details><details><summary>What makes the ASK approach different?<span>+</span></summary><p>The demo programme balances clear academic foundations with enquiry, creativity, collaboration and character development.</p></details><details><summary>Can I visit before applying?<span>+</span></summary><p>Yes. Use the visit form above and the school team can follow up with available dates.</p></details></div></section>
    </main>
    <footer><div className="footer-main"><div className="footer-brand"><img src="/assets/ask-logo.png" alt="ASK School logo" /><h2>ASK <span>School & Academy</span></h2><p>We build the nation.</p></div><div className="footer-links"><div><h3>Explore</h3><a href="#about">Our school</a><a href="#learning">Learning journey</a><a href="#life">School life</a></div><div><h3>Connect</h3><a href="#admissions">Book a visit</a><a href="mailto:admissions@example.com">Admissions email</a><a href="tel:+923000000000">+92 300 000 0000</a></div></div><a className="back-top" href="#top" aria-label="Back to top">↑</a></div><div className="footer-bottom"><p>© 2026 ASK School & Academy. Demo MERN website.</p><p>Contact details are placeholders for preview.</p></div></footer>
  </>;
}

function LifeCard({ label, art, word, title, text, delay = '' }) {
  return <article className={`life-feature reveal ${delay}`}><span>{label}</span><div className={`illustration ${art}`}><i></i><b>{word}</b></div><h3>{title}</h3><p>{text}</p></article>;
}

function JourneyStep({ number, title, text }) {
  return <article className="journey-step reveal"><span>{number}</span><div className="journey-dot"></div><h3>{title}</h3><p>{text}</p></article>;
}

export default App;
