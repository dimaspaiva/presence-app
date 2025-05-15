import {
  SetActiveCards,
  SetStudentList,
  useImportStudentList,
} from "./useImportStudentList";

import "./styles.css";

export type ImportStudentListProps = {
  setStudentList: SetStudentList;
  setActiveCards: SetActiveCards;
};

export function ImportStudentList({
  setStudentList,
  setActiveCards,
}: ImportStudentListProps) {
  const { readInputCsvFile, downloadExampleCsv } = useImportStudentList(
    setStudentList,
    setActiveCards
  );

  return (
    <div className="student-list_container">
      <h1 className="student-list_title">Lista de Presença</h1>
      <div className="import-student_container card">
        <div className="import-student_header">
          <h2>Inserção da lista de usuários</h2>
        </div>
        <div className="import-student_body">
          <div className="import-student_item">
            <p className="import-student_item_text">
              Importe usuários de um arquivo CSV
            </p>
            <input
              className="import-student_item_input"
              type="file"
              accept=".csv"
              onChange={readInputCsvFile}
            />
          </div>
          <p className="import-student_example-text">
            Modelo de arquivo CSV pra download:
            <br />
            <b onClick={downloadExampleCsv}>Clique aqui!</b>
          </p>
        </div>
        <div className="import-student_actions">
          <button className="import-student_button">Import</button>
        </div>
      </div>
    </div>
  );
}
