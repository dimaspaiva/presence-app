import { mockUserList } from "../mocks/users.mock";
import { Student } from "../types/Student";

const userList: Student[] = mockUserList

export function addUserToAttendance(user: Student) {
  userList.push(user);
}

export function getUserList() {
  return userList;
}
