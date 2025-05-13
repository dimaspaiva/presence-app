import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AttendanceEnum } from "../../types/Attendance";
import { Student } from "../../types/Student";

export type ApplyStudentAttendanceFunction = (studentId: string, attendance: AttendanceEnum) => void

export function useStudentCard(applyStudentAttendance: ApplyStudentAttendanceFunction, student: Student) {
  const [selectedAnimation, setSelectedAnimation] = useState<
    AttendanceEnum | ""
  >("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("#");
  const [isLoading, setIsLoading] = useState(false);
  const [fade, setFade] = useState(false);
  const [cardPosition, setCardPosition] = useState<{
    x: number;
    y: number;
    rotate: string;
  }>({
    x: 0,
    y: 0,
    rotate: "0deg",
  });

  const buildResetCard = useCallback(
    (initialPosition: { x: number; y: number }, applyStudentAttendance: ApplyStudentAttendanceFunction, studentId: string, signal: AbortController) => {
      return (event: TouchEvent) => {
        if (
          initialPosition.x - event.changedTouches[0].clientX >
          MINIMAL_DISTANCE
        ) {
          return applyStudentAttendance(studentId, AttendanceEnum.PRESENT);
        }

        if (
          initialPosition.x - event.changedTouches[0].clientX <
          -MINIMAL_DISTANCE
        ) {
          return applyStudentAttendance(studentId, AttendanceEnum.ABSENT);
        }

        setCardPosition({ x: 0, y: 0, rotate: "0deg" });
        signal.abort()
      };
    },
    []
  );

  const calculateRotation = useCallback((distanceX: number) => {
    if (distanceX > 0) {
      return `${Math.min(distanceX * 0.1, 45)}deg`;
    }

    return `${Math.max(distanceX * 0.1, -45)}deg`;
  }, []);

  const buildMoveCard = useCallback(
    (initialPosition: { x: number; y: number }) => {
      return (event: TouchEvent) => {
        event.preventDefault();
        const x = event.touches[0].clientX;
        const y = event.touches[0].clientY;

        const newX = x - initialPosition.x;
        const newY = y - initialPosition.y;

        const rotate = calculateRotation(newX);
        setCardPosition({ x: newX, y: newY, rotate });
      };
    },
    [calculateRotation]
  );

  const startCardMovement = useCallback((event: TouchEvent) => {
    const x = event.touches[0].clientX;
    const y = event.touches[0].clientY;

    if (!event.target) {
      console.error("Missing event target");
      return;
    }

    const cleanupEventListeners = new AbortController()
    const cleanupSignal = cleanupEventListeners.signal

    event.target.addEventListener(
      "touchmove",
      buildMoveCard({ x, y }) as EventListenerOrEventListenerObject,
      { signal: cleanupSignal }
    ); // TODO Improve type
    event.target.addEventListener(
      "touchend",
      buildResetCard({ x, y }, applyStudentAttendance, student.id, cleanupEventListeners) as EventListenerOrEventListenerObject,
      { signal: cleanupSignal }
    ); // TODO Improve type
  },
    [buildMoveCard, buildResetCard, applyStudentAttendance, student.id]
  );

  const MINIMAL_DISTANCE = 150;

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

  useEffect(() => {
    cardRef.current?.addEventListener("touchstart", startCardMovement);
    const card = cardRef.current;

    return () => {
      card?.removeEventListener("touchstart", startCardMovement);
    };
  }, [cardRef, startCardMovement]);

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
    selectedAnimation,
    cardRef,
    avatarUrl,
    isLoading,
    fade,
    cardPosition,
    createAnimationFunction,
    studentCardClassList
  }
}
