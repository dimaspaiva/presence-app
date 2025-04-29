import { Attendance } from "../types/Attendance";

export function mapAttendanceDataToCsvString(attendanceData: Attendance, presentFormat = '.', absentFormat = ' '): string {
  const header = "Número,Nome,Presença\n"

  const body = attendanceData.reduce((result, user) => result.concat(
    `${user.number},${user.name},${user.isPresent ? presentFormat : absentFormat}\n`),
    '');

  return `${header}${body}`;
}

export function downloadCsvFile(data: string, fileName: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
