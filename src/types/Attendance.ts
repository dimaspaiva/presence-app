import { User } from "./User"

export enum AttendanceEnum {
  PRESENT = "PRESENT",
  ABSENT = "ABSENT",
}

export type AttendanceUser = User & {
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
