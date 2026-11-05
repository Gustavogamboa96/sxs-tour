import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FALLA_BOCONO_CONFIG as CFG, formatUSD, formatUSDShort } from '../../config/fallaBoconoConfig';
import useFundraisingProgress from './useFundraisingProgress';
import { COVER_IMAGES, coverStyleVars } from './coverLayout';
import GoalProgress from './GoalProgress';
import './FallaBoconoExperience.css';

const SECTIONS = [
  { id: 'fb-inicio', num: '01', label: 'Inicio' },
  { id: 'fb-contexto', num: '02', label: 'Diagnóstico' },
  { id: 'fb-ayudar', num: '03', label: 'Cómo aportar' },
  { id: 'fb-meta', num: '04', label: 'La meta' },
  { id: 'fb-como-vamos', num: '05', label: 'Cómo vamos' },
  { id: 'fb-ep', num: '06', label: 'El EP' },
  { id: 'fb-quienes', num: '07', label: 'Quiénes' },
  { id: 'fb-sumarte', num: '08', label: 'Contacto' },
];

const RELEASE_NOTE =
  'Cada aporte nos acerca a nueva música. FALLA/BOCONÓ se irá liberando a medida que alcancemos las metas de recaudación de Volver a Sonar. Comenzamos con AM / FM el 5 de noviembre. Tú decides qué tan pronto escuchamos lo que sigue.';

function Slash({ className = '' }) {
  return <span className={`fb-slash ${className}`}>/</span>;
}

function Wordmark({ as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`fb-wordmark ${className}`}>
      FALLA<Slash />BOCONÓ
    </Tag>
  );
}

function SectionHead({ num, title, kicker, tone = 'cream' }) {
  return (
    <header className={`fb-head fb-head--${tone} fb-reveal`}>
      <span className="fb-head__num">{num}</span>
      {kicker && <span className="fb-head__kicker">{kicker}</span>}
      <h2 className="fb-head__title">{title}</h2>
    </header>
  );
}

function ExternalLink({ href, external, className, children, ...rest }) {
  const ext = external || /^https?:/.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

function useMedia(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [match, setMatch] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

function useViewport() {
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        // ignore small height changes from mobile URL bars so the cover doesn't jump
        setVp((prev) => {
          const w = window.innerWidth;
          const h = window.innerHeight;
          if (w === prev.w && Math.abs(h - prev.h) < 120) return prev;
          return { w, h };
        });
      });
    };
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', on);
    };
  }, []);
  return vp;
}

/* ── Formas de ayudar ───────────────────────────────────────── */

function WayDetail({ way, index }) {
  return (
    <div className="fb-way__detail">
      <div className="fb-way__price-row">
        <span className="fb-way__price">{way.price}</span>
        <span className="fb-way__price-note">{way.priceNote}</span>
      </div>
      <p className="fb-way__body">{way.body}</p>
      {way.ticketLinks ? (
        <div className="fb-way__ticket-links">
          {way.ticketLinks.map((link) => (
            <ExternalLink
              key={link.linkKey}
              href={CFG.links[link.linkKey]}
              className="fb-btn fb-btn--cream fb-way__cta"
            >
              {link.label}
              <span className="fb-btn__arrow" aria-hidden="true">↗</span>
            </ExternalLink>
          ))}
        </div>
      ) : CFG.links[way.linkKey] ? (
        <ExternalLink
          href={CFG.links[way.linkKey]}
          external={way.external}
          className="fb-btn fb-btn--cream fb-way__cta"
          data-way={way.id}
        >
          {way.cta}
          <span className="fb-btn__arrow" aria-hidden="true">{way.external ? '↗' : '→'}</span>
        </ExternalLink>
      ) : null}
      <span className="fb-way__count" aria-hidden="true">
        {String(index + 1).padStart(2, '0')} / {String(CFG.ways.length).padStart(2, '0')}
      </span>
    </div>
  );
}

