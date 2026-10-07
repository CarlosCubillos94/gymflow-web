import { useEffect, useState, type ReactNode } from "react";
import { club, formatClp, guestPrice, venues } from "./data";
import "./landing.css";

const nav = [
  { id: "club", label: "Nosotros" },
  { id: "ramas", label: "Ramas" },
  { id: "recintos", label: "Recintos" },
  { id: "actividades", label: "Actividades" },
  { id: "socios", label: "Socios" },
  { id: "contacto", label: "Contacto" },
];

const stats = [
  { value: "7 días", label: "Reservas anticipadas" },
  { value: "QR", label: "Credencial digital" },
  { value: "8", label: "Disciplinas" },
  { value: "4", label: "Recintos arrendables" },
];

const agenda = [
  { tag: "Torneo", day: "13", month: "Ago", title: "Torneo interno de primavera", place: "Estadio techado", detail: "Básquetbol · Tenis · Baby fútbol" },
  { tag: "Familia", day: "14", month: "Ago", title: "Día de la familia", place: "Complejo de deportes", detail: "Socios e invitados" },
  { tag: "Clases", day: "Lun", month: "a Sáb", title: "Clases dirigidas", place: "Sala bike · Sala 1 y 2 · Multicancha", detail: "Spinning · Funcional · Crosstraining · Zumba · Yoga" },
  { tag: "Cultura", day: "16", month: "Oct", title: "Festival de teatro escolar", place: "Gimnasio GymFlow Fitness", detail: "Entrada gratuita" },
];

const news = [
  { kicker: "Institucional", date: "Reservas online", title: "Ahora el acceso al gimnasio se reserva con una semana de antelación", body: "El sistema de reservas amplió la ventana para el gimnasio. Las clases dirigidas se mantienen con un día de anticipación y también pueden tomarse sin mensualidad.", art: "gym" as const, featured: true },
  { kicker: "Torneos", date: "Temporada 2026", title: "Abren las inscripciones del torneo interno", body: "Básquetbol, tenis y baby fútbol para socios de todas las edades.", art: "olympic" as const },
  { kicker: "Comunidad", date: "Socios senior", title: "Nuevo horario para socios senior", body: "Bloques exclusivos de mañana con acompañamiento de instructores.", art: "team" as const },
  { kicker: "Cultura", date: "Teatro escolar", title: "El gimnasio recibe el festival de teatro escolar", body: "Dos jornadas de teatro y aprendizaje para colegios de la zona.", art: "culture" as const },
];

const ramas = [
  { icon: "basket", name: "Básquetbol", detail: "Estadio techado · Series adultos y juveniles" },
  { icon: "tennis", name: "Tenis de campo", detail: "Canchas de arcilla al aire libre" },
  { icon: "ball", name: "Baby fútbol y fútbol", detail: "Fútbol 5 en cemento · Fútbol 7 sintético" },
  { icon: "rayuela", name: "Rayuela", detail: "Canchas tradicionales · Series senior" },
  { icon: "dumbbell", name: "Gimnasio y musculación", detail: "Acceso libre con reserva diaria" },
  { icon: "heart", name: "Clases dirigidas", detail: "Spinning, funcional, crosstraining, zumba y yoga" },
  { icon: "music", name: "Baile y grupo musical", detail: "Comité cultural" },
  { icon: "book", name: "Biblioteca y grupo infantil", detail: "Actividades para socios y sus familias" },
];

const venueArt: Record<string, "stadium" | "pitch" | "court" | "grill"> = {
  estadio: "stadium",
  f7: "pitch",
  f5: "court",
  quincho: "grill",
};

