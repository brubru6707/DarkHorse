import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json();
    
    if (!ip) {
      return NextResponse.json({ error: "No IP provided." }, { status: 400 });
    }

    return new Promise((resolve) => {
      exec(`nmap -T4 -F ${ip}`, (error, stdout, stderr) => {
        if (error) {
          resolve(NextResponse.json({ error: stderr }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ result: stdout }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
