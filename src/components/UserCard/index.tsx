import { Student } from "../../types/Student";
import { AttendanceEnum } from "../../types/Attendance";

import "./styles.css";
import { useUserCard } from "./useUserCard";

export type UserProps = {
  user: Student;
  applyUserAttendance: (id: string, userAttendance: AttendanceEnum) => void;
};

export function UserCard({ user, applyUserAttendance }: UserProps) {
  const {
    avatarUrl,
    cardPosition,
    cardRef,
    userCardClassList,
    isLoading,
    createAnimationFunction,
  } = useUserCard(applyUserAttendance, user);

  return (
    <div
      data-testid="user-card"
      className={userCardClassList}
      draggable
      ref={cardRef}
      style={{
        marginLeft: cardPosition.x,
        marginTop: cardPosition.y,
        rotate: cardPosition.rotate,
      }}
    >
      <div className="user-data_container">
        <h2 className="user-name">{user.name}</h2>
        <h3 className="user-number">{user.number}</h3>
      </div>
      <div className="user-avatar_container">
        <div className="avatar-circle">
          {isLoading && <div className="avatar_loading-spinner"></div>}
          {!isLoading && (
            <img className="user-avatar" src={avatarUrl} alt={user.name} />
          )}
          {!isLoading && !avatarUrl && <div className="user-avatar"></div>}
        </div>
      </div>
      <div className="user-card_actions">
        <button
          className="user-card_button button_absence"
          onClick={createAnimationFunction(AttendanceEnum.ABSENT)}
        >
          Ausente
        </button>
        <button
          className="user-card_button button_presence"
          onClick={createAnimationFunction(AttendanceEnum.PRESENT)}
        >
          Presente
        </button>
      </div>
    </div>
  );
}