const plans = [
  {
    name: "Socio activo",
    price: formatClp(28900),
    unit: "por mes",
    highlight: true,
    perks: [
      "Gimnasio y clases dirigidas incluidas",
      "Credencial digital con código QR",
      "Tarifa preferente en arriendo de recintos",
      "Actividades del comité cultural",
    ],
    cta: "Hazte socio",
  },
  {
    name: "Pase diario",
    price: formatClp(guestPrice),
    unit: "por jornada",
    perks: [
      "Sin mensualidad ni contrato",
      "Gimnasio o una clase dirigida",
      "Reserva y pago en línea",
      "Ideal para visitas",
    ],
    cta: "Reservar sin mensualidad",
  },
  {
    name: "Empresas y colegios",
    price: "A convenir",
    unit: "por temporada",
    perks: [
      "Bloques fijos de canchas y estadio",
      "Campeonatos internos",
      "Quincho y restaurante para eventos",
      "Convenios con empresas",
    ],
    cta: "Escríbenos",
  },
];

const backers = ["Proyecto demo", "Datos ficticios", "Sin afiliación comercial"];


function Ico({ name }: { name: string }) {
  const p: Record<string, ReactNode> = {
    basket: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3v18M5.6 5.6c3.6 3.6 3.6 9.2 0 12.8M18.4 5.6c-3.6 3.6-3.6 9.2 0 12.8" />
      </>
    ),
    tennis: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M5 5c4 2.5 5.5 8 4 14M19 5c-4 2.5-5.5 8-4 14" />
      </>
    ),
    ball: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m12 7 3.5 2.6-1.3 4.2h-4.4L8.5 9.6z" />
        <path d="M12 3v4M4 10l4.5-.4M20 10l-4.5-.4M7.5 19.5 9.8 14M16.5 19.5 14.2 14" />
      </>
    ),
    rayuela: (
      <>
        <path d="M3 17h18M4.5 17 12 6l7.5 11" />
        <circle cx="12" cy="13" r="1.6" />
      </>
    ),
    dumbbell: (
      <>
        <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
      </>
    ),
    heart: (
      <>
        <path d="M12 20s-7-4.5-7-9.3A4.1 4.1 0 0 1 12 8a4.1 4.1 0 0 1 7 2.7C19 15.5 12 20 12 20z" />
      </>
    ),
    music: (
      <>
        <circle cx="7" cy="17" r="2.5" />
        <circle cx="17" cy="15" r="2.5" />
        <path d="M9.5 17V7l10-2v10" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2 2 0 0 1 6 4h5v16H6a2 2 0 0 0-2 2z" />
        <path d="M20 5.5A2 2 0 0 0 18 4h-5v16h5a2 2 0 0 1 2 2z" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: (
      <>
        <path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5.5l3.5 2" />
      </>
    ),
    check: <path d="m4.5 12.5 4.5 4.5L19.5 6.5" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {p[name]}
    </svg>
  );
}

