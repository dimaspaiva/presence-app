import { useContext, useState } from "react";
import { UserCard } from "../UserCard";
import { AttendanceEnum } from "../../types/Attendance";
import { AttendanceActions } from "../AttendanceActions";
import { AttendanceContext } from "../../context/attendance.context";
import { ReturnIcon } from "../icons";
import { ImportUserList } from "../ImportUserList";
import { User } from "../../types/User";

import "./styles.css";

export function UserList() {
  const [activeCards, setActiveCards] = useState<string[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const attendanceContext = useContext(AttendanceContext);

  if (!attendanceContext) {
    console.error("Attendance context is not available");
    return null;
  }

  if (!userList.length) {
    return (
      <ImportUserList
        setUserList={setUserList}
        setActiveCards={setActiveCards}
      />
    );
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

  const isDisabledRollbackButton = userList[0].id === activeCards[1];

  return (
    <div className="user-list_container">
      <h1 className="user-list_title">Lista de Presença</h1>
      <div className="user-list">
        {activeCards.length < 2 && <AttendanceActions />}
        {activeCards.map((user) => (
          <UserCard
            user={userList.find((u) => u.id === user)!}
            key={user}
            applyUserAttendance={selectNextActiveUserCard}
          />
        ))}
      </div>
      <div className="rollback-container">
        <button
          className="rollback-button"
          onClick={rollBackActiveCard}
          disabled={isDisabledRollbackButton}
        >
          Voltar <ReturnIcon />
        </button>
      </div>
    </div>
  );
}
