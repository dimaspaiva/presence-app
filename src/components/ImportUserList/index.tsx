import {
  buildUsersExampleCsvData,
  downloadCsvFile,
  parseCsvFile,
} from "../../services/csv.service";
import { User } from "../../types/User";
import "./styles.css";

export type ImportUserListProps = {
  setUserList: (userList: User[]) => void;
  setActiveCards: (userList: [string, string]) => void;
};

export function ImportUserList({
  setUserList,
  setActiveCards,
}: ImportUserListProps) {
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
    console.log(data);

    function buildUserId(): string {
      return `${Math.ceil(Math.random() * 10000)}-${Math.ceil(
        Math.random() * 10000
      )}-${Math.ceil(Math.random() * 10000)}`;
    }

    function parseDataToUser(data: unknown): User[] {
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

        const newUser: User = {
          id: buildUserId(),
          name: user["Nome"],
          number: Number(user["Número"]),
        };

        return newUser;
      });
    }

    const userList = parseDataToUser(data);
    setUserList(userList);
    setActiveCards([userList[1].id, userList[0].id]);
  }

  return (
    <div className="import-users_container card">
      <div className="import-users_header">
        <h2>Inserção da lista de usuários</h2>
      </div>
      <div className="import-users_body">
        <div className="import-users_item">
          <p>Importe usuários de um arquivo CSV</p>
          <input type="file" accept=".csv" onChange={readInputCsvFile} />
        </div>
        <p>
          Modelo de arquivo CSV pra download:
          <b onClick={downloadExampleCsv}>Clique aqui!</b>
        </p>
        <div className="import-users_item"></div>
      </div>
      <div className="import-users_actions">
        <button>Import</button>
      </div>
    </div>
  );
}
