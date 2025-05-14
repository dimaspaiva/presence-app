import { ReturnIcon } from "../icons";

type RollbackButtonProps = {
  disabled: boolean;
  rollBackActiveCard: () => void;
};

export const RollbackButton = ({
  disabled,
  rollBackActiveCard,
}: RollbackButtonProps) => {
  return (
    <div className="rollback-container">
      <button
        className="rollback-button"
        onClick={rollBackActiveCard}
        disabled={disabled}
      >
        Voltar <ReturnIcon />
      </button>
    </div>
  );
};
