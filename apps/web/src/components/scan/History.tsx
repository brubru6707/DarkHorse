import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Id } from '@packages/backend/convex/_generated/dataModel';

interface HistoricalEntry {
  id: Id<"userDataLogs">;
  timestamp: string;
  data: object;
  nmapData: string;
  imageDescription: string;
  imageURL: string;
  recommendation: string;
}

interface HistoryTimelineProps {
  historicalEntries: HistoricalEntry[];
  onSelectEntry: (entry: HistoricalEntry | null) => void;
  selectedEntryIdFromParent: Id<"userDataLogs"> | null;
}

export default function HistoryTimeline({ historicalEntries = [], onSelectEntry, selectedEntryIdFromParent }: HistoryTimelineProps) {
  const [activeCircleId, setActiveCircleId] = useState<Id<"userDataLogs"> | null>(null);

  useEffect(() => {
    setActiveCircleId(selectedEntryIdFromParent);
  }, [selectedEntryIdFromParent]);

  useEffect(() => {
    if (historicalEntries.length > 0 && selectedEntryIdFromParent === null) {
      const mostRecentEntry = historicalEntries[historicalEntries.length - 1];
      if (activeCircleId !== mostRecentEntry.id) {
        onSelectEntry(mostRecentEntry);
      }
      setActiveCircleId(mostRecentEntry.id);
    } else if (historicalEntries.length === 0) {
      onSelectEntry(null);
      setActiveCircleId(null);
    }
  }, [historicalEntries, onSelectEntry, selectedEntryIdFromParent, activeCircleId]);

  const handleCircleClick = (entry: HistoricalEntry) => {
    setActiveCircleId(entry.id);
    onSelectEntry(entry);
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <h2 className="text-xl font-bold text-white mb-4">Activity History</h2>

      <div className="w-full scrollbar-hide overflow-x-auto pb-4">
        <div className="relative flex items-center justify-center w-full scrollbar-hide py-4">
          <div className="absolute left-0 right-0 h-1 bg-green-800 scrollbar-hide z-0 mx-auto w-full"></div>

          {historicalEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col items-center z-10 mx-4 relative group cursor-pointer"
              onClick={() => handleCircleClick(entry)}
            >
              <span className="absolute -top-4 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>

              <div
                className={`w-6 h-6 rounded-full border-2 transition-all duration-300
                  ${activeCircleId === entry.id
                    ? 'bg-gray-900 border-green-800 scale-110'
                    : 'bg-gray-900 border-green-800 hover:bg-green-700 hover:border-green-700'
                  }
                `}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}