function WaysChooser({ active, onSelect, wide }) {
  const activeIndex = CFG.ways.findIndex((w) => w.id === active);
  const listRef = useRef(null);
  const anchorRef = useRef(null);

  // Collapsing the item above shifts everything (iOS Safari has no scroll
  // anchoring), so keep the tapped header exactly where the finger left it.
  useLayoutEffect(() => {
    const anchor = anchorRef.current;
    anchorRef.current = null;
    if (!anchor) return;
    const scroller = anchor.el.closest('.fb');
    if (!scroller) return;
    scroller.scrollTop += anchor.el.getBoundingClientRect().top - anchor.top;
    const navH = parseFloat(getComputedStyle(scroller).getPropertyValue('--nav-h')) || 56;
    const top = anchor.el.getBoundingClientRect().top;
    if (top < navH + 8) scroller.scrollTop -= navH + 8 - top;
  }, [active]);

  const onKey = (e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key)) return;
    e.preventDefault();
    const from = Math.max(0, activeIndex);
    const next = (from + (e.key === 'ArrowDown' ? 1 : -1) + CFG.ways.length) % CFG.ways.length;
    onSelect(CFG.ways[next].id);
    listRef.current?.querySelectorAll('[role="tab"]')[next]?.focus();
  };

  if (wide) {
    const current = Math.max(0, activeIndex);
    return (
      <div className="fb-ways fb-ways--wide">
        <div className="fb-ways__side">
          <div className="fb-ways__list" role="tablist" aria-orientation="vertical" ref={listRef} onKeyDown={onKey}>
            {CFG.ways.map((w, i) => (
              <button
                key={w.id}
                type="button"
                role="tab"
                id={`fb-way-tab-${w.id}`}
                aria-selected={i === current}
                aria-controls={`fb-way-panel-${w.id}`}
                tabIndex={i === current ? 0 : -1}
                className={`fb-way-tab ${i === current ? 'is-active' : ''}`}
                onClick={() => onSelect(w.id)}
              >
                <span className="fb-way-tab__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="fb-way-tab__text">
                  <span className="fb-way-tab__title">{w.title}</span>
                  <span className="fb-way-tab__aud">
                    {w.audience}
                    {w.featured && <span className="fb-way-tab__flag">Vía principal</span>}
                  </span>
                </span>
                <span className="fb-way-tab__price">{w.price}</span>
              </button>
            ))}
          </div>
          <div className="fb-ways__aside">
            <span className="fb-label">Cada aporte suma a la meta</span>
            <GoalProgress variant="stone" size="compact" />
          </div>
        </div>
        <div className="fb-ways__panels">
          {CFG.ways.map((w, i) => (
            <div
              key={w.id}
              className={`fb-ways__panel ${i === current ? 'is-active' : ''}`}
              role="tabpanel"
              id={`fb-way-panel-${w.id}`}
              aria-labelledby={`fb-way-tab-${w.id}`}
              aria-hidden={i !== current || undefined}
              inert={i !== current ? '' : undefined}
            >
              <h3 className="fb-ways__panel-title">{w.title}</h3>
              <WayDetail way={w} index={i} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fb-ways fb-ways--stack">
      {CFG.ways.map((w, i) => {
        const open = active === w.id;
        return (
          <div key={w.id} className={`fb-acc ${open ? 'is-open' : ''}`} data-way-anchor={w.id}>
            <h3 className="fb-acc__h">
              <button
                type="button"
                className="fb-acc__btn"
                aria-expanded={open}
                aria-controls={`fb-acc-${w.id}`}
                onClick={(e) => {
                  anchorRef.current = { el: e.currentTarget, top: e.currentTarget.getBoundingClientRect().top };
                  onSelect(open ? null : w.id);
                }}
              >
                <span className="fb-way-tab__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="fb-way-tab__text">
                  <span className="fb-way-tab__title">{w.title}</span>
                  <span className="fb-way-tab__aud">
                    {w.audience}
                    {w.featured && <em> · Vía principal</em>}
                  </span>
                </span>
                <span className="fb-acc__icon" aria-hidden="true" />
              </button>
            </h3>
            <div id={`fb-acc-${w.id}`} className="fb-acc__panel" hidden={!open}>
              <WayDetail way={w} index={i} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Página ─────────────────────────────────────────────────── */

export default function FallaBoconoExperience({ onClose, hidden = false, coverRef }) {
  const rootRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [indexOpen, setIndexOpen] = useState(false);
  const [openContributorSections, setOpenContributorSections] = useState([]);
  const vp = useViewport();
  const progress = useFundraisingProgress();
  const wideWays = useMedia('(min-width: 900px)');
  const [way, setWay] = useState('bandcamp');
  const coverVars = useMemo(() => ({ ...coverStyleVars(vp.w, vp.h), '--cv-h': `${vp.h}px` }), [vp]);

  const scrollToEl = useCallback((el, gap = 0) => {
    const root = rootRef.current;
    if (!root || !el) return;
    const navH = parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 56;
    const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - navH - gap;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    setIndexOpen(false);
  }, []);

  const scrollToId = useCallback((id) => {
    scrollToEl(rootRef.current?.querySelector(`#${id}`));
  }, [scrollToEl]);

  // Jump straight to one donation option (opens it on mobile)
  const goToWay = useCallback((id) => {
    setWay(id);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const root = rootRef.current;
      const target = wideWays
        ? root?.querySelector('#fb-ayudar')
        : root?.querySelector(`[data-way-anchor="${id}"]`);
      scrollToEl(target, wideWays ? 0 : 12);
    }));
  }, [scrollToEl, wideWays]);

  // Focus + keyboard
  useEffect(() => {
    if (hidden) return undefined;
    rootRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (indexOpen) setIndexOpen(false);
      else onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hidden, onClose, indexOpen]);

  // Nav state on scroll
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(root.scrollTop > window.innerHeight * 0.55));
    };
    root.addEventListener('scroll', on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener('scroll', on);
    };
  }, []);

  // Reveal on scroll + active section
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          reveal.unobserve(en.target);
        }
      }),
      { root, rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    root.querySelectorAll('.fb-reveal').forEach((el) => reveal.observe(el));

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActiveSection(en.target.id);
        });
      },
      { root, rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    SECTIONS.forEach((s) => {
      const el = root.querySelector(`#${s.id}`);
      if (el) spy.observe(el);
    });
    return () => {
      reveal.disconnect();
      spy.disconnect();
    };
  }, []);

  const totalBreakdown = CFG.breakdown.reduce((a, b) => a + b.amountUSD, 0);
  const ctx = CFG.context;
  const totalTrackCount = CFG.tracklist.length;
  const amfmTrack = CFG.tracklist.find((track) => track.title === 'AM / FM');
  const launchReached = !amfmTrack?.releaseAt || Date.now() >= amfmTrack.releaseAt.getTime();
  const nextMilestone = CFG.releaseMilestones.find((milestone) => progress.raisedUSD < milestone.amountUSD);
  const releaseTracks = CFG.tracklist.map((track) => ({
    ...track,
    unlocked: progress.raisedUSD >= track.unlockUSD
      && (!track.releaseAt || Date.now() >= track.releaseAt.getTime()),
  }));
  const unlockedTrackCount = releaseTracks.filter((track) => track.unlocked).length;
  const storyItems = CFG.focusStories
    .filter((story) => story.unlockUSD <= progress.raisedUSD || story.id === 'amfm')
    .map((story) => ({ ...story, track: releaseTracks.find((track) => track.title === story.title) }));
  releaseTracks
    .filter((track) => track.unlocked)
    .forEach((track) => {
      if (!storyItems.some((story) => story.title === track.title)) {
        storyItems.push({
          id: `track-${track.num}`,
          title: track.title,
          meta: [],
          body: 'La historia y los materiales de esta canción se publicarán cuando estén disponibles.',
          image: '',
          track,
        });
      }
    });

  return (
    <article
      ref={rootRef}
      className={`fb ${hidden ? 'is-hidden' : 'is-ready'}`}
      tabIndex={-1}
      aria-label="FALLA/BOCONÓ x VOLVER A SONAR"
      aria-hidden={hidden || undefined}
    >
      {/* ── Barra superior ── */}
      <nav className={`fb-nav ${scrolled ? 'is-solid' : ''}`} aria-label="Navegación de la campaña">
        <div className="fb-nav__left">
          <button type="button" className="fb-nav__back" onClick={onClose} aria-label="Volver al radar">
            <span className="fb-nav__arrow" aria-hidden="true">←</span>
            <span className="fb-nav__back-label">Radar</span>
            <kbd className="fb-nav__kbd">ESC</kbd>
          </button>
          <button
            type="button"
            className="fb-nav__brand"
            onClick={() => rootRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            tabIndex={scrolled ? 0 : -1}
          >
            <Wordmark />
          </button>
        </div>

        <button
          type="button"
          className="fb-nav__goal"
          onClick={() => scrollToId('fb-meta')}
          aria-label={`Meta: ${formatUSD(progress.raisedUSD)} de ${formatUSD(progress.goalUSD)}, ${progress.percent}% recaudado`}
        >
          <span className="fb-nav__goal-pct">{progress.percent}%</span>
          <span className="fb-nav__goal-bar" aria-hidden="true">
            <span className="fb-nav__goal-fill" style={{ transform: `scaleX(${progress.ratio})` }} />
            <span className="fb-nav__goal-cursor" style={{ left: `${progress.ratio * 100}%` }} />
          </span>
          <span className="fb-nav__goal-txt" aria-hidden="true">
            <span className="fb-nav__goal-long">
              {formatUSD(progress.raisedUSD)} <span className="fb-nav__goal-of">/ {formatUSD(progress.goalUSD)}</span>
            </span>
            <span className="fb-nav__goal-short">
              {formatUSDShort(progress.raisedUSD)} <span className="fb-nav__goal-of">/ {formatUSDShort(progress.goalUSD)}</span>
            </span>
          </span>
        </button>

        <div className="fb-nav__right">
          <button type="button" className="fb-nav__cta" onClick={() => scrollToId('fb-ayudar')}>Apoyar</button>
          <button
            type="button"
            className="fb-nav__menu"
            aria-expanded={indexOpen}
            aria-controls="fb-index"
            onClick={() => setIndexOpen((v) => !v)}
          >
            <span className="fb-sr">Índice</span>
            <span className="fb-nav__menu-lines" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ── Índice: riel (desktop) / hoja (móvil) ── */}
      <ol className="fb-rail" aria-label="Secciones">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={activeSection === s.id ? 'is-active' : ''}
              onClick={() => scrollToId(s.id)}
              aria-current={activeSection === s.id ? 'true' : undefined}
            >
              <span className="fb-rail__num">{s.num}</span>
              <span className="fb-rail__label">{s.label}</span>
            </button>
          </li>
        ))}
      </ol>

      <div id="fb-index" className={`fb-index ${indexOpen ? 'is-open' : ''}`} hidden={!indexOpen}>
        <div className="fb-index__inner">
          <span className="fb-index__kicker">Índice</span>
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button type="button" onClick={() => scrollToId(s.id)} className={activeSection === s.id ? 'is-active' : ''}>
                  <span className="fb-index__num">{s.num}</span>
                  <span>{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
          <GoalProgress variant="stone" size="compact" />
          <button type="button" className="fb-btn fb-btn--ghost fb-index__back" onClick={onClose}>← Volver al radar</button>
        </div>
      </div>

      {/* ── Portada (idéntica a la hoja que se desarruga) ── */}
      <section id="fb-inicio" className="fb-cover" style={coverVars} aria-label="Portada" ref={coverRef}>
        <h1 className="fb-cover__title">
          <img
            src={COVER_IMAGES.logo}
            alt="Volver a Sonar · FALLA/BOCONÓ · La Vida Bohème"
            width="2604"
            height="705"
            fetchpriority="high"
          />
        </h1>
        <div className="fb-cover__cta">
          <div className="fb-cover__intro">
            <h2>La música también necesita reconstruirse.</h2>
            <p>
              La Vida Bohème se suma a Volver a Sonar para apoyar a la Orquesta Sinfónica Gran Mariscal de Ayacucho a
              recuperar herramientas esenciales para continuar su trabajo.
            </p>
          </div>
          <button type="button" className="fb-cover__goal" onClick={() => scrollToId('fb-meta')}>
            <span className="fb-cover__goal-row">
              <span>
                {formatUSD(progress.raisedUSD)} <span className="fb-cover__goal-of">de {formatUSD(progress.goalUSD)}</span>
              </span>
              <strong>{progress.percent}%</strong>
            </span>
            <span className="fb-cover__goal-bar" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress.ratio})` }} />
            </span>
          </button>
          <div className="fb-cover__btns">
            <button type="button" className="fb-btn fb-btn--ink" onClick={() => scrollToId('fb-ayudar')}>
              Elige cómo aportar <span className="fb-btn__arrow fb-btn__arrow--down" aria-hidden="true">↓</span>
            </button>
            <ExternalLink href={CFG.links.bandcamp} className="fb-btn fb-btn--line">
              Bandcamp <span className="fb-btn__arrow" aria-hidden="true">↗</span>
            </ExternalLink>
          </div>
        </div>
      </section>

      {/* ── 02 · Diagnóstico ── */}
      <section id="fb-contexto" className="fb-sec fb-sec--light fb-context">
        <SectionHead num="02" kicker="El punto de partida" title="Una orquesta que necesita seguir sonando" tone="ink" />
        <div className="fb-context__grid">
          <div className="fb-prose fb-reveal">
            <p>
              En junio de 2026, durante las Fiestas de San Juan, los terremotos que afectaron La Guaira y Caracas dejaron
              consecuencias importantes para integrantes de la Fundación de la Orquesta Sinfónica Gran Mariscal de Ayacucho.
            </p>
            <p>
              Además de las afectaciones personales y familiares (de los 68 integrantes, 32 reportaron afectación directa en
              su vivienda o entorno familiar, 8 con daños severos), 51 músicos reportaron necesidades relacionadas con sus
              herramientas de trabajo en la orquesta. Los daños suman un valor económico de $24.547,00 USD.
            </p>
            <p>
              La primera etapa de Volver a Sonar contempla la reparación de instrumentos (4 contrabajos, 1 arpa clásica,
              cuerdas, cañas, arcos, puentes y trabajos de luthería), la reposición de materiales indispensables para la
              interpretación musical y kits de continuidad para 51 músicos, además de necesidades operativas esenciales del staff.
            </p>
            <p className="fb-prose__strong">Nuestra primera meta es reunir US$25.000 para atender estas necesidades.</p>
            <button type="button" className="fb-btn fb-btn--ink fb-context__cta" onClick={() => scrollToId('fb-ayudar')}>
              Elige cómo aportar <span className="fb-btn__arrow fb-btn__arrow--down" aria-hidden="true">↓</span>
            </button>
          </div>

          <dl className="fb-figures fb-reveal">
            <div className="fb-figure fb-figure--wide">
              <dd>{ctx.musiciansInNeed}</dd>
              <dt>músicos reportaron necesidades en sus herramientas de trabajo</dt>
            </div>
            <div className="fb-figure">
              <dd>{ctx.affectedHomes}<small>/{ctx.members}</small></dd>
              <dt>integrantes con afectación directa en su vivienda o entorno</dt>
            </div>
            <div className="fb-figure">
              <dd>{ctx.severeDamage}</dd>
              <dt>con daños severos</dt>
            </div>
            <div className="fb-figure fb-figure--wide">
              <dd>{formatUSD(ctx.damageUSD)}</dd>
              <dt>valor económico de los daños</dt>
            </div>
          </dl>
        </div>

        <div className="fb-breakdown fb-reveal">
          <div className="fb-breakdown__head">
            <span className="fb-label">Etapa 1 · Diagnóstico</span>
            <span className="fb-label">{formatUSD(totalBreakdown)}</span>
          </div>
          <div className="fb-breakdown__bar" role="img" aria-label="Desglose del diagnóstico de la etapa 1">
            {CFG.breakdown.map((b, i) => (
              <span key={b.id} className={`fb-breakdown__seg fb-breakdown__seg--${i}`} style={{ flexGrow: b.amountUSD }} />
            ))}
          </div>
          <ul className="fb-breakdown__legend">
            {CFG.breakdown.map((b, i) => (
              <li key={b.id}>
                <span className={`fb-breakdown__dot fb-breakdown__seg--${i}`} aria-hidden="true" />
                <span className="fb-breakdown__name">{b.label}</span>
                <span className="fb-breakdown__amt">{formatUSD(b.amountUSD)}</span>
                <span className="fb-breakdown__pct">{Math.round((b.amountUSD / totalBreakdown) * 100)}%</span>
              </li>
            ))}
          </ul>
          <p className="fb-breakdown__note">
            La meta de US$25.000 contempla las necesidades prioritarias identificadas para la orquesta y una asignación
            parcial de US$453 para gastos de coordinación y gestión de la iniciativa de recaudación.
          </p>
        </div>
      </section>

      {/* ── 03 · Cómo aportar ── */}
      <section id="fb-ayudar" className="fb-sec fb-sec--mid fb-help">
        <div className="fb-help__inner">
          <SectionHead num="03" kicker="Elige cómo sumarte" title="Hay muchas formas de aportar" />
          <div className="fb-reveal">
            <WaysChooser active={way} onSelect={setWay} wide={wideWays} />
          </div>
        </div>
        <div className="fb-help__relief" aria-hidden="true" />
      </section>

      {/* ── 04 · Meta ── */}
      <section id="fb-meta" className="fb-sec fb-sec--dark fb-goal">
        <div className="fb-goal__inner">
          <SectionHead num="04" title={<>Nuestra meta: US$25.000</>} />
          <p className="fb-goal__sub fb-reveal">
            Recaudación y apoyo acumulado: {formatUSD(progress.raisedUSD)} · {progress.percent}% de la meta alcanzada.
          </p>
          <div className="fb-goal__card fb-reveal">
            <GoalProgress variant="stone" size="full" />
          </div>
          <p className="fb-goal__note fb-reveal">
            El avance incluye US$2.779 en apoyo previamente ejecutado mediante otras fuentes de colaboración y nuevas
            aportaciones netas, una vez descontadas las comisiones de plataformas, procesamiento y transferencias. El
            progreso se actualiza periódicamente después de conciliar los montos recibidos.
          </p>
          <p className="fb-goal__next fb-reveal">
            {nextMilestone
              ? <>Próximo desbloqueo: {nextMilestone.tracks.join(', ')} al alcanzar {formatUSD(nextMilestone.amountUSD)}. Faltan {formatUSD(Math.max(0, nextMilestone.amountUSD - progress.raisedUSD))} para liberarlo.</>
              : <>¡EP completo desbloqueado! · {totalTrackCount} canciones</>}
          </p>
          <button type="button" className="fb-btn fb-btn--cream fb-reveal" onClick={() => scrollToId('fb-ayudar')}>
            Quiero aportar <span className="fb-btn__arrow" aria-hidden="true">↑</span>
          </button>
        </div>
      </section>

      {/* ── 05 · Cómo vamos ── */}
      <section id="fb-como-vamos" className="fb-sec fb-sec--wall fb-progress-log">
        <SectionHead num="05" title="Cómo vamos" />
        <div className="fb-progress-log__inner fb-reveal">
          <p className="fb-progress-log__intro">{CFG.howWeAreDoing.intro}</p>
          <p className="fb-progress-log__baseline">{CFG.howWeAreDoing.baselineNote}</p>
          {CFG.howWeAreDoing.entries.length > 0 ? (
            <ol className="fb-progress-log__entries">
              {CFG.howWeAreDoing.entries.map((entry) => (
                <li key={`${entry.date}-${entry.title}`} className="fb-progress-log__entry">
                  <time dateTime={entry.date}>{entry.dateLabel || entry.date}</time>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  {entry.amountUSD != null && <span className="fb-label">Aplicado: {formatUSD(entry.amountUSD)}</span>}
                  {entry.media?.map((media) => (
                    <figure key={media.src}>
                      {media.type === 'video' ? (
                        <video src={media.src} controls preload="metadata" />
                      ) : (
                        <img src={media.src} alt={media.alt || ''} loading="lazy" />
                      )}
                      {media.caption && <figcaption>{media.caption}</figcaption>}
                    </figure>
                  ))}
                  {entry.result && <p className="fb-progress-log__result">{entry.result}</p>}
                </li>
              ))}
            </ol>
          ) : (
            <p className="fb-progress-log__pending">
              Las acciones, fechas y resultados verificables de la primera actualización se incorporarán cuando el equipo
              comparta los materiales correspondientes.
            </p>
          )}
        </div>
      </section>

      {/* ── 06 · El EP ── */}
      <section id="fb-ep" className="fb-sec fb-sec--light fb-ep">
        <SectionHead
          num="06"
          kicker="El EP y sus historias"
          title={<>FALLA<Slash />BOCONÓ: música en medio de la transformación</>}
          tone="ink"
        />
        <div className="fb-ep__grid">
          <div className="fb-prose fb-reveal">
            <p>
              FALLA/BOCONÓ no nació como un proyecto de recaudación. Sus canciones ya estaban tomando forma cuando el
              contexto a su alrededor cambió. La banda decidió adelantar su lanzamiento y convertir la música en una
              manera de acompañar a otros músicos en un momento difícil.
            </p>
            <p>
              El EP reúne {totalTrackCount} canciones y se irá liberando en Bandcamp conforme Volver a Sonar alcance cada hito. AM / FM
              inaugura el recorrido el 5 de noviembre; el EP completo estará disponible al llegar a US$25.000.
            </p>
          </div>
          <div className="fb-tracks fb-reveal">
            <span className="fb-label">{unlockedTrackCount}/{totalTrackCount} canciones desbloqueadas · orden artístico del EP</span>
            <ol>
              {releaseTracks.map((t) => (
                <li key={t.num} className={t.unlocked ? 'is-available' : ''}>
                  <span className="fb-tracks__num">{t.num}</span>
                  <span className="fb-tracks__title">
                    {t.title}
                    {t.feat && <em> (feat. {t.feat})</em>}
                  </span>
                  <span className={`fb-tracks__status ${t.unlocked ? 'is-unlocked' : ''}`}>
                    {t.unlocked ? 'Desbloqueado · Disponible en Bandcamp' : 'Bloqueado'}
                  </span>
                </li>
              ))}
            </ol>
            <div className="fb-milestones" aria-label="Hitos de desbloqueo">
              <span className="fb-label">Hitos de desbloqueo</span>
              <ol>
                {CFG.releaseMilestones.map((milestone) => (
                  <li
                    key={milestone.amountUSD}
                    className={progress.raisedUSD >= milestone.amountUSD
                      && (milestone.amountUSD > 0 || launchReached) ? 'is-reached' : ''}
                  >
                    <strong>{formatUSD(milestone.amountUSD)}</strong>
                    <span>{milestone.tracks.join(', ')}</span>
                    <span>{milestone.count}/{totalTrackCount}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="fb-focus">
          <h3 className="fb-focus__title fb-reveal">Cada aporte nos acerca a nueva música.</h3>
          <div className="fb-focus__track" role="list">
            {storyItems.map((f) => (
              <article key={f.id} className="fb-story fb-reveal" role="listitem">
                {f.image && (
                  <div className={`fb-story__img${f.squareImage ? ' fb-story__img--square' : ''}`}>
                    <img src={f.image} alt={f.imageAlt || ''} loading="lazy" />
                  </div>
                )}
                <h4 className="fb-story__name">{f.title}</h4>
                {f.meta.length > 0 && (
                  <p className="fb-story__meta">
                    {f.meta.map((m, i) => (
                      <React.Fragment key={m}>
                        {i > 0 && <span aria-hidden="true"> · </span>}
                        {m}
                      </React.Fragment>
                    ))}
                  </p>
                )}
                <p className="fb-story__body">{f.body}</p>
                {f.visualizerUrl && (
                  <div className="fb-story__media">
                    <iframe
                      src={f.visualizerUrl}
                      title={`Visualizador de ${f.title}`}
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
                {f.audioUrl && <audio className="fb-story__audio" src={f.audioUrl} controls preload="none" />}
                <ExternalLink href={CFG.links.bandcamp} className="fb-btn fb-btn--ink fb-story__cta">
                  {f.id === 'amfm' && !f.track?.unlocked ? 'Disponible en Bandcamp desde el 5 de noviembre' : 'Escuchar en Bandcamp'}
                  <span className="fb-btn__arrow" aria-hidden="true">↗</span>
                </ExternalLink>
              </article>
            ))}
          </div>
          <p className="fb-focus__note fb-reveal">{RELEASE_NOTE}</p>
          {nextMilestone ? (
            <p className="fb-focus__next fb-reveal">
              PRÓXIMO DESBLOQUEO<br />
              Faltan {formatUSD(Math.max(0, nextMilestone.amountUSD - progress.raisedUSD))} para liberar {nextMilestone.tracks.join(', ')}.
            </p>
          ) : (
            <p className="fb-focus__next fb-reveal">¡EP completo desbloqueado! · {totalTrackCount} canciones</p>
          )}
        </div>
      </section>

      {/* ── 07 · Quiénes ── */}
      <section id="fb-quienes" className="fb-sec fb-sec--wall fb-who">
        <SectionHead num="07" title="Quiénes hacen posible esta iniciativa" />
        <p className="fb-who__intro fb-reveal">
          Volver a Sonar reúne a músicos, profesionales, organizaciones y aliados que suman conocimientos, recursos y
          esfuerzos para que la música pueda seguir sonando.
        </p>
        <div className="fb-contributors fb-reveal">
          {CFG.contributors.map((group) => {
            const open = openContributorSections.includes(group.id);
            return (
              <section key={group.id} className={`fb-contributor ${open ? 'is-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`fb-contributor-${group.id}`}
                    onClick={() => setOpenContributorSections((current) => (
                      open ? current.filter((id) => id !== group.id) : [...current, group.id]
                    ))}
                  >
                    <span>{group.title}</span>
                    <span className="fb-contributor__icon" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                </h3>
                <div id={`fb-contributor-${group.id}`} className="fb-contributor__panel" hidden={!open}>
                  {group.people?.map((person) => (
                    <article key={person.name} className="fb-contributor__person">
                      <h4>
                        {person.link ? (
                          <ExternalLink href={person.link}>{person.name}</ExternalLink>
                        ) : person.name}
                      </h4>
                      <p>{person.role}</p>
                      {person.contact && <p className="fb-contributor__contact">{person.contact}</p>}
                    </article>
                  ))}
                  {group.lists?.map((list) => (
                    <div key={list.title} className="fb-contributor__list">
                      <h4>{list.title}</h4>
                      <p>{list.description}</p>
                      <p className="fb-thanks__names">{list.names.join(' / ')}</p>
                    </div>
                  ))}
                  {group.cta && (
                    <a href={CFG.links.contact} className="fb-btn fb-btn--cream fb-contributor__cta">
                      {group.cta}<span className="fb-btn__arrow" aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      {/* ── 08 · Contacto ── */}
      <section id="fb-sumarte" className="fb-sec fb-sec--dark fb-join">
        <div className="fb-join__inner">
          <SectionHead num="08" title="¿Quieres sumarte?" />
          <p className="fb-join__text fb-reveal">
            Si quieres proponer una colaboración, ofrecer apoyo en especie, contribuir desde una empresa o conocer más
            sobre la iniciativa, escríbenos.
          </p>
          <div className="fb-actions fb-reveal">
            <a href={CFG.links.contact} className="fb-btn fb-btn--cream">
              Proponer una colaboración <span className="fb-btn__arrow" aria-hidden="true">→</span>
            </a>
            <ExternalLink href={CFG.links.bandcamp} className="fb-btn fb-btn--line">
              Escucha FALLA/BOCONÓ <span className="fb-btn__arrow" aria-hidden="true">↗</span>
            </ExternalLink>
          </div>
          <p className="fb-join__credit fb-reveal">
            Contacto del proyecto: {CFG.links.projectManager} · Project Manager
          </p>
          <p className="fb-join__closing fb-reveal">Gracias por ayudarnos a que la música siga sonando.</p>
          <div className="fb-join__foot">
            <span className="fb-join__lvb">LA VIDA BOHÈME</span>
            <button type="button" className="fb-btn fb-btn--ghost" onClick={onClose}>
              ← Volver al radar
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}
