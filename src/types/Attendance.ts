import { Student } from "./Student"

export enum AttendanceEnum {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export type AttendanceStudent = Student & {
  isPresent: boolean
}

export type Attendance = AttendanceStudent[]

export type AttendanceStatistics = {
  total: number
  present: number
  absent: number
  percentagePresent: string
  percentageAbsent: string
}
