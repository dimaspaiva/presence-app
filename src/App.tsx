import { StudentList } from "./components/StudentList";
import { AttendanceContext } from "./context/attendance.context";
import { useAttendance } from "./services/attendance-state.service";

function App() {
  const attendanceState = useAttendance();

  return (
    <AttendanceContext.Provider value={attendanceState}>
      <StudentList />
    </AttendanceContext.Provider>
  );
}

export default App;
