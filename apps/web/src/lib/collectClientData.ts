
export async function collectClientData() {
  const battery = await (navigator.getBattery?.() || Promise.resolve(null));
  const ipGeo = await fetch("https://ipapi.co/json/").then(res => res.json()).catch(() => null);
  const preferences = {
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    prefersContrast: window.matchMedia("(prefers-contrast: more)").matches,
  };

  function getCanvasFingerprint(): string | null {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.textBaseline = "top";
      ctx.font = "14px 'Arial'";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("BrunoWasHere", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("BrunoWasHere", 4, 17);
      return canvas.toDataURL();
    } catch {
      return null;
    }
  }
  const canvas = getCanvasFingerprint();

  const getAudioFingerprint = async () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const analyser = context.createAnalyser();
      const gain = context.createGain();
      const scriptProcessor = context.createScriptProcessor(4096, 1, 1);

      return await new Promise((resolve) => {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, context.currentTime);
        oscillator.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(gain);
        gain.connect(context.destination);

        scriptProcessor.onaudioprocess = (event) => {
          const output = event.outputBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 0; i < output.length; i++) sum += Math.abs(output[i]);
          resolve(sum.toFixed(3)); // simple hash based on signal
          oscillator.stop();
          scriptProcessor.disconnect();
        };

        oscillator.start();
      });
    } catch {
      return null;
    }
  }
  //const audio = await getAudioFingerprint();

  // GPU Info
  const getGPUInfo = () => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) return null;

    const webglGl = gl as WebGLRenderingContext;
    const debugInfo = webglGl.getExtension("WEBGL_debug_renderer_info");

    return debugInfo
      ? {
          vendor: webglGl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
          renderer: webglGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
        }
      : null;
  };
  const gpu = getGPUInfo();

  // Feature detection
  const features = {
    webRTC: typeof RTCPeerConnection !== "undefined",
    serviceWorker: 'serviceWorker' in navigator,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window,
    indexedDB: 'indexedDB' in window,
    notifications: 'Notification' in window,
    clipboard: 'clipboard' in navigator,
  };

  // Adblock detection
  const detectAdblock = () => {
    const bait = document.createElement("div");
    bait.className = "adsbox";
    bait.style.height = "1px";
    document.body.appendChild(bait);
    const isBlocked = window.getComputedStyle(bait).display === "none";
    document.body.removeChild(bait);
    return isBlocked;
  }
  const adBlock = detectAdblock();

  // Permissions check
  const getPermissionState = async (name: PermissionName) => {
    try {
      const status = await navigator.permissions.query({ name });
      return status.state;
    } catch {
      return "unsupported";
    }
  };
  const permissions = {
    camera: await getPermissionState("camera"),
    microphone: await getPermissionState("microphone"),
    geolocation: await getPermissionState("geolocation"),
    notifications: await getPermissionState("notifications"),
    clipboardRead: await getPermissionState("clipboard-read" as PermissionName),
  };

  // Font detection (basic test fonts)
  const detectFonts = () => {
    const baseFonts = ["monospace", "sans-serif", "serif"];
    const testFonts = ["Arial", "Verdana", "Times New Roman", "Courier New", "Comic Sans MS"];
    const testString = "mmmmmmmmmmlli";
    const testSize = "72px";

    const defaultWidths: Record<string, number> = {};
    const detected: string[] = [];

    const span = document.createElement("span");
    span.style.fontSize = testSize;
    span.innerText = testString;
    document.body.appendChild(span);

    for (const base of baseFonts) {
      span.style.fontFamily = base;
      defaultWidths[base] = span.offsetWidth;
    }

    for (const font of testFonts) {
      for (const base of baseFonts) {
        span.style.fontFamily = `'${font}', ${base}`;
        if (span.offsetWidth !== defaultWidths[base]) {
          detected.push(font);
          break;
        }
      }
    }

    document.body.removeChild(span);
    return detected;
  };

  const fonts = detectFonts();

  return {
    // Standard data
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,
    platform: navigator.platform,
    screen: {
      width: window.screen.width,
      height: window.screen.height,
      pixelRatio: window.devicePixelRatio,
      orientation: screen.orientation?.type || "unknown",
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer,
    url: window.location.href,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory || "unknown",
    maxTouchPoints: navigator.maxTouchPoints,
    vendor: navigator.vendor,
    productSub: navigator.productSub,
    saveData: (navigator as any).connection?.saveData,
    connectionType: (navigator as any).connection?.effectiveType,
    downlink: (navigator as any).connection?.downlink,
    rtt: (navigator as any).connection?.rtt,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    batteryLevel: battery?.level,
    batteryCharging: battery?.charging,
    ip: ipGeo?.ip,
    city: ipGeo?.city,
    region: ipGeo?.region,
    country: ipGeo?.country_name,
    org: ipGeo?.org,
    gpu,
    features,
    permissions, 
    fonts,
    canvasFingerprint: canvas,
    adBlockDetected: adBlock,
  };
}