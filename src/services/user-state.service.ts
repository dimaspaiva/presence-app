import { mockUserList } from "../mocks/users.mock";
import { User } from "../types/User";

const userList: User[] = mockUserList

export function addUserToAttendance(user: User) {
  userList.push(user);
}

export function getUserList() {
  return userList;
}
