import { createContext } from "react";
import { UseAttendance } from "../services/attendance-state.service";

export const AttendanceContext = createContext<UseAttendance | null>(null);
