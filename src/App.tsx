import { useEffect, useMemo, useState } from "react";
import {
  DAYS,
  classBookings,
  classSlots,
  classWindow,
  dayByIso,
  gymBookings,
  gymHours,
  gymPassId,
  member,
  remaining,
  type BookKind,
  type Booking,
  type MemberTab,
  type Slot,
  type Venue,
} from "./data";
import Landing from "./landing";
import { Book, Bookings, Guest, Home, Join, Login, Pay, Profile, Venues } from "./screens";
import { IcoCal, IcoCard, IcoHome, IcoList, Logo } from "./ui";

type View = "landing" | "login" | "member" | "guest" | "join";

function toBooking(slot: Slot, iso: string): Booking {
  const d = dayByIso(iso);
  return {
    id: `${slot.id}-${iso}`,
    kind: slot.kind,
    title: slot.title,
    date: iso,
    dateLabel: d ? `${d.label} ${d.num}` : iso,
    time: slot.time,
    place: slot.place,
    coach: slot.coach,
    status: "confirmed",
  };
}

export default function App() {
  const start = ((): { view: View; tab: MemberTab } => {
    const h = window.location.hash;
    if (h.includes("login") || h.includes("ingresar")) return { view: "login", tab: "home" };
    if (h.includes("perfil") || h.includes("credencial")) return { view: "member", tab: "profile" };
    if (h.includes("pagar") || h.includes("mensualidad")) return { view: "member", tab: "pay" };
    if (h.includes("reservar")) return { view: "member", tab: "book" };
    if (h.includes("socio")) return { view: "member", tab: "home" };
    if (h.includes("alta") || h.includes("hazte")) return { view: "join", tab: "home" };
    if (h.includes("reservas") || h.includes("clase") || h.includes("pase")) return { view: "guest", tab: "home" };
    if (h.includes("recinto")) return { view: "member", tab: "venues" };
    return { view: "landing", tab: "home" };
  })();
  const [view, setView] = useState<View>(start.view);
  const [tab, setTab] = useState<MemberTab>(start.tab);
  const [person, setPerson] = useState(member);
  const [kind, setKind] = useState<BookKind>("class");
  const [day, setDay] = useState("2026-08-29");
  const [selected, setSelected] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [guestStep, setGuestStep] = useState(0);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [venueDay, setVenueDay] = useState(DAYS[0].iso);
  const [venueHour, setVenueHour] = useState<string | null>(null);
  const [venueKeys, setVenueKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.body.classList.toggle("present", new URLSearchParams(window.location.search).has("present"));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const bookedIds = useMemo(() => bookings.map((b) => b.id), [bookings]);
  const slots = useMemo(
    () => classSlots.filter((s) => classWindow(day) && s.days.includes(day)),
    [day],
  );
  const openHours = gymHours(day);

  useEffect(() => {
    if (kind !== "class") return;
    setSelected((cur) => {
      if (cur && slots.some((s) => s.id === cur)) return cur;
      return slots.find((s) => remaining(s) > 0)?.id ?? null;
    });
  }, [day, kind, slots]);

  function enterMember(next: MemberTab = "home") {
    setTab(next);
    setView("member");
  }

  function reserve() {
    if (kind === "gym") {
      const hours = gymHours(day);
      const d = dayByIso(day);
      if (!hours) return;
      const item: Booking = {
        id: gymPassId(day),
        kind: "gym",
        title: "Gimnasio",
        date: day,
        dateLabel: d ? `${d.label} ${d.num}` : day,
        time: `${hours.open}–${hours.close}`,
        place: "Acceso libre",
        status: "confirmed",
      };
      setBookings((prev) => (prev.some((b) => b.id === item.id) ? prev : [...prev, item]));
      setToast("Muestra tu código al entrar");
      setTab("profile");
      return;
    }
    const slot = slots.find((s) => s.id === selected);
    if (!slot) return;
    const item = toBooking(slot, day);
    setBookings((prev) => (prev.some((b) => b.id === item.id) ? prev : [...prev, item]));
    setSelected(null);
    setToast("Muestra tu código al entrar");
    setTab("profile");
  }

  return (
    <div className="app">
      {view !== "member" && view !== "landing" && (
        <button className="back-site" type="button" onClick={() => setView("landing")}>
          ← Volver al sitio
        </button>
      )}

      {view !== "member" && view !== "landing" && (
        <div className="switch">
          <button className={view === "login" || view === "join" ? "is-on" : ""} onClick={() => setView("login")}>
            Socio
          </button>
          <button className={view === "guest" ? "is-on" : ""} onClick={() => { setGuestStep(0); setView("guest"); }}>
            Pase Diario
          </button>
        </div>
      )}

      {view === "member" && (
        <header className="top">
          <button className="brand" onClick={() => setTab("home")}>
            <Logo size={40} />
          </button>
          <nav className="desk-nav">
            <button className={tab === "home" ? "is-on" : ""} onClick={() => setTab("home")}>
              Inicio
            </button>
            <button className={tab === "book" ? "is-on" : ""} onClick={() => setTab("book")}>
              Reservar
            </button>
            <button className={tab === "bookings" ? "is-on" : ""} onClick={() => setTab("bookings")}>
              Reservas
            </button>
            <button className={tab === "pay" ? "is-on" : ""} onClick={() => setTab("pay")}>
              Pagar
            </button>
            <button className={tab === "venues" ? "is-on" : ""} onClick={() => setTab("venues")}>
              Recintos
            </button>
            <button className={tab === "profile" ? "is-on" : ""} onClick={() => setTab("profile")}>
              Perfil
            </button>
          </nav>
          <span className="spacer" />
          <button className="who" onClick={() => setTab("profile")}>
            {person.firstName}
          </button>
        </header>
      )}

      {view === "landing" && (
        <Landing
          onLogin={() => setView("login")}
          onJoin={() => setView("join")}
          onGuest={() => {
            setGuestStep(0);
            setView("guest");
          }}
        />
      )}
      {view === "login" && (
        <Login
          onEnter={(next) => {
            setPerson(next);
            enterMember("home");
          }}
          onGuest={() => {
            setGuestStep(0);
            setView("guest");
          }}
          onJoin={() => setView("join")}
        />
      )}
      {view === "join" && (
        <Join
          onBack={() => setView("login")}
          onDone={(next) => {
            setPerson(next);
            setPaid(true);
            setToast("Bienvenido a GymFlow");
            enterMember("home");
          }}
        />
      )}
      {view === "member" && tab === "home" && (
        <Home
          person={person}
          gyms={gymBookings(bookings)}
          classes={classBookings(bookings)}
          onBook={() => setTab("book")}
          onBookings={() => setTab("bookings")}
          onPay={() => setTab("pay")}
          onVenues={() => setTab("venues")}
          onProfile={() => setTab("profile")}
        />
      )}
      {view === "member" && tab === "book" && (
        <Book
          kind={kind}
          setKind={setKind}
          day={day}
          setDay={setDay}
          slots={slots}
          bookedIds={bookedIds}
          selected={selected}
          setSelected={setSelected}
          gymBooked={bookedIds.includes(gymPassId(day))}
          onReserve={reserve}
        />
      )}
      {view === "member" && tab === "bookings" && (
        <Bookings
          bookings={bookings}
          onCancel={(id) => {
            setBookings((prev) => prev.filter((b) => b.id !== id));
            setToast("Cancelada");
          }}
        />
      )}
      {view === "member" && tab === "pay" && <Pay paid={paid} onPay={() => setPaid(true)} />}
      {view === "member" && tab === "profile" && (
        <Profile
          person={person}
          monthPaid={person.monthPaid || paid}
          paidMonth={paid ? "Septiembre 2026" : person.paidThrough}
          gyms={gymBookings(bookings)}
          classes={classBookings(bookings)}
        />
      )}
      {view === "member" && tab === "venues" && (
        <Venues
          venue={venue}
          setVenue={setVenue}
          day={venueDay}
          setDay={setVenueDay}
          hour={venueHour}
          setHour={setVenueHour}
          taken={venueKeys}
          onReserve={() => {
            if (!venue || !venueHour) return;
            const d = dayByIso(venueDay);
            const key = `${venue.id}-${venueDay}-${venueHour}`;
            setVenueKeys((p) => new Set(p).add(key));
            setBookings((prev) => [
              ...prev,
              {
                id: key,
                kind: "venue",
                title: venue.name,
                date: venueDay,
                dateLabel: d ? `${d.label} ${d.num}` : venueDay,
                time: venueHour,
                place: venue.type,
                status: "confirmed",
              },
            ]);
            setVenueHour(null);
            setToast("Reservado");
            setTab("bookings");
          }}
        />
      )}
      {view === "guest" && guestStep === 0 && (
        <Book
          heading="Reservas sin mensualidad"
          kind={kind}
          setKind={setKind}
          day={day}
          setDay={setDay}
          slots={slots}
          bookedIds={[]}
          selected={selected}
          setSelected={setSelected}
          gymBooked={false}
          onReserve={() => {
            if (kind === "class" && !selected) return;
            if (kind === "gym" && !gymHours(day)) return;
            setGuestStep(1);
          }}
        />
      )}
      {view === "guest" && guestStep > 0 && (
        <Guest
          step={guestStep}
          kind={kind}
          selected={slots.find((s) => s.id === selected) ?? null}
          hoursLabel={openHours ? `${openHours.open}–${openHours.close}` : ""}
          onPay={() => {
            setGuestStep(2);
            setToast("Pagado");
          }}
        />
      )}
      {view === "member" && (
        <nav className="tabbar">
          <button className={tab === "home" ? "is-on" : ""} onClick={() => setTab("home")}>
            <IcoHome />
            Inicio
          </button>
          <button className={tab === "book" ? "is-on" : ""} onClick={() => setTab("book")}>
            <IcoCal />
            Reservar
          </button>
          <button className={tab === "bookings" ? "is-on" : ""} onClick={() => setTab("bookings")}>
            <IcoList />
            Reservas
          </button>
          <button className={tab === "pay" ? "is-on" : ""} onClick={() => setTab("pay")}>
            <IcoCard />
            Pagar
          </button>
        </nav>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
