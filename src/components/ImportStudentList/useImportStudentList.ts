import { buildStudentsExampleCsvData, downloadCsvFile, parseCsvFile } from "../../services/csv.service";
import { Student } from "../../types/Student";
import { generateId } from "../../utils/stringUtils";

enum StudentKeysEnum {
  NAME = 'nome',
  NUMBER = 'numero',
}

export type SetStudentList = (student: Student[]) => void;
export type SetActiveCards = (student: [string, string]) => void;

export function useImportStudentList(setStudentList: SetStudentList, setActiveCards: SetActiveCards) {
  async function readInputCsvFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const data = await parseCsvFile(file);

    const studentList = parseDataToStudent(data);
    setStudentList(studentList);
    setActiveCards([studentList[1].id, studentList[0].id]);
  }

  function parseDataToStudent(data: unknown): Student[] {
    if (data === null || !Array.isArray(data)) {
      throw new Error("Invalid data format");
    }

    return data.map(parseStudent)
  }

  function parseStudent(data: unknown): Student {
    if (typeof data !== "object" || data === null) {
      throw new Error(
        "Invalid student data, type of student is not an object"
      );
    }
    if (!(StudentKeysEnum.NUMBER in data) || !(StudentKeysEnum.NAME in data)) {
      throw new Error("Invalid student data, wrong column name");
    }
    if (
      typeof data[StudentKeysEnum.NUMBER] !== "string" ||
      typeof data[StudentKeysEnum.NAME] !== "string"
    ) {
      throw new Error("Invalid student data, header is not of type string");
    }
    if (data[StudentKeysEnum.NUMBER].length === 0 || data[StudentKeysEnum.NAME].length === 0) {
      throw new Error("Invalid student data, missing values");
    }

    const studentNumber = Number(data[StudentKeysEnum.NUMBER]);
    if (isNaN(studentNumber)) {
      throw new Error("Invalid student data, invalid student number");
    }

    const newStudent: Student = {
      id: generateId(),
      name: data[StudentKeysEnum.NAME],
      number: Number(data[StudentKeysEnum.NUMBER]),
    };

    return newStudent;
  }

  function downloadExampleCsv() {
    const data = buildStudentsExampleCsvData();
    const fileName = "exemplo_lista_de_alunos.csv";

    downloadCsvFile(data, fileName);
  }


  return { downloadExampleCsv, readInputCsvFile }
}
