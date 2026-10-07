import { useState } from "react";
import { DAYS, classWindow, club, credentialPayload, findMemberByRut, formatClp, gymHours, gymWindow, guestPrice, member, passIdFromRut, remaining, venues, venueHours, type BookKind, type Booking, type Member, type Slot, type Venue } from "./data";
import { cleanRut, formatRut, isValidRut } from "./rut";
import { Logo, MemberQr } from "./ui";

function RutField({
  value,
  onChange,
  label = "RUT",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const raw = cleanRut(value);
  const valid = isValidRut(value);
  const err = raw.length >= 8 && !valid ? "RUT inválido" : "";

  return (
    <label className="field">
      <span>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(formatRut(e.target.value))}
        placeholder="12345678-5"
        inputMode="text"
        autoComplete="username"
        spellCheck={false}
        className={err ? "is-bad" : ""}
        aria-invalid={Boolean(err)}
      />
      {err && <p className="field-err">{err}</p>}
    </label>
  );
}

export function Login({
  onEnter,
  onGuest,
  onJoin,
}: {
  onEnter: (person: Member) => void;
  onGuest: () => void;
  onJoin: () => void;
}) {
  const [rut, setRut] = useState(formatRut(member.rut));
  const canEnter = isValidRut(rut);

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />
      <div className="login">
        <div className="mark">
          <Logo size={52} />
        </div>
        <h1 className="title">Inicio de sesión</h1>
        <div style={{ height: 8 }} />
        <RutField value={rut} onChange={setRut} label="RUT de usuario" />
        <label className="field">
          <span>Contraseña</span>
          <input type="password" defaultValue="********" autoComplete="current-password" />
        </label>
        <button
          className="btn"
          disabled={!canEnter}
          onClick={() => onEnter(findMemberByRut(rut) ?? member)}
        >
          Iniciar sesión
        </button>
        <div className="links">
          <button className="btn btn-ghost" type="button" onClick={onJoin}>
            Hazte socio
          </button>
          <button className="btn btn-ghost" type="button" onClick={onGuest}>
            Reservas sin mensualidad
          </button>
          <button className="btn btn-ghost" type="button">
            Restablecer contraseña
          </button>
        </div>
        <p className="meta">
          {club.address}
          <br />
          {club.hours} · {club.phone}
          <br />
          {club.org}
        </p>
      </div>
    </div>
  );
}

