import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import { Id } from "@packages/backend/convex/_generated/dataModel";
import { runNmapScan } from "@/lib/api";

interface NmapOutputDisplayProps {
  logId: Id<"userDataLogs"> | null;
  previousNmapData: string | null;
  latestData: any;
}

export default function NmapOutputDisplay({ logId, previousNmapData, latestData }: NmapOutputDisplayProps) {
  const updateNmapData = useMutation(api.logUserData.updateNmapData);
  const [nmapData, setNmapData] = useState<string | null>(null);
  useEffect(() => {
    if (previousNmapData && previousNmapData !== "") {
      setNmapData(previousNmapData);
      return;
    }
    const runScan = async () => {
      if (!latestData?.ip || !logId) {
        setNmapData(null);
        return;
      }
      setNmapData("Nmap running...");
      try {
        const result = await runNmapScan(latestData.ip);
        setNmapData(result);
        await updateNmapData({ id: logId, nmapData: result });
      } catch (error) {
        console.error("Failed to run Nmap scan:", error);
        setNmapData("Failed to retrieve Nmap data.");
      }
    };
    if (!previousNmapData || previousNmapData.trim() === "")
      runScan();
  }, [previousNmapData, latestData, logId, updateNmapData]);

  if (!nmapData) {
    return <span>Nmap data not available or still running...</span>;
  }

  return (
    <div className="border border-green-300 rounded-md">
      <pre className="bg-black text-green-300 p-4 rounded-md overflow-x-auto text-xs scrollbar-hide">
        {nmapData}
      </pre>
    </div>
  );
}