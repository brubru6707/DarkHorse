import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const { ip } = await request.json();

    if (!ip) {
      console.error("Error: No IP provided in the request body.");
      return NextResponse.json({ error: "No IP provided." }, { status: 400 });
    }

    // Define separate regexes for IPv4 and IPv6
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    const ipv6Regex = new RegExp(
      "^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$|" + // IPv6 full
      "^(?:[A-F0-9]{1,4}:){1,7}:(?:[A-F0-9]{1,4}){1,7}$|" + // IPv6 shorthand (:: at start/end)
      "^(?:[A-F0-9]{1,4}:){1,6}:[A-F0-9]{1,4}$|" + // IPv6 shorthand (:: in middle)
      "^::(?:[A-F0-9]{1,4}:){0,5}[A-F0-9]{1,4}$|" + // IPv6 shorthand (:: at start)
      "^[A-F0-9]{1,4}:(?:[A-F0-9]{1,4}:){0,5}:[A-F0-9]{1,4}$|" + // IPv6 shorthand (:: in middle)
      "^[A-F0-9]{1,4}:(?:[A-F0-9]{1,4}:){0,4}:(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$" // IPv6 with embedded IPv4
      , "i" // 'i' flag for case-insensitive matching of hex characters in IPv6
    );

    let isIPv6 = false; // Initialize the flag

    if (ipv4Regex.test(ip)) {
      // It's an IPv4 address
      isIPv6 = false;
    } else if (ipv6Regex.test(ip)) {
      // It's an IPv6 address
      isIPv6 = true;
    } else {
      // Neither IPv4 nor IPv6 - invalid format
      console.error(`Error: Invalid IP format received: ${ip}`);
      return NextResponse.json({ error: "Invalid IP format." }, { status: 400 });
    }

    try {
      // Conditionally add the -6 option for IPv6 addresses
      // Also, add -Pn to skip host discovery (ping probes)
      const nmapCommand = isIPv6 ? `nmap -T4 -F -6 -Pn ${ip}` : `nmap -T4 -F -Pn ${ip}`;
      console.log(`Executing Nmap command: ${nmapCommand}`); // Log the command for debugging

      const { stdout, stderr } = await execPromise(nmapCommand);

      if (stderr) {
        // Log warnings but still return result if stdout exists
        console.warn(`Nmap command issued warnings for IP ${ip}:\n${stderr}`);
      }

      // If stdout is empty, it might mean no hosts were found or an issue occurred,
      // even if nmap didn't throw a fatal error.
      if (!stdout.trim() && !stderr.includes("0 hosts scanned")) {
         console.warn(`Nmap returned empty stdout for IP ${ip}. Possible issue or no open ports.`);
         // You might want to return a specific message to the user in this case
      }

      return NextResponse.json({ result: stdout });

    } catch (execError: any) {
      console.error(`Error executing nmap command for IP ${ip}:`, execError);

      let errorMessage = "An unknown error occurred during nmap execution.";
      if (execError.code === 127) {
        errorMessage = "Nmap command not found. Please ensure nmap is installed and accessible on the server's PATH.";
      } else if (execError.stderr) {
        errorMessage = `Nmap execution failed: ${execError.stderr.trim()}`;
      } else if (execError.message) {
        errorMessage = `Execution error: ${execError.message}`;
      }

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Error processing request:", error);

    let clientErrorMessage = "Invalid request payload.";
    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      clientErrorMessage = "Invalid JSON in request body.";
    }

    return NextResponse.json({ error: clientErrorMessage }, { status: 400 });
  }
}
