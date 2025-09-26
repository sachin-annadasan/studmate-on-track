export interface Student {
  id: string;
  name: string;
  department: Department;
  year: Year;
  section: Section;
  enrolledSubjects: string[]; // Subject IDs the student is enrolled in
}

export interface Subject {
  id: string;
  name: string;
  department: Department;
  totalSessions: number;
}

export interface Session {
  id: string;
  subjectId: string;
  name: string;
  period: number;
  date: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  sessionId?: string;
  subjectId: string; // Required for subject-wise tracking
  date: Date;
  status: AttendanceStatus;
  month?: string;
  iatType?: IATType;
  totalClasses?: number;
  classesAttended?: number;
  percentage?: number;
}

export interface IATRecord {
  id: string;
  type: IATType;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export type Department = 'CSE' | 'ECE' | 'MECH' | 'IT' | 'CIVIL';
export type Year = '1st Year' | '2nd Year' | '3rd Year';
export type Section = 'A' | 'B' | 'C';
export type AttendanceStatus = 'Present' | 'Absent' | 'On Duty';
export type IATType = 'IAT 1' | 'IAT 2' | 'IAT 3';

export interface DashboardStats {
  totalStudents: number;
  totalSubjects: number;
  totalSessions: number;
  todayAttendance: {
    present: number;
    absent: number;
    onDuty: number;
  };
}