import { Attendance } from "../types/Attendance";

export function mapAttendanceDataToCsvString(attendanceData: Attendance, presentFormat = '.', absentFormat = ' '): string {
  const header = "Número,Nome,Presença\n"
  const body = attendanceData.reduce((result, student) => result.concat(
    `${student.number},${student.name},${student.isPresent ? presentFormat : absentFormat}\n`),
    '');

  return `${header}${body}`;
}

export function buildStudentsExampleCsvData(): string {
  const header = "Número,Nome"
  const body = "1,Nome 1\n2,Nome 2\n3,Nome 3";

  return `${header}\n${body}`;
}

export function parseCsvFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result !== 'string') {
        reject(new Error('File reading error'));
        return;
      }

      const text = event.target.result;
      const [header, ...lines] = text.split('\n');
      const objectKeys = header.split(',');

      const noEmptyLineData = lines.filter((line) => Boolean(line))
      const data = noEmptyLineData.map(line => {
        const values = line.split(',');

        return objectKeys.reduce((obj: Record<string, string>, key, index) => {
          obj[key.trim()] = values[index].trim();
          return obj;
        }, {});
      });

      resolve(data);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
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
