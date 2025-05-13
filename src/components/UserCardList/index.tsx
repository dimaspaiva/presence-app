import { StudentCard } from "../StudentCard";
import { AttendanceActions } from "../AttendanceActions";
import { ReturnIcon } from "../icons";
import { ImportStudentList } from "../ImportStudentList";
import { useUserCardList } from "./useUserCardList";

import "./styles.css";

export function UserList() {
  const {
    activeCards,
    isDisabledRollbackButton,
    rollBackActiveCard,
    selectNextActiveUserCard,
    setActiveCards,
    setUserList,
    userList,
  } = useUserCardList();

  if (!userList.length) {
    return (
      <ImportStudentList
        setStudentList={setUserList}
        setActiveCards={setActiveCards}
      />
    );
  }

  return (
    <div className="user-list_container">
      <h1 className="user-list_title">Lista de Presença</h1>
      <div className="user-list">
        {activeCards.length < 2 && <AttendanceActions />}
        {activeCards.map((user) => (
          <StudentCard
            student={userList.find((u) => u.id === user)!}
            key={user}
            applyStudentAttendance={selectNextActiveUserCard}
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
