interface LoaderProps {
  message?: string;
}

export function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 gap-4"
      role="status"
      aria-label={message}
    >
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-4 border-brand-100" />
        <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin" />
      </div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading timesheets">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {["Week #", "Date", "Status", "Actions"].map((col) => (
                <th key={col} className="px-4 py-3 text-left">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-4">
                  <div className="h-4 w-16 bg-gray-100 rounded" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-20 bg-gray-100 rounded-full" />
                </td>
                <td className="px-4 py-4">
                  <div className="h-8 w-16 bg-gray-100 rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="sr-only">Loading timesheets...</span>
    </div>
  );
}
