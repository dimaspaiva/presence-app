import { useContext, useState } from "react";
import {
  downloadCsvFile,
  mapAttendanceDataToCsvString,
} from "../../services/csv.service";
import { AttendanceContext } from "../../context/attendance.context";

import "./styles.css";

export function AttendanceActions() {
  const attendanceContext = useContext(AttendanceContext);
  const [presentFormat, setPresentFormat] = useState(".");
  const [absentFormat, setAbsentFormat] = useState(" ");
  const [className, setClassName] = useState("");
  const [highlightClassNameInput, setHighlightClassNameInput] = useState(false);

  if (!attendanceContext) {
    console.error("Attendance context is not available");
    return null;
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

  return (
    <div className="attendance-actions_container card">
      <div className="attendance-actions_header">
        <h2 className="attendance-actions_title">Lista finalizada!</h2>
      </div>

      <div className="attendance-action_data">
        <h3 className="attendance-action_data-title">Dados da chamada</h3>
        <div className="attendance-action_data-content">
          <p className="attendance-action_data-content-item">
            Total de alunos: <b>{attendanceStatistics.total}</b>
          </p>
          <p className="attendance-action_data-content-item">
            Total de presentes:{" "}
            <b>
              {attendanceStatistics.present} (
              {attendanceStatistics.percentagePresent}%)
            </b>
          </p>
          <p className="attendance-action_data-content-item">
            Total de ausentes:{" "}
            <b>
              {attendanceStatistics.absent} (
              {attendanceStatistics.percentageAbsent}%)
            </b>
          </p>
        </div>
      </div>

      <div className="attendance_actions-formatter">
        <h3 className="attendance_formatter-tittle">Formatação do CSV</h3>
        <div className="attendance_formatter-input_container">
          <label className="attendance_formatter-input_label">
            Nome da turma <small>* Obrigatório</small>
          </label>
          <input
            type="text"
            className={`attendance_formatter-input class-name_input ${
              highlightClassNameInput ? "warning-input" : ""
            }`}
            value={className}
            onChange={updateClassName}
          />
        </div>
        <div className="attendance_formatter-input_container">
          <label className="attendance_formatter-input_label">
            Formatação da presença
          </label>
          <input
            type="text"
            className="attendance_formatter-input"
            value={presentFormat}
            onChange={changePresentFormat}
          />
          <label className="attendance_formatter-input_hint">
            Saída padrão "." (ponto)
          </label>
        </div>
        <div className="attendance_formatter-input_container">
          <label className="attendance_formatter-input_label">
            Formatação da ausência
          </label>
          <input
            type="text"
            className="attendance_formatter-input"
            value={absentFormat}
            onChange={changeAbsentFormat}
          />
          <label className="attendance_formatter-input_hint">
            Saída padrão " " (espaço vazio)
          </label>
        </div>
      </div>

      <div className="attendance_actions-actions">
        <button
          className="attendance-actions_button"
          onClick={downloadAttendanceAsCSV}
        >
          Baixar CSV
        </button>
      </div>
    </div>
  );
}
