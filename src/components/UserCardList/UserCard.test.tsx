import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UserList } from "./index";

describe("UserCard", () => {
  it("should render user list properly", () => {
    const expectedUserCardLength = 2;

    render(<UserList />);

    expect(screen.queryAllByTestId("user-card")).toHaveLength(
      expectedUserCardLength
    );
    expect(screen.getByText("Lista de Presença")).toBeInTheDocument();
    expect(screen.getByText("Voltar <")).toBeDisabled();
  });

  it("should enable rollback button when user card is not the first", () => {
    render(<UserList />);

    const [presentButton] = screen.getAllByText("Presente");
    fireEvent.click(presentButton);
    waitFor(() => {
      expect(screen.getAllByText("Voltar <")).toBeEnabled();
    });
  });
});
