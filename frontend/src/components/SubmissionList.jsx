import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading }) => {
  console.log(submissions);
  // Helper function to safely parse JSON strings
  const safeParse = (data) => {
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      return [data];
    }
  };

  // Helper function to calculate average memory usage
  const calculateAverageMemory = (memoryData) => {
    if (!memoryData) return 0;
    const parsedArray = safeParse(memoryData);
    const memoryArray = parsedArray.map((m) =>
      parseFloat(String(m).split(" ")[0]) || 0
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  // Helper function to calculate average runtime
  const calculateAverageTime = (timeData) => {
    if (!timeData) return 0;
    const parsedArray = safeParse(timeData);
    const timeArray = parsedArray.map((t) =>
      parseFloat(String(t).split(" ")[0]) || 0
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // No submissions state
  if (!submissions?.length) {
    return (
      <div className="text-center py-10">
        <div className="text-base-content/70">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-zebra table-md text-base-content w-full">
        <thead className="bg-base-300">
          <tr>
            <th>Status</th>
            <th>Language</th>
            <th>Runtime</th>
            <th>Memory</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const avgMemory = calculateAverageMemory(submission.memory);
            const avgTime = calculateAverageTime(submission.time);

            return (
              <tr key={submission.id} className="hover">
                <td>
                  {submission.status === "Accepted" ? (
                    <div className="flex items-center gap-2 text-success font-semibold">
                      <CheckCircle2 className="w-5 h-5" />
                      Accepted
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-error font-semibold">
                      <XCircle className="w-5 h-5" />
                      {submission.status}
                    </div>
                  )}
                </td>
                <td>
                  <span className="badge badge-neutral font-bold">{submission.language}</span>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Clock className="w-4 h-4" />
                    <span>{avgTime.toFixed(3)} s</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Memory className="w-4 h-4" />
                    <span>{avgMemory.toFixed(0)} KB</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(submission.CreatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionsList;