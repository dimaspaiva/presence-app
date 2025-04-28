import { describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { UserCard } from ".";
import { User } from "../../types/User";

describe("UserCard", () => {
  it("should render the UserCard component", () => {
    const mockUser: User = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const { getByText, queryByText } = render(
      <UserCard user={mockUser} applyUserAttendance={vi.fn()} />
    );

    expect(getByText(mockUser.name)).toBeInTheDocument();
    expect(queryByText(mockUser.id)).toBeNull();
    expect(getByText(mockUser.number)).toBeInTheDocument();
    expect(getByText("Presente")).toBeInTheDocument();
    expect(getByText("Ausente")).toBeInTheDocument();
  });

  it("should call the callback function when the button 'presente' is clicked", () => {
    const mockUser: User = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const mockCallback = vi.fn();

    const { getByText } = render(
      <UserCard user={mockUser} callback={mockCallback} />
    );

    const button = getByText("Presente");
    button.click();

    waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });

  it("should call the callback function when the button 'ausente' is clicked", () => {
    const mockUser: User = {
      id: "random-id",
      name: "John Doe",
      number: 1,
    };

    const mockCallback = vi.fn();

    const { getByText } = render(
      <UserCard user={mockUser} callback={mockCallback} />
    );

    const button = getByText("Ausente");
    button.click();

    waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
