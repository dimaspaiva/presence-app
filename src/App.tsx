import { UserList } from "./components/UserCardList";
import { AttendanceContext } from "./context/attendance.context";
import { useAttendance } from "./services/attendance-state.service";

function App() {
  const attendanceState = useAttendance();

  return (
    <AttendanceContext.Provider value={attendanceState}>
      <UserList />
    </AttendanceContext.Provider>
  );
}

export default App;
