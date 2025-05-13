import { useContext, useMemo, useState } from "react";
import { Student } from "../../types/Student";
import { AttendanceContext } from "../../context/attendance.context";
import { AttendanceEnum } from "../../types/Attendance";

export function useStudentList() {
  const [activeCards, setActiveCards] = useState<string[]>([]);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const attendanceContext = useContext(AttendanceContext);

  if (!attendanceContext) {
    console.error("Attendance context is not available");
    throw new Error('Attendance context is not available')
  }

  const { addUserToAttendance, removeLastUserFromAttendance } =
    attendanceContext;

  const selectNextActiveStudentCard = (
    studentId: string,
    useAttendance: AttendanceEnum
  ) => {
    const actualStudentIndex = studentList.findIndex((student) => student.id === studentId);

    if (actualStudentIndex === -1) {
      console.error("Student not found");
      return;
    }

    addUserToAttendance({
      ...studentList[actualStudentIndex],
      isPresent: useAttendance === AttendanceEnum.PRESENT,
    });

    setActiveCards((prev) => {
      if (studentList[actualStudentIndex + 2]) {
        return [studentList[actualStudentIndex + 2].id, prev[0]];
      }

      if (prev.length === 2) {
        return [prev[0]];
      }

      return [];
    });
  };

  const rollBackActiveCard = () => {
    if (activeCards.length === 0) {
      removeLastUserFromAttendance();
      setActiveCards([studentList[studentList.length - 1].id]);
      return;
    }

    if (activeCards.length === 1) {
      removeLastUserFromAttendance();
      setActiveCards((prev) => [prev[0], studentList[studentList.length - 2].id]);
      return;
    }

    const actualIndex = studentList.findIndex(
      (student) => student.id === activeCards[1]
    );

    if (actualIndex === 0) {
      console.warn("No previous student to roll back to");
      return;
    }

    const previousStudent = studentList[actualIndex - 1];

    setActiveCards((prev) => [prev[1], previousStudent.id]);
    removeLastUserFromAttendance();
  };

  const isDisabledRollbackButton = useMemo(() =>
    Boolean(studentList.length) && studentList[0].id === activeCards[1],
    [studentList, activeCards]
  );


  return {
    setStudentList,
    studentList,
    activeCards,
    setActiveCards,
    selectNextActiveStudentCard,
    isDisabledRollbackButton,
    rollBackActiveCard,
  }
}
