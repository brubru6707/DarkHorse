import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface HistoricalEntry {
  id: string;
  timestamp: string;
  data: object; // This is an object, so stringify it
  nmapData: string; // This is a string, do NOT stringify it
  imageDescription: string; // This is a string, do NOT stringify it
  imageURL: string; // This is a string, do NOT stringify it (except for parsing for <img>)
  recommendation: string; // This is a string, do NOT stringify it
}

interface HistoryTimelineProps {
  historicalEntries: HistoricalEntry[];
}

export default function HistoryTimeline({ historicalEntries = [] }: HistoryTimelineProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(
    historicalEntries.length > 0 ? historicalEntries[0].id : null
  );
  // Correct initial states to be null or empty string, not stringified versions
  const [displayScanData, setDisplayScanData] = useState<string>('');
  const [displayNmapData, setDisplayNmapData] = useState<string>('');
  const [displayImageDescription, setDisplayImageDescription] = useState<string>('');
  const [displayImageURL, setDisplayImageURL] = useState<string>('');
  const [displayRecommendation, setDisplayRecommendation] = useState<string>('');

  useEffect(() => {
    if (historicalEntries.length > 0) {
      // Set the first entry as selected
      const firstEntry = historicalEntries[0];
      setSelectedEntryId(firstEntry.id);
      
      // Correctly handle stringification based on data type
      setDisplayScanData(JSON.stringify(firstEntry.data, null, 2)); // `data` is an object, so stringify
      setDisplayNmapData(firstEntry.nmapData); // `nmapData` is already a string
      setDisplayImageDescription(firstEntry.imageDescription); // `imageDescription` is already a string
      setDisplayImageURL(firstEntry.imageURL); // `imageURL` is already a string
      setDisplayRecommendation(firstEntry.recommendation); // `recommendation` is already a string
    }
  }, [historicalEntries]); // Dependency array to re-run when historicalEntries changes

  const handleCircleClick = (entry: HistoricalEntry) => {
    setSelectedEntryId(entry.id);
    // Correctly handle stringification based on data type
    setDisplayScanData(JSON.stringify(entry.data, null, 2)); // `data` is an object, so stringify
    setDisplayNmapData(entry.nmapData); // `nmapData` is already a string
    setDisplayImageDescription(entry.imageDescription); // `imageDescription` is already a string
    setDisplayImageURL(entry.imageURL); // `imageURL` is already a string
    setDisplayRecommendation(entry.recommendation); // `recommendation` is already a string
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-3xl font-bold text-white mb-8">Your Activity History</h2>

      <div className="w-full scrollbar-hide overflow-x-auto pb-6">
        <div className="relative flex items-center justify-center w-max min-w-[100vw] scrollbar-hide py-8">
          <div className="absolute left-0 right-0 h-2 bg-green-800 scrollbar-hide z-0 mx-auto w-full"></div>

          {historicalEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col items-center z-10 mx-6 relative group cursor-pointer"
              onClick={() => handleCircleClick(entry)}
            >
              <span className="absolute -top-6 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>

              <div
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300
                  ${selectedEntryId === entry.id
                    ? 'bg-gray-900 border-green-800 scale-125'
                    : 'bg-gray-900 border-green-800 hover:bg-green-700 hover:border-green-700'
                  }
                `}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto my-4 justify-center">
        {/* Left Container */}
        <div className="w-full md:w-[40vw] flex flex-col gap-6">
          {/* Nmap Data Card */}
          <div className="border border-green-300 rounded-md bg-black text-green-300 p-4">
            <div className="font-bold text-green-400 mb-1">Nmap Data</div>
            <pre className="text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-x-auto">
              {displayNmapData} {/* Now this will display correctly */}
            </pre>
          </div>
          {/* Scan Data Card */}
          <div className="border border-green-300 rounded-md bg-black text-green-300 p-4">
            <div className="font-bold text-green-400 mb-1">Scan Data</div>
            {displayScanData ? (
              <pre className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-x-auto">
                {displayScanData}
              </pre>
            ) : (
              <p className="text-base md:text-lg text-gray-400 text-center">No historical data available</p>
            )}
          </div>
        </div>
        {/* Right Container */}
        <div className="w-full md:w-[40vw] flex flex-col gap-6">
          {/* Image Card */}
          <div className="border border-green-300 rounded-md bg-black text-green-300 p-4 flex flex-col items-center">
            <div className="font-bold text-green-400 mb-1">Image</div>
            {/* Make sure displayImageURL is a valid URL string or base64. 
                The check `displayImageURL !== '""'` is also good for empty string cases.
                JSON.parse is only needed if the URL itself was stringified (e.g., "\"http://example.com/image.png\"")
                If it's just "http://example.com/image.png", then JSON.parse will fail.
                From your example, it seems like it's a base64 string, which likely is NOT stringified.
            */}
            {displayImageURL && displayImageURL !== '""' ? (
                <Image 
                  src={displayImageURL.startsWith('"') && displayImageURL.endsWith('"') ? JSON.parse(displayImageURL) : displayImageURL} 
                  alt="Historical Scan" 
                  className="mt-2 max-w-xs rounded-md border border-green-700" 
                />
              
            ) : (
              <span className="text-gray-400">No image available</span>
            )}
          </div>
          {/* Image Description Card */}
          <div className="border border-green-300 rounded-md bg-black text-green-300 p-4">
            <div className="font-bold text-green-400 mb-1">Image Description</div>
            <pre className="text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-x-auto">
              {displayImageDescription} {/* Now this will display correctly */}
            </pre>
          </div>
          {/* Recommendation Card */}
          <div className="border border-green-300 rounded-md bg-black text-green-300 p-4">
            <div className="font-bold text-green-400 mb-1">Recommendation</div>
            <pre className="text-base md:text-lg leading-relaxed whitespace-pre-wrap break-words max-w-full overflow-x-auto">
              {displayRecommendation} {/* Now this will display correctly */}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}