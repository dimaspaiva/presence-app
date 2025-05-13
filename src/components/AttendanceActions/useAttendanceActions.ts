import { useContext, useState } from "react";
import { AttendanceContext } from "../../context/attendance.context";
import { downloadCsvFile, mapAttendanceDataToCsvString } from "../../services/csv.service";

export function useAttendanceActions() {
  const attendanceContext = useContext(AttendanceContext);
  const [presentFormat, setPresentFormat] = useState(".");
  const [absentFormat, setAbsentFormat] = useState(" ");
  const [className, setClassName] = useState("");
  const [highlightClassNameInput, setHighlightClassNameInput] = useState(false);

  if (!attendanceContext) {
    console.error("Attendance context is not available");
    throw new Error("Attendance context is not available");
  }

  const { attendanceState, attendanceStatistics } = attendanceContext;

  function isNameInputValid(): boolean {
    if (!className.trim()) {
      alert("É necessário inserir o nome da turma");
      setHighlightClassNameInput(true);
      return true;
    }

    setHighlightClassNameInput(false);
    return false;
  }

  function downloadAttendanceAsCSV() {
    if (isNameInputValid()) {
      return;
    }

    const data = mapAttendanceDataToCsvString(
      attendanceState,
      presentFormat.trim(),
      absentFormat.trim()
    );
    const fileNameDate = new Date().toISOString().split(".")[0];
    const fileName = `presença_${className}_${fileNameDate}.csv`;

    downloadCsvFile(data, fileName);
  }

  function changePresentFormat(event: React.ChangeEvent<HTMLInputElement>) {
    setPresentFormat(event.target.value);
  }

  function changeAbsentFormat(event: React.ChangeEvent<HTMLInputElement>) {
    setAbsentFormat(event.target.value);
  }

  function updateClassName(event: React.ChangeEvent<HTMLInputElement>) {
    setClassName(event.target.value);
  }

  return {
    attendanceStatistics,
    downloadAttendanceAsCSV,
    changePresentFormat,
    presentFormat,
    changeAbsentFormat,
    absentFormat,
    updateClassName,
    className,
    highlightClassNameInput,
  }
}
