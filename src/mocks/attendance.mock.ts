import { Attendance } from "../types/Attendance";

export const mockedAttendance: Attendance = [
  { id: '1', name: 'João Silva', isPresent: Math.random() > 0.5, number: 1 },
  { id: '2', name: 'Maria Oliveira', isPresent: Math.random() > 0.5, number: 2 },
  { id: '3', name: 'Pedro Santos', isPresent: Math.random() > 0.5, number: 3 },
  { id: '4', name: 'Ana Souza', isPresent: Math.random() > 0.5, number: 4 },
  { id: '5', name: 'Carlos Pereira', isPresent: Math.random() > 0.5, number: 5 },
];
