// lib/api.ts

export async function getImageDescription(data: object): Promise<string | null> {
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData.message);
        return null;
      }
  
      const result = await response.json();
      return result.description || null;
    } catch (error) {
      console.error("Error calling generate-description API:", error);
      return null;
    }
  }
  
  export async function generateImageFromDescription(description: string): Promise<string | null> {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Image Generation API Error:', errorData.message);
        return null;
      }
  
      const result = await response.json();
      return result.imageUrl || null;
    } catch (error) {
      console.error("Error calling generate-image API:", error);
      return null;
    }
  }
  
  export async function runNmapScan(ip: string) {
    const res = await fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ip }),
    });
  
    const data = await res.json();
    return data.result;
  }