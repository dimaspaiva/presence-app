import { UserCard } from "../UserCard";
import { AttendanceActions } from "../AttendanceActions";
import { ReturnIcon } from "../icons";
import { ImportUserList } from "../ImportUserList";
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
      <ImportUserList
        setUserList={setUserList}
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
