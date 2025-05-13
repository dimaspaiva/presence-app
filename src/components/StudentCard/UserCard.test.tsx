import { describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { StudentCard } from ".";
import { Student } from "../../types/Student";

describe("UserCard", () => {
  it("should render the UserCard component", () => {
    const mockUser: Student = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const { getByText, queryByText } = render(
      <StudentCard student={mockUser} applyStudentAttendance={vi.fn()} />
    );

    expect(getByText(mockUser.name)).toBeInTheDocument();
    expect(queryByText(mockUser.id)).toBeNull();
    expect(getByText(mockUser.number)).toBeInTheDocument();
    expect(getByText("Presente")).toBeInTheDocument();
    expect(getByText("Ausente")).toBeInTheDocument();
  });

  it("should call the callback function when the button 'presente' is clicked", () => {
    const mockUser: Student = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const mockCallback = vi.fn();

    const { getByText } = render(
      <StudentCard student={mockUser} applyStudentAttendance={mockCallback} />
    );

    const button = getByText("Presente");
    button.click();

    waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it("should call the callback function when the button 'ausente' is clicked", () => {
    const mockUser: Student = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const mockCallback = vi.fn();

    const { getByText } = render(
      <StudentCard student={mockUser} applyStudentAttendance={mockCallback} />
    );

    const button = getByText("Ausente");
    button.click();

    waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
