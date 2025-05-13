import {
  buildUsersExampleCsvData,
  downloadCsvFile,
  parseCsvFile,
} from "../../services/csv.service";
import { Student } from "../../types/Student";
import "./styles.css";

export type ImportStudentListProps = {
  setStudentList: (student: Student[]) => void;
  setActiveCards: (student: [string, string]) => void;
};

export function ImportStudentList({
  setStudentList,
  setActiveCards,
}: ImportStudentListProps) {
  function downloadExampleCsv() {
    const data = buildUsersExampleCsvData();
    const fileName = "exemplo_lista_de_alunos.csv";

    downloadCsvFile(data, fileName);
  }

  async function readInputCsvFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const data = await parseCsvFile(file);

    function buildUserId(): string {
      return `${Math.ceil(Math.random() * 10000)}-${Math.ceil(
        Math.random() * 10000
      )}-${Math.ceil(Math.random() * 10000)}`;
    }

    function parseDataToUser(data: unknown): Student[] {
      if (data === null || !Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      return data.map((user: unknown) => {
        if (typeof user !== "object" || user === null) {
          throw new Error("Invalid user data");
        }
        if (!("Número" in user) || !("Nome" in user)) {
          throw new Error("Invalid user data");
        }
        if (
          typeof user["Número"] !== "string" ||
          typeof user["Nome"] !== "string"
        ) {
          throw new Error("Invalid user data");
        }
        if (user["Número"].length === 0 || user["Nome"].length === 0) {
          throw new Error("Invalid user data");
        }

        const userNumber = Number(user["Número"]);
        if (isNaN(userNumber)) {
          throw new Error("Invalid user data, invalid user number");
        }

        const newUser: Student = {
          id: buildUserId(),
          name: user["Nome"],
          number: Number(user["Número"]),
        };

        return newUser;
      });
    }

    const userList = parseDataToUser(data);
    setStudentList(userList);
    setActiveCards([userList[1].id, userList[0].id]);
  }

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
