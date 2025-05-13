import { useContext, useState } from "react";
import { Student } from "../../types/Student";
import { AttendanceContext } from "../../context/attendance.context";
import { AttendanceEnum } from "../../types/Attendance";

export function useUserCardList() {
  const [activeCards, setActiveCards] = useState<string[]>([]);
  const [userList, setUserList] = useState<Student[]>([]);
  const attendanceContext = useContext(AttendanceContext);

  if (!attendanceContext) {
    console.error("Attendance context is not available");
    throw new Error('Attendance context is not available')
  }

  const { addUserToAttendance, removeLastUserFromAttendance } =
    attendanceContext;

  const selectNextActiveUserCard = (
    userId: string,
    useAttendance: AttendanceEnum
  ) => {
    const actualUserIndex = userList.findIndex((user) => user.id === userId);

    if (actualUserIndex === -1) {
      console.error("User not found");
      return;
    }

    addUserToAttendance({
      ...userList[actualUserIndex],
      isPresent: useAttendance === AttendanceEnum.PRESENT,
    });

    setActiveCards((prev) => {
      if (userList[actualUserIndex + 2]) {
        return [userList[actualUserIndex + 2].id, prev[0]];
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
      setActiveCards([userList[userList.length - 1].id]);
      return;
    }

    if (activeCards.length === 1) {
      removeLastUserFromAttendance();
      setActiveCards((prev) => [prev[0], userList[userList.length - 2].id]);
      return;
    }

    const actualIndex = userList.findIndex(
      (user) => user.id === activeCards[1]
    );

    if (actualIndex === 0) {
      console.warn("No previous user to roll back to");
      return;
    }

    const previousUser = userList[actualIndex - 1];

    setActiveCards((prev) => [prev[1], previousUser.id]);
    removeLastUserFromAttendance();
  };

  const isDisabledRollbackButton = userList.length && userList[0].id === activeCards[1];


  return {
    setUserList,
    userList,
    activeCards,
    setActiveCards,
    selectNextActiveUserCard,
    isDisabledRollbackButton,
    rollBackActiveCard,
  }
}