function go(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Landing({
  onLogin,
  onJoin,
  onGuest,
}: {
  onLogin: () => void;
  onJoin: () => void;
  onGuest: () => void;
}) {
  const [stuck, setStuck] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function jump(id: string) {
    setMenu(false);
    go(id);
  }

  return (
    <div className="ld">
      <div className="ld-util">
        <div className="ld-util-in">
          <span className="ld-util-place">Proyecto demo · Datos ficticios</span>
          <span className="ld-util-links">
            <button onClick={onGuest}>Reservas sin mensualidad</button>
            <button onClick={() => jump("contacto")}>Contacto</button>
            <a href="https://example.com" target="_blank" rel="noreferrer">
              Portal de reservas
            </a>
          </span>
        </div>
      </div>

      <header className={stuck ? "ld-head is-stuck" : "ld-head"}>
        <div className="ld-head-in">
          <button className="ld-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <img src="/logo.svg" alt="GymFlow Fitness" />
          </button>
          <nav className="ld-nav">
            {nav.map((n) => (
              <button key={n.id} onClick={() => jump(n.id)}>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="ld-head-cta">
            <button className="ld-btn ld-btn-line" onClick={onLogin}>
              Soy socio
            </button>
            <button className="ld-btn ld-btn-red" onClick={onJoin}>
              Hazte socio
            </button>
          </div>
          <button className="ld-burger" onClick={() => setMenu((v) => !v)} aria-label="Menú">
            <span />
            <span />
            <span />
          </button>
        </div>
        {menu && (
          <div className="ld-drawer">
            {nav.map((n) => (
              <button key={n.id} onClick={() => jump(n.id)}>
                {n.label}
              </button>
            ))}
            <button className="ld-btn ld-btn-line" onClick={onLogin}>
              Soy socio
            </button>
            <button className="ld-btn ld-btn-red" onClick={onJoin}>
              Hazte socio
            </button>
          </div>
        )}
      </header>

      <section className="ld-hero">
        <div className="ld-hero-img" />
        <div className="ld-hero-veil" />
        <div className="ld-hero-in">
          <p className="ld-kicker">Gimnasio y centro de deportes · Demo</p>
          <h1>
            La casa deportiva
            <br />
            de <em>tu ciudad</em>
          </h1>
          <p className="ld-hero-sub">
            Ocho disciplinas, un estadio techado y un complejo de canchas. Reserva, paga y entra con tu credencial QR.
          </p>
          <div className="ld-hero-btns">
            <button className="ld-btn ld-btn-red ld-btn-lg" onClick={onJoin}>
              Hazte socio
            </button>
            <button className="ld-btn ld-btn-glass ld-btn-lg" onClick={onGuest}>
              Reservar sin mensualidad
            </button>
          </div>
        </div>
        <div className="ld-stats">
          {stats.map((s) => (
            <div key={s.label} className="ld-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="ld-agenda" id="actividades">
        <div className="ld-wrap">
          <div className="ld-sec-head ld-on-dark">
            <h2>Agenda</h2>
            <button className="ld-link" onClick={onGuest}>
              Ver horarios y reservar
            </button>
          </div>
          <div className="ld-agenda-row">
            {agenda.map((a) => (
              <article key={a.title} className="ld-fix">
                <span className="ld-fix-tag">{a.tag}</span>
                <div className="ld-fix-date">
                  <strong>{a.day}</strong>
                  <span>{a.month}</span>
                </div>
                <h3>{a.title}</h3>
                <p className="ld-fix-place">{a.place}</p>
                <p className="ld-fix-detail">{a.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ld-news" id="club">
        <div className="ld-wrap">
          <div className="ld-sec-head">
            <h2>Noticias</h2>
            <span className="ld-sec-note">Av. Ejemplo 123</span>
          </div>
          <div className="ld-news-grid">
            {news.map((n) => (
              <article key={n.title} className={n.featured ? "ld-card ld-card-big" : "ld-card"}>
                <div className={`ld-art ld-art-${n.art}`} aria-hidden="true">
                  <span className="ld-art-mark">G</span>
                </div>
                <div className="ld-card-body">
                  <p className="ld-card-meta">
                    <span className="ld-chip">{n.kicker}</span>
                    <span>{n.date}</span>
                  </p>
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ld-about">
        <div className="ld-wrap ld-about-in">
          <div>
            <p className="ld-eyebrow">Nosotros</p>
            <h2>
              Deporte, cultura y comunidad
              <br />
              en un solo lugar
            </h2>
            <p>
              GymFlow Fitness es un gimnasio ficticio creado para esta demo. Su complejo reúne un estadio techado,
              canchas de fútbol y tenis, gimnasio, vestuarios y quincho.
            </p>
            <p>
              Junto a las disciplinas deportivas hay un comité cultural, biblioteca, grupo musical y agrupación infantil.
            </p>
            <div className="ld-about-btns">
              <button className="ld-btn ld-btn-dark" onClick={() => jump("ramas")}>
                Conocer las ramas
              </button>
              <button className="ld-btn ld-btn-line-dark" onClick={() => jump("recintos")}>
                Ver recintos
              </button>
            </div>
          </div>
          <aside className="ld-facts">
            <h3>Ficha institucional</h3>
            <dl>
              <div>
                <dt>Razón social</dt>
                <dd>{club.name}</dd>
              </div>
              <div>
                <dt>RUT</dt>
                <dd>{club.rut}</dd>
              </div>
              <div>
                <dt>Personalidad jurídica</dt>
                <dd>Demo</dd>
              </div>
              <div>
                <dt>Naturaleza</dt>
                <dd>Gimnasio ficticio · Proyecto demo</dd>
              </div>
              <div>
                <dt>Vinculación</dt>
                <dd>{club.org}</dd>
              </div>
              <div>
                <dt>Recinto principal</dt>
                <dd>{club.stadium}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="ld-ramas" id="ramas">
        <div className="ld-wrap">
          <div className="ld-sec-head ld-on-dark">
            <h2>Ramas y comités</h2>
            <span className="ld-sec-note">Deporte formativo, competitivo y recreativo</span>
          </div>
          <div className="ld-ramas-grid">
            {ramas.map((r) => (
              <article key={r.name} className="ld-rama">
                <span className="ld-rama-ico">
                  <Ico name={r.icon} />
                </span>
                <h3>{r.name}</h3>
                <p>{r.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ld-venues" id="recintos">
        <div className="ld-wrap">
          <div className="ld-sec-head">
            <h2>Recintos</h2>
            <span className="ld-sec-note">Arriendo por hora o bloque · Tarifa preferente para socios</span>
          </div>
          <div className="ld-venues-grid">
            {venues.map((v) => (
              <article key={v.id} className="ld-venue">
                <div className={`ld-art ld-art-${venueArt[v.id] ?? "pitch"}`} aria-hidden="true">
                  <span className="ld-art-mark">G</span>
                </div>
                <div className="ld-venue-body">
                  <h3>{v.name}</h3>
                  <p className="ld-venue-type">{v.type}</p>
                  <p className="ld-venue-price">
                    <strong>{formatClp(v.price)}</strong> <span>/ {v.unit}</span>
                  </p>
                  <button className="ld-link" onClick={onLogin}>
                    Reservar
                  </button>
                </div>
              </article>
            ))}
          </div>
          <p className="ld-venues-note">
            El complejo cuenta además con gimnasio, vestuarios, bar restaurante y estacionamiento. Las reservas de
            gimnasio se toman con una semana de antelación y las clases dirigidas con un día.
          </p>
        </div>
      </section>

      <section className="ld-plans" id="socios">
        <div className="ld-wrap">
          <div className="ld-sec-head ld-on-dark">
            <h2>Hazte socio</h2>
            <span className="ld-sec-note">Inscripción en línea con validación de RUT</span>
          </div>
          <div className="ld-plans-grid">
            {plans.map((p) => (
              <article key={p.name} className={p.highlight ? "ld-plan is-top" : "ld-plan"}>
                {p.highlight && <span className="ld-plan-flag">Más elegido</span>}
                <h3>{p.name}</h3>
                <p className="ld-plan-price">
                  <strong>{p.price}</strong>
                  <span>{p.unit}</span>
                </p>
                <ul>
                  {p.perks.map((k) => (
                    <li key={k}>
                      <span className="ld-tick">
                        <Ico name="check" />
                      </span>
                      {k}
                    </li>
                  ))}
                </ul>
                <button
                  className={p.highlight ? "ld-btn ld-btn-red" : "ld-btn ld-btn-glass"}
                  onClick={p.name === "Pase diario" ? onGuest : p.name === "Socio activo" ? onJoin : () => jump("contacto")}
                >
                  {p.cta}
                </button>
              </article>
            ))}
          </div>
          <p className="ld-plans-note">
            El gimnasio revisa el certificado de salud antes de activar el acceso. La credencial de socio queda disponible en
            la app con código QR para entrar al complejo.
          </p>
        </div>
      </section>

      <section className="ld-app">
        <div className="ld-wrap ld-app-in">
          <div>
            <p className="ld-eyebrow">App del socio</p>
            <h2>Tu credencial, siempre en el bolsillo</h2>
            <p>
              Ingresa con tu RUT, paga la mensualidad, reserva gimnasio, clases y recintos, y muestra tu código QR en el
              acceso. Disponible para socios del GymFlow Fitness.
            </p>
            <div className="ld-about-btns">
              <button className="ld-btn ld-btn-red" onClick={onLogin}>
                Entrar a mi cuenta
              </button>
              <button className="ld-btn ld-btn-line" onClick={onGuest}>
                Probar sin mensualidad
              </button>
            </div>
          </div>
          <div className="ld-phone" aria-hidden="true">
            <div className="ld-phone-screen">
              <img src="/logo.svg" alt="" />
              <div className="ld-phone-qr">
                <div />
              </div>
              <p>Credencial de socio</p>
              <span>GF-XXXXXX</span>
            </div>
          </div>
        </div>
      </section>

      <section className="ld-backers">
        <div className="ld-wrap">
          <p className="ld-backers-title">Con el respaldo de</p>
          <div className="ld-backers-row">
            {backers.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="ld-contact" id="contacto">
        <div className="ld-wrap ld-contact-in">
          <div>
            <p className="ld-eyebrow">Contacto</p>
            <h2>Visítanos</h2>
            <ul className="ld-contact-list">
              <li>
                <span className="ld-contact-ico">
                  <Ico name="pin" />
                </span>
                <div>
                  <strong>Dirección</strong>
                  <p>{club.address}</p>
                </div>
              </li>
              <li>
                <span className="ld-contact-ico">
                  <Ico name="phone" />
                </span>
                <div>
                  <strong>Teléfonos</strong>
                  <p>{club.phones.join(" · ")}</p>
                </div>
              </li>
              <li>
                <span className="ld-contact-ico">
                  <Ico name="mail" />
                </span>
                <div>
                  <strong>Correo</strong>
                  <p>{club.email}</p>
                </div>
              </li>
              <li>
                <span className="ld-contact-ico">
                  <Ico name="clock" />
                </span>
                <div>
                  <strong>Horario</strong>
                  <p>{club.hours} · Domingo cerrado</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="ld-map ld-map-demo" aria-hidden="true" />
        </div>
      </section>

      <footer className="ld-foot">
        <div className="ld-wrap ld-foot-in">
          <div className="ld-foot-brand">
            <img src="/logo.svg" alt="GymFlow Fitness" />
            <p>
              GymFlow Fitness · Demo project. All names, places and data are fictional.
            </p>
          </div>
          <div className="ld-foot-col">
            <h4>Nosotros</h4>
            <button onClick={() => jump("club")}>Quiénes somos</button>
            <button onClick={() => jump("ramas")}>Ramas y comités</button>
            <button onClick={() => jump("actividades")}>Actividades</button>
            <button onClick={() => jump("recintos")}>Recintos</button>
          </div>
          <div className="ld-foot-col">
            <h4>Socios</h4>
            <button onClick={onJoin}>Hazte socio</button>
            <button onClick={onLogin}>Iniciar sesión</button>
            <button onClick={onGuest}>Pase diario</button>
            <a href="https://example.com" target="_blank" rel="noreferrer">
              Portal de reservas
            </a>
          </div>
          <div className="ld-foot-col">
            <h4>Contacto</h4>
            <p>{club.address}</p>
            <p>{club.phone}</p>
            <p>{club.email}</p>
          </div>
        </div>
        <div className="ld-foot-bar">
          <div className="ld-wrap ld-foot-bar-in">
            <span>
              © {new Date().getFullYear()} {club.name} · RUT {club.rut}
            </span>
            <span>Proyecto demo · Datos ficticios</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
