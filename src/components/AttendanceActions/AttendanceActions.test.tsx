import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AttendanceActions } from ".";
import { useAttendance } from "../../services/attendance-state.service";
import { AttendanceContext } from "../../context/attendance.context";
import * as csvService from "../../services/csv.service";

const AttendanceActionsWithAttendanceContext = () => {
  const attendanceState = useAttendance();

  return (
    <AttendanceContext.Provider value={attendanceState}>
      <AttendanceActions />
    </AttendanceContext.Provider>
  );
};

describe("AttendanceActions", () => {
  it("should render the component", () => {
    render(<AttendanceActionsWithAttendanceContext />);

    expect(screen.getByText("Lista finalizada!")).toBeInTheDocument();
    expect(screen.getByText("Total de alunos:")).toBeInTheDocument();
    expect(screen.getByText("Total de presentes:")).toBeInTheDocument();
    expect(screen.getByText("Total de ausentes:")).toBeInTheDocument();

    expect(screen.getByText("Formatação do CSV")).toBeInTheDocument();
    expect(screen.getByText("Formatação da presença")).toBeInTheDocument();
    expect(screen.getByText("Formatação da ausência")).toBeInTheDocument();
    expect(screen.getByText('Saída padrão "." (ponto)')).toBeInTheDocument();
    expect(
      screen.getByText('Saída padrão " " (espaço vazio)')
    ).toBeInTheDocument();
    expect(screen.getByText("Baixar CSV")).toBeEnabled();
  });

  it("should call mapAttendanceToCSV when the button is clicked", () => {
    const spyMapAttendanceDataToCsvString = vi.spyOn(
      csvService,
      "mapAttendanceDataToCsvString"
    );
    const spyDownloadCsvFile = vi.spyOn(csvService, "downloadCsvFile");
    spyDownloadCsvFile.mockImplementationOnce(vi.fn());

    render(<AttendanceActionsWithAttendanceContext />);

    const downloadCsvButton = screen.getByText("Baixar CSV");
    fireEvent.click(downloadCsvButton);

    expect(spyMapAttendanceDataToCsvString).toHaveBeenCalledWith([], ".", "");
    expect(spyDownloadCsvFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String)
    );
  });
});
