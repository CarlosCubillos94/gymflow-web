# GymFlow Web — Gym Management Platform (Web Admin)

A personal project: the web admin for a gym management platform, built from scratch with **Vite, React and TypeScript**. The member-facing mobile app is [GymFlow Mobile](https://github.com/CarlosCubillos94/gymflow-mobile).

## Tech stack
- React 19 + TypeScript
- Vite 7
- `qrcode.react` for QR code generation
- Plain CSS (no UI framework)

## Project structure
```
src/
  App.tsx        # App shell and navigation
  landing.tsx    # Public landing page
  screens.tsx    # Application screens
  ui.tsx         # Shared UI components
  data.ts        # App data / models
  rut.ts         # Chilean RUT validation helpers
  styles.css, landing.css
public/          # Static assets
```

## Getting started
```bash
npm install
npm run dev       # start dev server
npm run build     # type-check and build to dist/
npm run preview   # preview the production build
```

## Screenshots
_Add screenshots here._

## Author
Carlos Cubillos — [GitHub](https://github.com/CarlosCubillos94) · [LinkedIn](https://www.linkedin.com/in/carloscubillosa)
