import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { StudentList } from "./index";

describe("StudentList", () => {
  it("should render student list properly", () => {
    const expectedStudentCardLength = 2;

    render(<StudentList />);

    expect(screen.queryAllByTestId("student-card")).toHaveLength(
      expectedStudentCardLength
    );
    expect(screen.getByText("Lista de Presença")).toBeInTheDocument();
    expect(screen.getByText("Voltar <")).toBeDisabled();
  });

  it("should enable rollback button when student card is not the first", () => {
    render(<StudentList />);

    const [presentButton] = screen.getAllByText("Presente");
    fireEvent.click(presentButton);
    waitFor(() => {
      expect(screen.getAllByText("Voltar <")).toBeEnabled();
    });
  });
});
