import { useMemo, useState } from "react";
import {
  Attendance,
  AttendanceStatistics,
  AttendanceUser,
} from "../types/Attendance";

export type UseAttendance = {
  attendanceState: Attendance;
  addUserToAttendance: (user: AttendanceUser) => void;
  removeLastUserFromAttendance: () => void;
  attendanceStatistics: AttendanceStatistics;
};

export function useAttendance() {
  const [attendanceState, setAttendanceState] = useState<Attendance>([]);

  function addUserToAttendance(user: AttendanceUser) {
    setAttendanceState((prev) => [...prev, user]);
  }

  function removeLastUserFromAttendance() {
    setAttendanceState((prev) => {
      return prev.slice(0, -1);
    });
  }

  const attendanceStatistics = useMemo((): AttendanceStatistics => {
    const total = attendanceState.length;
    const present = attendanceState.filter((user) => user.isPresent).length;
    const absent = total - present;

    return {
      total,
      present,
      absent,
      percentagePresent: ((present / total) * 100).toFixed(2),
      percentageAbsent: ((absent / total) * 100).toFixed(2),
    };
  }, [attendanceState]);

  return {
    attendanceState,
    addUserToAttendance,
    removeLastUserFromAttendance,
    attendanceStatistics,
  };
}
