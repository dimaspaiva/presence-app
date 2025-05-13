import { useMemo, useState } from "react";
import {
  Attendance,
  AttendanceStatistics,
  AttendanceStudent,
} from "../types/Attendance";

export type UseAttendance = {
  attendanceState: Attendance;
  addStudentToAttendance: (attendanceStudent: AttendanceStudent) => void;
  removeLastStudentFromAttendance: () => void;
  attendanceStatistics: AttendanceStatistics;
};

export function useAttendance() {
  const [attendanceState, setAttendanceState] = useState<Attendance>([]);

  function addStudentToAttendance(attendanceStudent: AttendanceStudent) {
    setAttendanceState((prev) => [...prev, attendanceStudent]);
  }

  function removeLastStudentFromAttendance() {
    setAttendanceState((prev) => {
      return prev.slice(0, -1);
    });
  }

  const attendanceStatistics = useMemo((): AttendanceStatistics => {
    const total = attendanceState.length;
    const present = attendanceState.filter(
      (student) => student.isPresent
    ).length;
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
    addStudentToAttendance,
    removeLastStudentFromAttendance,
    attendanceStatistics,
  };
}
