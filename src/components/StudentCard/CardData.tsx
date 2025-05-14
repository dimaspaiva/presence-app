import { memo } from "react";
import { Student } from "../../types/Student";
import { AttendanceEnum } from "../../types/Attendance";

type UserCardDataProps = {
  student: Student;
  isLoading: boolean;
  avatarUrl: string;
  createAnimationFunction: (attendance: AttendanceEnum) => () => void;
};

export const UserCardData = memo((props: UserCardDataProps) => {
  const { isLoading, student, avatarUrl, createAnimationFunction } = props;

  return (
    <>
      <div data-testid="student-card" className="student-data_container">
        <h2 className="student-name">{student.name}</h2>
        <h3 className="student-number">{student.number}</h3>
      </div>
      <div className="student-avatar_container">
        <div className="avatar-circle">
          {isLoading && <div className="avatar_loading-spinner"></div>}
          {!isLoading && (
            <img
              className="student-avatar"
              src={avatarUrl}
              alt={student.name}
            />
          )}
          {!isLoading && !avatarUrl && <div className="student-avatar"></div>}
        </div>
      </div>
      <div className="student-card_actions">
        <button
          className="student-card_button button_absence"
          onClick={createAnimationFunction(AttendanceEnum.ABSENT)}
        >
          Ausente
        </button>
        <button
          className="student-card_button button_presence"
          onClick={createAnimationFunction(AttendanceEnum.PRESENT)}
        >
          Presente
        </button>
      </div>
    </>
  );
});
