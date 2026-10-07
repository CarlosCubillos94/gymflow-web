export function cleanRut(value: string) {
  return value.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
}

export function formatRut(value: string) {
  const raw = cleanRut(value);
  if (raw.length <= 1) return raw;
  return `${raw.slice(0, -1)}-${raw.slice(-1)}`;
}

export function rutVerifier(body: string) {
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const rest = 11 - (sum % 11);
  if (rest === 11) return "0";
  if (rest === 10) return "K";
  return String(rest);
}

export function isValidRut(value: string) {
  const raw = cleanRut(value);
  if (raw.length < 8 || raw.length > 9) return false;
  const body = raw.slice(0, -1);
  const dv = raw.slice(-1);
  if (!/^\d+$/.test(body)) return false;
  return rutVerifier(body) === dv;
}
