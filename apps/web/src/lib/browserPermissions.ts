// src/lib/browserPermissions.ts (or similar)

export async function requestGeolocation(): Promise<GeolocationPosition | null> {
  if (!navigator.geolocation) {
    console.warn("Geolocation is not supported by your browser.");
    return null;
  }
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
    return position;
  } catch (error) {
    console.error("Error getting geolocation:", error);
    return null;
  }
}

export async function requestClipboardText(): Promise<string | null> {
  if (!navigator.clipboard || !navigator.clipboard.readText) {
    console.warn("Clipboard API (readText) is not supported by your browser.");
    return null;
  }
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    // This often happens if the user denies permission, or if not triggered by a user gesture
    console.error("Error reading clipboard text:", error);
    return null;
  }
}