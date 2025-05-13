import { StudentCard } from "../StudentCard";
import { AttendanceActions } from "../AttendanceActions";
import { ReturnIcon } from "../icons";
import { ImportStudentList } from "../ImportStudentList";
import { useStudentList } from "./useStudentList";

import "./styles.css";

export function StudentList() {
  const {
    activeCards,
    isDisabledRollbackButton,
    rollBackActiveCard,
    selectNextActiveStudentCard,
    setActiveCards,
    setStudentList,
    studentList,
  } = useStudentList();

  if (!studentList.length) {
    return (
      <ImportStudentList
        setStudentList={setStudentList}
        setActiveCards={setActiveCards}
      />
    );
  }

  return (
    <div className="student-list_container">
      <h1 className="student-list_title">Lista de Presença</h1>
      <div className="student-list">
        {activeCards.length < 2 && <AttendanceActions />}
        {activeCards.map((studentId) => (
          <StudentCard
            student={studentList.find((student) => student.id === studentId)!}
            key={studentId}
            applyStudentAttendance={selectNextActiveStudentCard}
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
