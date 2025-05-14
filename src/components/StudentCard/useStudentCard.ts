import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AttendanceEnum } from "../../types/Attendance";
import { Student } from "../../types/Student";
import { DirectionEnum } from "../Draggable";

export type ApplyStudentAttendanceFunction = (studentId: string, attendance: AttendanceEnum) => void

export function useStudentCard(applyStudentAttendance: ApplyStudentAttendanceFunction, student: Student) {
  const [selectedAnimation, setSelectedAnimation] = useState<
    AttendanceEnum | ""
  >("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("#");
  const [isLoading, setIsLoading] = useState(false);
  const [fade, setFade] = useState(false);

  function defineStudentAttendance(direction: DirectionEnum) {
    if (direction === DirectionEnum.LEFT) {
      return applyStudentAttendance(student.id, AttendanceEnum.ABSENT)
    }

    applyStudentAttendance(student.id, AttendanceEnum.PRESENT)
  }

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://api.dicebear.com/9.x/bottts/svg?seed=${student.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url || "#");
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [student.id]);

  const createAnimationFunction = useCallback(
    (attendanceType: AttendanceEnum) => {
      return () => {
        setSelectedAnimation(attendanceType);
        setTimeout(() => {
          setFade(true);
        }, 100);

        setTimeout(() => {
          applyStudentAttendance(student.id, attendanceType);
        }, 300);
      };
    },
    [applyStudentAttendance, student.id]
  );


  const studentCardClassList = useMemo(() => {
    const fadeClass = fade ? "fade" : ""

    return `student-card_container card ${fadeClass} ${selectedAnimation.toLocaleLowerCase()}`
  }, [fade, selectedAnimation])

  return {
    avatarUrl,
    cardRef,
    createAnimationFunction,
    defineStudentAttendance,
    fade,
    isLoading,
    selectedAnimation,
    studentCardClassList,
  }
}
