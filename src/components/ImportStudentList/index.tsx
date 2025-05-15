import {
  buildStudentsExampleCsvData,
  downloadCsvFile,
  parseCsvFile,
} from "../../services/csv.service";
import { Student } from "../../types/Student";
import { generateId } from "../../utils/stringUtils";

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

    function parseDataToStudent(data: unknown): Student[] {
      if (data === null || !Array.isArray(data)) {
        throw new Error("Invalid data format");
      }

      return data.map((student: unknown) => {
        if (typeof student !== "object" || student === null) {
          throw new Error(
            "Invalid student data, type of student is not an object"
          );
        }
        if (!("numero" in student) || !("nome" in student)) {
          throw new Error("Invalid student data, wrong column name");
        }
        if (
          typeof student["numero"] !== "string" ||
          typeof student["nome"] !== "string"
        ) {
          throw new Error("Invalid student data, header is not of type string");
        }
        if (student["numero"].length === 0 || student["nome"].length === 0) {
          throw new Error("Invalid student data, missing values");
        }

        const studentNumber = Number(student["numero"]);
        if (isNaN(studentNumber)) {
          throw new Error("Invalid student data, invalid student number");
        }

        const newStudent: Student = {
          id: generateId(),
          name: student["nome"],
          number: Number(student["numero"]),
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
