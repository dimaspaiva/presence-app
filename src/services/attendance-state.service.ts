import { Attendance, AttendanceUser } from "../types/Attendance"

const attendance: Attendance = []

export function getAttendanceState() {
  return attendance
}

export function addUserToAttendance(user: AttendanceUser) {
  attendance.push(user)
}

export function removeLastUserFromAttendance() {
  attendance.pop()
}
