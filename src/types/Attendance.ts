import { Student } from "./Student"

export enum AttendanceEnum {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export type AttendanceUser = Student & {
  isPresent: boolean
}

export type Attendance = AttendanceUser[]

export type AttendanceStatistics = {
  total: number
  present: number
  absent: number
  percentagePresent: string
  percentageAbsent: string
}
