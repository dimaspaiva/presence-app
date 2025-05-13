import {
  buildStudentsExampleCsvData,
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
    const data = buildStudentsExampleCsvData();
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

    function buildId(): string {
      return `${Math.ceil(Math.random() * 10000)}-${Math.ceil(
        Math.random() * 10000
      )}-${Math.ceil(Math.random() * 10000)}`;
    }

    function parseDataToStudent(data: unknown): Student[] {
      if (data === null || !Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      return data.map((student: unknown) => {
        if (typeof student !== "object" || student === null) {
          throw new Error("Invalid student data");
        }
        if (!("Número" in student) || !("Nome" in student)) {
          throw new Error("Invalid student data");
        }
        if (
          typeof student["Número"] !== "string" ||
          typeof student["Nome"] !== "string"
        ) {
          throw new Error("Invalid student data");
        }
        if (student["Número"].length === 0 || student["Nome"].length === 0) {
          throw new Error("Invalid student data");
        }

        const studentNumber = Number(student["Número"]);
        if (isNaN(studentNumber)) {
          throw new Error("Invalid student data, invalid student number");
        }

        const newStudent: Student = {
          id: buildId(),
          name: student["Nome"],
          number: Number(student["Número"]),
        };

        return newStudent;
      });
    }

    const studentList = parseDataToStudent(data);
    setStudentList(studentList);
    setActiveCards([studentList[1].id, studentList[0].id]);
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
