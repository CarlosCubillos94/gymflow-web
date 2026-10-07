import { cleanRut } from "./rut";

export type Audience = "public" | "member" | "guest" | "venue";

export type MemberTab = "home" | "book" | "bookings" | "pay" | "venues" | "profile";

export type BookKind = "gym" | "class";

export type Booking = {
  id: string;
  kind: BookKind | "venue";
  title: string;
  date: string;
  dateLabel: string;
  time: string;
  place: string;
  coach?: string;
  price?: number;
  status: "confirmed" | "waitlist";
};

export type Slot = {
  id: string;
  title: string;
  time: string;
  end: string;
  place: string;
  coach?: string;
  taken: number;
  capacity: number;
  kind: BookKind;
  days: string[];
};

export type Venue = {
  id: string;
  name: string;
  type: string;
  blurb: string;
  price: number;
  unit: string;
  image: "court" | "grill" | "studio" | "tennis";
};

export const TODAY = "2026-08-28";

export const DAYS = [
  { iso: "2026-08-28", label: "Vie", num: "28", month: "ago", name: "Hoy" },
  { iso: "2026-08-29", label: "Sáb", num: "29", month: "ago", name: "Mañana" },
  { iso: "2026-08-30", label: "Dom", num: "30", month: "ago", name: "Domingo" },
  { iso: "2026-08-31", label: "Lun", num: "31", month: "ago", name: "Lunes" },
  { iso: "2026-09-01", label: "Mar", num: "01", month: "sep", name: "Martes" },
  { iso: "2026-09-02", label: "Mié", num: "02", month: "sep", name: "Miércoles" },
  { iso: "2026-09-03", label: "Jue", num: "03", month: "sep", name: "Jueves" },
];

export type Member = {
  id: string;
  firstName: string;
  fullName: string;
  rut: string;
  email: string;
  passId: string;
  plan: string;
  paidThrough: string;
  renews: string;
  monthPaid: boolean;
};

export function passIdFromRut(rut: string) {
  const digits = cleanRut(rut).replace(/K/g, "");
  let n = 0x6F121;
  for (const ch of digits) n = (n * 33 + Number(ch)) >>> 0;
  const code = n.toString(36).toUpperCase().padStart(6, "0").slice(-6);
  return `GF-${code}`;
}

export const members: Member[] = [
  { id: "m-sofia", firstName: "Sofía", fullName: "Sofía Prueba", rut: "12345678-5", email: "sofia.prueba@example.com", passId: "", plan: "Socio activo", paidThrough: "Agosto 2026", renews: "Septiembre 2026", monthPaid: true },
  { id: "m-andrea", firstName: "Ana", fullName: "Ana Ejemplo", rut: "15882441-8", email: "ana.ejemplo@example.com", passId: "", plan: "Socio activo", paidThrough: "Agosto 2026", renews: "Septiembre 2026", monthPaid: true },
  { id: "m-marco", firstName: "Bruno", fullName: "Bruno Muestra", rut: "10221903-1", email: "bruno.muestra@example.com", passId: "", plan: "Socio activo", paidThrough: "Julio 2026", renews: "Agosto 2026", monthPaid: false },
  { id: "m-paula", firstName: "Valentina", fullName: "Valentina Demo", rut: "17034558-4", email: "valentina.demo@example.com", passId: "", plan: "Socio activo", paidThrough: "Agosto 2026", renews: "Septiembre 2026", monthPaid: true },
].map((m) => ({ ...m, passId: passIdFromRut(m.rut) }));

export const member = members[0];

export function findMemberByRut(value: string) {
  const key = cleanRut(value);
  return members.find((m) => cleanRut(m.rut) === key);
}

export function credentialPayload(passId: string) {
  return `gf://socio/${passId}`;
}

export const club = {
  name: "GymFlow Fitness",
  city: "Ciudad Demo",
  address: "Av. Ejemplo 123, Ciudad Demo",
  phone: "+56 9 0000 0000",
  phones: ["+56 9 0000 0000", "+56 9 0000 0001"],
  email: "contact@gymflow.dev",
  hours: "Lun–Vie 06:30–22:30 · Sáb 08:00–16:30",
  rut: "11.111.111-1",
  org: "Proyecto demo",
  stadium: "Estadio techado",
};

function weekday(iso: string) {
  return new Date(`${iso}T12:00:00`).getDay();
}

export function gymHours(iso: string) {
  const wd = weekday(iso);
  if (wd === 0) return null;
  if (wd === 6) return { open: "08:00", close: "16:30" };
  return { open: "06:30", close: "22:30" };
}

export function gymPassId(iso: string) {
  return `g-day-${iso}`;
}

export const classSlots: Slot[] = [
  { id: "c-spin", title: "Spinning", time: "08:00", end: "08:45", place: "Sala bike", coach: "Bruno Muestra", taken: 8, capacity: 15, kind: "class", days: ["2026-08-29"] },
  { id: "c-fun", title: "Funcional", time: "09:00", end: "10:00", place: "Sala 2", coach: "Ana Ejemplo", taken: 11, capacity: 15, kind: "class", days: ["2026-08-29"] },
  { id: "c-cross", title: "Crosstraining", time: "10:00", end: "11:00", place: "Sala 2", coach: "Ana Ejemplo", taken: 6, capacity: 10, kind: "class", days: ["2026-08-29"] },
  { id: "c-zumba", title: "Zumba", time: "18:00", end: "19:00", place: "Multicancha", coach: "Carla Ficticia", taken: 12, capacity: 15, kind: "class", days: ["2026-08-29"] },
  { id: "c-yoga", title: "Yoga", time: "19:00", end: "20:00", place: "Sala 1", coach: "Valentina Demo", taken: 4, capacity: 15, kind: "class", days: ["2026-08-29"] },
];

export const guestPrice = 8000;

export const venues: Venue[] = [
  { id: "f5", name: "Cancha fútbol 5", type: "Cemento · con luz", blurb: "", price: 15000, unit: "hora", image: "court" },
  { id: "f7", name: "Cancha fútbol 7", type: "Césped sintético · con luz", blurb: "", price: 18000, unit: "hora", image: "court" },
  { id: "estadio", name: "Estadio techado", type: "Multiuso", blurb: "", price: 25000, unit: "hora", image: "studio" },
  { id: "quincho", name: "Quincho", type: "Parrilla", blurb: "", price: 45000, unit: "bloque", image: "grill" },
];

export const venueHours = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"];

export const payments = [
  { id: "p-jul", period: "Julio 2026", amount: 28900, status: "pagado" as const },
  { id: "p-ago", period: "Agosto 2026", amount: 28900, status: "pagado" as const },
  { id: "p-sep", period: "Septiembre 2026", amount: 28900, status: "proximo" as const },
];

export function formatClp(n: number) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export function dayByIso(iso: string) {
  return DAYS.find((d) => d.iso === iso);
}

export function classWindow(iso: string) {
  return iso === "2026-08-29";
}

export function gymWindow(iso: string) {
  return weekday(iso) !== 0;
}

export function classBookings(bookings: Booking[]) {
  return bookings.filter((b) => b.kind === "class");
}

export function gymBookings(bookings: Booking[]) {
  return bookings.filter((b) => b.kind === "gym");
}

export function remaining(slot: Slot) {
  if (slot.kind === "gym" || slot.capacity <= 0) return Number.POSITIVE_INFINITY;
  return Math.max(0, slot.capacity - slot.taken);
}
