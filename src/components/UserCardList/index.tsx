import { useState } from "react";
import { mockUserList } from "../../mocks/users.mock";
import { UserCard } from "../UserCard";
import { Attendance, AttendanceEnum } from "../../types/Attendance";

import "./styles.css";

const attendanceState: Attendance = [];

export function UserList() {
  const [activeCards, setActiveCards] = useState<string[]>([
    mockUserList[1].id,
    mockUserList[0].id,
  ]);

  const selectNextActiveUserCard = (
    userId: string,
    useAttendance: AttendanceEnum
  ) => {
    const actualUserIndex = mockUserList.findIndex(
      (user) => user.id === userId
    );

    if (actualUserIndex === -1) {
      console.error("User not found");
      return;
    }

    attendanceState.push({
      ...mockUserList[actualUserIndex],
      isPresent: useAttendance === AttendanceEnum.PRESENT,
    });

    setActiveCards((prev) => {
      if (mockUserList[actualUserIndex + 2]) {
        return [mockUserList[actualUserIndex + 2].id, prev[0]];
      }

      if (prev.length === 2) {
        return [prev[0]];
      }

      return [];
    });
  };

  const rollBackActiveCard = () => {
    const actualIndex = mockUserList.findIndex(
      (user) => user.id === activeCards[1]
    );
    if (actualIndex === 0) {
      console.warn("No previous user to roll back to");
      return;
    }

    const previousUser = mockUserList[actualIndex - 1];

    setActiveCards((prev) => [prev[1], previousUser.id]);
    attendanceState.pop();
  };

  const isDisabledRollbackButton = mockUserList[0].id === activeCards[1];

  return (
    <div className="user-list_container">
      <h1 className="user-list_title">Lista de Presença</h1>
      <div className="user-list">
        {activeCards.map((user) => (
          <UserCard
            user={mockUserList.find((u) => u.id === user)!}
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
          Voltar {"<"}
        </button>
      </div>
    </div>
  );
}