export function Join({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: (person: Member) => void;
}) {
  const [rut, setRut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [health, setHealth] = useState(false);
  const ready =
    isValidRut(rut) &&
    name.trim().length > 1 &&
    email.includes("@") &&
    phone.trim().length >= 8 &&
    password.length >= 6 &&
    health;

  return (
    <div className="wrap">
      <button className="btn btn-ghost" type="button" onClick={onBack}>
        Volver al login
      </button>
      <h1 className="title">Hazte socio</h1>
      <p className="empty" style={{ margin: "12px 0 16px", padding: 0 }}>
        Primera mensualidad {formatClp(28900)}. El gimnasio revisa el certificado de salud antes de activar el acceso.
      </p>
      <RutField value={rut} onChange={setRut} />
      <label className="field">
        <span>Nombre</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" />
      </label>
      <label className="field">
        <span>Correo</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@email.cl"
          autoComplete="email"
        />
      </label>
      <label className="field">
        <span>Teléfono</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="9 1234 5678"
          inputMode="tel"
          autoComplete="tel"
        />
      </label>
      <label className="field">
        <span>Contraseña</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </label>
      <label className="check">
        <input type="checkbox" checked={health} onChange={(e) => setHealth(e.target.checked)} />
        <span>Tengo certificado de salud vigente</span>
      </label>
      <div className="pay-box" style={{ marginTop: 0, marginBottom: 16 }}>
        <small style={{ color: "var(--mute)", fontWeight: 700 }}>SEPTIEMBRE 2026</small>
        <div className="amt">{formatClp(28900)}</div>
      </div>
      <button
        className="btn"
        disabled={!ready}
        onClick={() => {
          const fullName = name.trim();
          onDone({
            id: `m-${cleanRut(rut)}`,
            firstName: fullName.split(" ")[0] ?? fullName,
            fullName,
            rut,
            email: email.trim(),
            passId: passIdFromRut(rut),
            plan: "Socio activo",
            paidThrough: "Septiembre 2026",
            renews: "Octubre 2026",
            monthPaid: true,
          });
        }}
      >
        Pagar y ser socio
      </button>
    </div>
  );
}

export function Home({
  person,
  gyms,
  classes,
  onBook,
  onBookings,
  onPay,
  onVenues,
  onProfile,
}: {
  person: Member;
  gyms: Booking[];
  classes: Booking[];
  onBook: () => void;
  onBookings: () => void;
  onPay: () => void;
  onVenues: () => void;
  onProfile: () => void;
}) {
  const qr = credentialPayload(person.passId);
  const hasAccess = gyms.length > 0 || classes.length > 0;
  return (
    <div className="wrap home">
      <p style={{ color: "var(--mute)", fontWeight: 700 }}>Hola, {person.firstName}</p>
      <button className="pass-mini" onClick={onProfile}>
        <span className="pass-mini-qr">
          <MemberQr value={qr} size={72} />
        </span>
        <span className="pass-mini-copy">
          <b>Tu acceso</b>
          <small>Muestra este código al entrar</small>
          {gyms.map((b) => (
            <em key={b.id}>
              {b.title} · {b.dateLabel} · {b.time}
            </em>
          ))}
          {classes.map((b) => (
            <em key={b.id}>
              {b.title} · {b.dateLabel} · {b.time}
            </em>
          ))}
          {!hasAccess && <em className="is-off">Sin reserva de clase o gimnasio</em>}
        </span>
      </button>
      <button className="tile" onClick={onBook}>
        <span>＋</span>
        <b>Reservar hora</b>
      </button>
      <button className="tile" onClick={onBookings}>
        <span>☰</span>
        <b>Mis reservas</b>
      </button>
      <button className="tile" onClick={onVenues}>
        <span>▣</span>
        <b>Recintos</b>
      </button>
      <button className="tile" onClick={onPay}>
        <span>$</span>
        <b>Mensualidad</b>
      </button>
    </div>
  );
}

export function Book({
  heading = "Reservar",
  kind,
  setKind,
  day,
  setDay,
  slots,
  bookedIds,
  selected,
  setSelected,
  gymBooked,
  onReserve,
}: {
  heading?: string;
  kind: BookKind;
  setKind: (k: BookKind) => void;
  day: string;
  setDay: (iso: string) => void;
  slots: Slot[];
  bookedIds: string[];
  selected: string | null;
  setSelected: (id: string | null) => void;
  gymBooked: boolean;
  onReserve: () => void;
}) {
  const hours = gymHours(day);
  const gymReady = Boolean(hours) && !gymBooked;
  const ctaOff = kind === "gym" ? !gymReady : !selected;
  const ctaLabel = kind === "gym" ? (gymBooked ? "Ya tienes acceso" : hours ? "Reservar acceso" : "Cerrado") : "Reservar";

  return (
    <div className="wrap">
      <h1 className="title">{heading}</h1>
      <div className="seg">
        <button className={kind === "class" ? "is-on" : ""} onClick={() => setKind("class")}>
          Clases
        </button>
        <button className={kind === "gym" ? "is-on" : ""} onClick={() => setKind("gym")}>
          Gimnasio
        </button>
      </div>
      <div className="days">
        {DAYS.map((d) => {
          const ok = kind === "class" ? classWindow(d.iso) : gymWindow(d.iso);
          return (
            <button
              key={d.iso}
              className={`day ${day === d.iso ? "is-on" : ""} ${ok ? "" : "is-off"}`}
              onClick={() => {
                if (kind === "gym" && !ok) return;
                setDay(d.iso);
              }}
            >
              <small>{d.label}</small>
              <b>{d.num}</b>
            </button>
          );
        })}
      </div>
      {kind === "gym" ? (
        <article className={`gym-pass ${gymBooked ? "is-ok" : ""} ${hours ? "" : "is-off"}`}>
          <span className="kicker">{gymBooked ? "Listo" : hours ? "Acceso del día" : "Cerrado"}</span>
          <h2>Gimnasio</h2>
          {hours ? (
            <>
              <div className="gym-range">
                <div>
                  <small>Abre</small>
                  <time>{hours.open}</time>
                </div>
                <span className="gym-dash" aria-hidden="true" />
                <div>
                  <small>Cierra</small>
                  <time>{hours.close}</time>
                </div>
              </div>
              <div className="gym-bar" aria-hidden="true">
                <span />
              </div>
              <p className="gym-note">{gymBooked ? "Puedes entrar a cualquier hora." : "Una reserva. Entra cuando quieras."}</p>
            </>
          ) : (
            <p className="gym-note">El gimnasio no abre este día.</p>
          )}
        </article>
      ) : (
        <div className="list">
          {slots.map((s) => {
            const id = `${s.id}-${day}`;
            const left = remaining(s);
            const full = left === 0;
            const booked = bookedIds.includes(id);
            return (
              <button
                key={s.id}
                className={`row-item ${full ? "is-full" : ""} ${selected === s.id ? "is-on" : ""} ${booked ? "is-booked" : ""}`}
                disabled={full || booked}
                onClick={() => setSelected(s.id)}
              >
                <time>{s.time}</time>
                <div>
                  <b>{s.title}</b>
                  <small>{s.coach ?? s.place}</small>
                </div>
                <span className="spots">{booked ? "Ok" : full ? "Lleno" : `${left} / ${s.capacity}`}</span>
              </button>
            );
          })}
          {slots.length === 0 && <p className="empty">No hay horarios este día.</p>}
        </div>
      )}
      <div style={{ height: 16 }} />
      <button className="btn" disabled={ctaOff} onClick={onReserve}>
        {ctaLabel}
      </button>
    </div>
  );
}

export function Bookings({ bookings, onCancel }: { bookings: Booking[]; onCancel: (id: string) => void }) {
  return (
    <div className="wrap">
      <h1 className="title">Mis reservas</h1>
      <div style={{ height: 16 }} />
      {bookings.length === 0 && <p className="empty">Sin reservas.</p>}
      {bookings.map((b) => (
        <div className="booking" key={b.id}>
          <div>
            <b>{b.title}</b>
            <p>
              <small>
                {b.dateLabel} · {b.time}
              </small>
            </p>
          </div>
          <button onClick={() => onCancel(b.id)}>Cancelar</button>
        </div>
      ))}
    </div>
  );
}

export function Profile({
  person,
  monthPaid,
  paidMonth,
  gyms,
  classes,
}: {
  person: Member;
  monthPaid: boolean;
  paidMonth: string;
  gyms: Booking[];
  classes: Booking[];
}) {
  const qr = credentialPayload(person.passId);
  const hasAccess = gyms.length > 0 || classes.length > 0;
  return (
    <div className="wrap">
      <h1 className="title">Credencial</h1>
      <article className="pass">
        <div className="pass-head">
          <Logo size={36} />
          <span className="kicker">Muestra al entrar</span>
        </div>
        <div className="pass-qr">
          <MemberQr value={qr} size={196} />
        </div>
        <b className="pass-id">{person.passId}</b>
        <p className="pass-name">{person.fullName}</p>
        <small>{person.rut}</small>
        <p className="pass-hint">Este código verifica tu mensualidad y tus reservas.</p>
        <ul className="pass-status">
          <li className={monthPaid ? "is-ok" : "is-off"}>
            {monthPaid ? `Mensualidad de ${paidMonth} al día` : `Mensualidad de ${person.renews} pendiente`}
          </li>
          {gyms.map((b) => (
            <li className="is-ok" key={b.id}>
              Gimnasio · {b.dateLabel} · {b.time}
            </li>
          ))}
          {classes.map((b) => (
            <li className="is-ok" key={b.id}>
              {b.title} · {b.dateLabel} · {b.time}
            </li>
          ))}
          {!hasAccess && <li className="is-off">Sin reserva de clase o gimnasio</li>}
        </ul>
      </article>
    </div>
  );
}

export function Pay({ paid, onPay }: { paid: boolean; onPay: () => void }) {
  return (
    <div className="wrap">
      <h1 className="title">Mensualidad</h1>
      <p className="empty" style={{ marginBottom: 12 }}>
        Cada mes se paga por separado.
      </p>
      <div className="pay-box">
        <small style={{ color: "var(--mute)", fontWeight: 700 }}>AGOSTO 2026</small>
        <p style={{ color: "var(--ok)", fontWeight: 700, margin: "8px 0 0" }}>Pagada</p>
      </div>
      <div className="pay-box">
        <small style={{ color: "var(--mute)", fontWeight: 700 }}>SEPTIEMBRE 2026</small>
        <div className="amt">{formatClp(28900)}</div>
        {paid ? (
          <p style={{ color: "var(--ok)", fontWeight: 700 }}>Pagada</p>
        ) : (
          <button className="btn" onClick={onPay}>
            Pagar este mes
          </button>
        )}
      </div>
    </div>
  );
}

export function Guest({
  step,
  kind,
  selected,
  hoursLabel,
  onPay,
}: {
  step: number;
  kind: BookKind;
  selected: Slot | null;
  hoursLabel: string;
  onPay: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rut, setRut] = useState("");
  const label = kind === "gym" ? `Gimnasio · ${hoursLabel}` : `${selected?.title} · ${selected?.time}`;
  const ready = name.trim().length > 1 && email.includes("@") && isValidRut(rut);

  if (step === 2) {
    return (
      <div className="wrap">
        <h1 className="title">Listo</h1>
        <article className="confirm">
          <b>{label}</b>
          <p>{name.trim()}</p>
          <small>Confirmación enviada a {email.trim()}</small>
        </article>
      </div>
    );
  }

  return (
    <div className="wrap">
      <h1 className="title">Pagar</h1>
      <p style={{ margin: "12px 0", fontWeight: 700 }}>{label}</p>
      <RutField value={rut} onChange={setRut} />
      <label className="field">
        <span>Nombre</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" />
      </label>
      <label className="field">
        <span>Correo</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@email.cl"
          autoComplete="email"
        />
      </label>
      <div className="pay-box" style={{ marginTop: 0, marginBottom: 16 }}>
        <div className="amt">{formatClp(guestPrice)}</div>
      </div>
      <button className="btn" disabled={!ready} onClick={onPay}>
        Pagar y reservar
      </button>
    </div>
  );
}

export function Venues({
  venue,
  setVenue,
  day,
  setDay,
  hour,
  setHour,
  onReserve,
  taken,
}: {
  venue: Venue | null;
  setVenue: (v: Venue) => void;
  day: string;
  setDay: (iso: string) => void;
  hour: string | null;
  setHour: (h: string) => void;
  onReserve: () => void;
  taken: Set<string>;
}) {
  return (
    <div className="wrap">
      <h1 className="title">Recintos</h1>
      <div className="card-list">
        {venues.map((v) => (
          <button key={v.id} onClick={() => setVenue(v)} style={venue?.id === v.id ? { outline: "2px solid var(--brand)" } : undefined}>
            <b>{v.name}</b>
            <small style={{ color: "var(--mute)" }}>{v.type}</small>
            <p className="price">{formatClp(v.price)}</p>
          </button>
        ))}
      </div>
      {venue && (
        <>
          <div style={{ height: 16 }} />
          <div className="days">
            {DAYS.map((d) => (
              <button key={d.iso} className={`day ${day === d.iso ? "is-on" : ""}`} onClick={() => setDay(d.iso)}>
                <small>{d.label}</small>
                <b>{d.num}</b>
              </button>
            ))}
          </div>
          <div className="hours">
            {venueHours.map((h) => {
              const off = taken.has(`${venue.id}-${day}-${h}`);
              return (
                <button key={h} className={hour === h ? "is-on" : ""} disabled={off} onClick={() => setHour(h)}>
                  {h}
                </button>
              );
            })}
          </div>
          <button className="btn" disabled={!hour} onClick={onReserve}>
            Reservar
          </button>
        </>
      )}
    </div>
  );
}
