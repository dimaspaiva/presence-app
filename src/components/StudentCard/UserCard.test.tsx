import { describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { StudentCard } from ".";
import { Student } from "../../types/Student";

describe("StudentCard", () => {
  it("should render the StudentCard component", () => {
    const mockStudent: Student = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const { getByText, queryByText } = render(
      <StudentCard student={mockStudent} applyStudentAttendance={vi.fn()} />
    );

    expect(getByText(mockStudent.name)).toBeInTheDocument();
    expect(queryByText(mockStudent.id)).toBeNull();
    expect(getByText(mockStudent.number)).toBeInTheDocument();
    expect(getByText("Presente")).toBeInTheDocument();
    expect(getByText("Ausente")).toBeInTheDocument();
  });

  it("should call the callback function when the button 'presente' is clicked", () => {
    const mockStudent: Student = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const mockCallback = vi.fn();

    const { getByText } = render(
      <StudentCard
        student={mockStudent}
        applyStudentAttendance={mockCallback}
      />
    );

    const button = getByText("Presente");
    button.click();

    waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it("should call the callback function when the button 'ausente' is clicked", () => {
    const mockStudent: Student = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const mockCallback = vi.fn();

    const { getByText } = render(
      <StudentCard
        student={mockStudent}
        applyStudentAttendance={mockCallback}
      />
    );

    const button = getByText("Ausente");
    button.click();

    waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
