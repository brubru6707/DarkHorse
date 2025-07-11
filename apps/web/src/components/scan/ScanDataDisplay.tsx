interface ScanDataDisplayProps {
    data: object | undefined;
  }
  
  export default function ScanDataDisplay({ data }: ScanDataDisplayProps) {
    return (
      <div className="border border-green-300 rounded-md">
        <pre className="bg-black text-green-300 p-4 rounded-md overflow-x-auto text-xs scrollbar-hide">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }