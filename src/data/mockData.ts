import { Student, Subject, AttendanceRecord, IATRecord, Department, Year, Section, AttendanceStatus, IATType } from '../types';

// Indian names for realistic student data
const indianNames = [
  'Aadhya Sharma', 'Aarav Patel', 'Abhinav Kumar', 'Aditi Singh', 'Aditya Gupta',
  'Akash Reddy', 'Akshara Nair', 'Amit Verma', 'Ananya Iyer', 'Ankit Joshi',
  'Anushka Rao', 'Arjun Mehta', 'Arya Pandey', 'Bhavya Agarwal', 'Chaitanya Das',
  'Deepika Malhotra', 'Dev Kapoor', 'Diya Mishra', 'Gaurav Chauhan', 'Harsh Sinha',
  'Ishaan Tiwari', 'Isha Bansal', 'Kabir Saxena', 'Kavya Jain', 'Kiran Bhat',
  'Krish Kulkarni', 'Lakshmi Pillai', 'Manish Goyal', 'Maya Desai', 'Mohit Shah',
  'Naina Varma', 'Naman Shukla', 'Navya Ghosh', 'Neha Arora', 'Neil Khanna',
  'Nikita Roy', 'Nikhil Dutta', 'Pooja Bhardwaj', 'Pranav Mittal', 'Priya Choudhury',
  'Rahul Thakur', 'Ravi Prasad', 'Rhea Sood', 'Rishi Ahluwalia', 'Rohan Sethi',
  'Sachin Yadav', 'Sahil Aggarwal', 'Shreya Khurana', 'Shubham Bajaj', 'Sneha Wadhwa',
  'Tanvi Bose', 'Tarun Mallik', 'Tisha Chopra', 'Varun Srivastava', 'Vedika Kohli',
  'Vikram Pandya', 'Vinay Sharma', 'Yash Gupta', 'Zara Khan', 'Zoya Merchant'
];

const departments: Department[] = ['CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
const years: Year[] = ['1st Year', '2nd Year', '3rd Year'];
const sections: Section[] = ['A', 'B', 'C'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Generate 60 students with subject enrollments
export const mockStudents: Student[] = Array.from({ length: 60 }, (_, index) => {
  const department = departments[Math.floor(Math.random() * departments.length)];
  const year = years[Math.floor(Math.random() * years.length)];
  const section = sections[Math.floor(Math.random() * sections.length)];
  
  return {
    id: `S${(index + 1).toString().padStart(3, '0')}`,
    name: indianNames[index],
    department,
    year,
    section,
    enrolledSubjects: mockSubjects
      .filter(subject => subject.department === department)
      .map(subject => subject.id)
  };
});

// Preload subjects
export const mockSubjects: Subject[] = [
  { id: 'SUB001', name: 'MERN Stack', department: 'CSE', totalSessions: 0 },
  { id: 'SUB002', name: 'MCA', department: 'IT', totalSessions: 0 },
  { id: 'SUB003', name: 'Data Structures', department: 'CSE', totalSessions: 0 },
  { id: 'SUB004', name: 'Digital Electronics', department: 'ECE', totalSessions: 0 },
  { id: 'SUB005', name: 'Machine Design', department: 'MECH', totalSessions: 0 },
  { id: 'SUB006', name: 'Structural Analysis', department: 'CIVIL', totalSessions: 0 }
];

// Generate monthly attendance records for all students per subject
export const generateMonthlyAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  
  mockStudents.forEach(student => {
    student.enrolledSubjects.forEach(subjectId => {
      months.forEach(month => {
        const totalClasses = Math.floor(Math.random() * 8) + 18; // 18-25 classes
        const classesAttended = Math.floor(Math.random() * (totalClasses - Math.floor(totalClasses / 2))) + Math.floor(totalClasses / 2);
        const percentage = Math.round((classesAttended / totalClasses) * 100);
        
        records.push({
          id: `ATT_${student.id}_${subjectId}_${month}`,
          studentId: student.id,
          subjectId,
          date: new Date(2024, months.indexOf(month), 15),
          status: percentage >= 75 ? 'Present' : percentage >= 50 ? 'On Duty' : 'Absent',
          month,
          totalClasses,
          classesAttended,
          percentage
        });
      });
    });
  });
  
  return records;
};

// Generate IAT attendance records per subject
export const generateIATAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const iatTypes: IATType[] = ['IAT 1', 'IAT 2'];
  
  mockStudents.forEach(student => {
    student.enrolledSubjects.forEach(subjectId => {
      iatTypes.forEach(iatType => {
        const totalClasses = Math.floor(Math.random() * 5) + 8; // 8-12 classes for IAT
        const classesAttended = Math.floor(Math.random() * (totalClasses - 2)) + 2;
        const percentage = Math.round((classesAttended / totalClasses) * 100);
        
        records.push({
          id: `IAT_${student.id}_${subjectId}_${iatType.replace(' ', '')}`,
          studentId: student.id,
          subjectId,
          date: new Date(2024, iatType === 'IAT 1' ? 2 : 3, 15),
          status: percentage >= 75 ? 'Present' : percentage >= 50 ? 'On Duty' : 'Absent',
          iatType,
          totalClasses,
          classesAttended,
          percentage
        });
      });
    });
  });
  
  return records;
};

// IAT Records with date ranges
export const mockIATRecords: IATRecord[] = [
  {
    id: 'IAT_REC_1',
    type: 'IAT 1',
    startDate: new Date(2024, 1, 25), // Feb 25
    endDate: new Date(2024, 2, 31),   // Mar 31
    isActive: false
  },
  {
    id: 'IAT_REC_2',
    type: 'IAT 2',
    startDate: new Date(2024, 3, 1),  // Apr 1
    endDate: new Date(2024, 3, 30),   // Apr 30
    isActive: false
  },
  {
    id: 'IAT_REC_3',
    type: 'IAT 3',
    startDate: new Date(2024, 4, 1),  // May 1
    endDate: new Date(2024, 4, 31),   // May 31
    isActive: true
  }
];

export const mockMonthlyAttendance = generateMonthlyAttendance();
export const mockIATAttendance = generateIATAttendance();