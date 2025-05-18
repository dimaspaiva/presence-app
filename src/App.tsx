import { StudentList } from "./components/StudentList";
import { AttendanceContext } from "./context/attendance.context";
import { useAttendance } from "./services/attendance-state.service";

function App() {
  const attendanceState = useAttendance();

  return (
    <AttendanceContext.Provider value={attendanceState}>
      <StudentList />
      <footer>
        <p>Version: 1.0.4.1</p>
      </footer>
    </AttendanceContext.Provider>
  );
}

export default App;
