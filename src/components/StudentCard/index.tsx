import { Student } from "../../types/Student";
import { AttendanceEnum } from "../../types/Attendance";
import { useStudentCard } from "./useStudentCard";
import { Draggable } from "../Draggable";

import "./styles.css";
import { UserCardData } from "./CardData";

type StudentCardProps = {
  student: Student;
  applyStudentAttendance: (
    id: string,
    studentAttendance: AttendanceEnum
  ) => void;
};

export function StudentCard({
  student,
  applyStudentAttendance,
}: StudentCardProps) {
  const {
    avatarUrl,
    studentCardClassList,
    isLoading,
    defineStudentAttendance,
    createAnimationFunction,
  } = useStudentCard(applyStudentAttendance, student);

  return (
    <Draggable
      distanceToAccept={125}
      onAccept={defineStudentAttendance}
      className={studentCardClassList}
    >
      <UserCardData
        avatarUrl={avatarUrl}
        createAnimationFunction={createAnimationFunction}
        isLoading={isLoading}
        student={student}
      />
    </Draggable>
  );
}
