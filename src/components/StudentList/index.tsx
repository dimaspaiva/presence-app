import { StudentCard } from "../StudentCard";
import { AttendanceActions } from "../AttendanceActions";
import { ImportStudentList } from "../ImportStudentList";
import { useStudentList } from "./useStudentList";

import "./styles.css";
import { RollbackButton } from "./RollbackButton";

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
        <RollbackButton
          disabled={isDisabledRollbackButton}
          rollBackActiveCard={rollBackActiveCard}
        />
      </div>
    </div>
  );
}
