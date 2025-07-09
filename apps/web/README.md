# 🕵️ DarkHorse — Expose Your Digital Footprint

**DarkHorse** is a privacy-visualization experiment that collects metadata from your device and browser to demonstrate how much information websites can gather — often without explicit consent. Built with cutting-edge AI tools, Convex, and React/Next.js, it reveals your "invisible fingerprint" through real-time visualization.

> ⚠️ **Ethical Use Only**  
> This tool is for educational purposes. No data is collected or shared without explicit user consent.

## 🔍 Features

### 1. Metadata Collection
- **Device Fingerprinting**:
  - IP address & approximate location (via ipapi)
  - Browser/OS details
  - Hardware specs (CPU, GPU, memory)
  - Permission states (camera, mic, etc.)
  - Font/WebGL/Canvas fingerprints
  - Ad blocker detection
  - Motion/orientation data

### 2. AI Visualization Pipeline
1. **Gemini 2.5 Flash** generates a textual scene description of your digital footprint
2. **Imagen 4.0 Ultra** creates a surreal artwork from the description
3. Real-time display of exposed data traits

### 3. Optional Network Scan
- Consent-based `nmap` port scan of your public IP
- Highlights network surface exposure

## 🛠️ Tech Stack

| Component          | Technology               |
|--------------------|--------------------------|
| Frontend           | Next.js (App Router)     |
| Mobile (Future)    | React Native + Expo      |
| Styling            | Tailwind CSS v4          |
| Backend            | Convex (DB + API)        |
| Authentication     | Clerk                    |
| AI Description     | Gemini 2.5 Flash         |
| AI Image Gen       | Imagen 4.0 Ultra         |
| Geolocation        | ipapi.co                 |
| Network Scan       | nmap (optional)          |

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
