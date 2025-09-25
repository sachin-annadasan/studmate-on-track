import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { mockStudents } from '../data/mockData';
import { Student, Department, Year, Section } from '../types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const StudentsModule = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  
  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentDepartment, setStudentDepartment] = useState<Department>('CSE');
  const [studentYear, setStudentYear] = useState<Year>('1st Year');
  const [studentSection, setStudentSection] = useState<Section>('A');
  
  const departments: (Department | 'ALL')[] = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  const years: Year[] = ['1st Year', '2nd Year', '3rd Year'];
  const sections: Section[] = ['A', 'B', 'C'];
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'ALL' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });
  
  const handleAddStudent = () => {
    if (!studentName.trim()) {
      toast({
        title: "Error",
        description: "Student name is required",
        variant: "destructive"
      });
      return;
    }

    const newStudent: Student = {
      id: `S${(students.length + 1).toString().padStart(3, '0')}`,
      name: studentName.trim(),
      department: studentDepartment,
      year: studentYear,
      section: studentSection
    };

    setStudents([...students, newStudent]);
    
    toast({
      title: "Success",
      description: "Student added successfully"
    });

    resetForm();
    setShowAddForm(false);
  };

  const handleEditStudent = () => {
    if (!editingStudent || !studentName.trim()) {
      toast({
        title: "Error", 
        description: "Student name is required",
        variant: "destructive"
      });
      return;
    }

    const updatedStudent: Student = {
      ...editingStudent,
      name: studentName.trim(),
      department: studentDepartment,
      year: studentYear,
      section: studentSection
    };

    setStudents(students.map(s => s.id === editingStudent.id ? updatedStudent : s));
    
    toast({
      title: "Success",
      description: "Student updated successfully"
    });

    resetForm();
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter(s => s.id !== studentId));
    toast({
      title: "Success", 
      description: "Student deleted successfully"
    });
  };

  const resetForm = () => {
    setStudentName('');
    setStudentDepartment('CSE');
    setStudentYear('1st Year');
    setStudentSection('A');
  };

  const openEditForm = (student: Student) => {
    setStudentName(student.name);
    setStudentDepartment(student.department);
    setStudentYear(student.year);
    setStudentSection(student.section);
    setEditingStudent(student);
  };

  const getDepartmentColor = (department: Department) => {
    const colors = {
      CSE: 'bg-blue-100 text-blue-800',
      ECE: 'bg-green-100 text-green-800',
      MECH: 'bg-orange-100 text-orange-800',
      IT: 'bg-purple-100 text-purple-800',
      CIVIL: 'bg-red-100 text-red-800'
    };
    return colors[department];
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="android-card bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-primary">{filteredStudents.length}</p>
            </div>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button 
                  className="fab relative bottom-0 right-0 position-static"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />

                  <Select value={studentDepartment} onValueChange={(value) => setStudentDepartment(value as Department)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter(d => d !== 'ALL').map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={studentYear} onValueChange={(value) => setStudentYear(value as Year)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={studentSection} onValueChange={(value) => setStudentSection(value as Section)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddStudent} className="flex-1">
                      Add Student
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filter */}
      <Card className="android-card">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department | 'ALL')}>
            <SelectTrigger className="w-full">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by Department" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept === 'ALL' ? 'All Departments' : dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {/* Students List */}
      <div className="space-y-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="android-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn("text-xs", getDepartmentColor(student.department))}>
                      {student.department}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {student.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Section {student.section}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog open={viewingStudent?.id === student.id} onOpenChange={(open) => !open && setViewingStudent(null)}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => setViewingStudent(student)}
                      >
                        <Eye className="h-4 w-4 text-primary" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                      </DialogHeader>
                      {viewingStudent && (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Student ID</label>
                            <p className="text-lg font-semibold">{viewingStudent.id}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <p className="text-lg font-semibold">{viewingStudent.name}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Department</label>
                            <p className="text-lg font-semibold">{viewingStudent.department}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Year</label>
                            <p className="text-lg font-semibold">{viewingStudent.year}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Section</label>
                            <p className="text-lg font-semibold">Section {viewingStudent.section}</p>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => openEditForm(student)}
                  >
                    <Edit className="h-4 w-4 text-warning" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDeleteStudent(student.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={!!editingStudent} onOpenChange={(open) => !open && setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Student Name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
            />

            <Select value={studentDepartment} onValueChange={(value) => setStudentDepartment(value as Department)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.filter(d => d !== 'ALL').map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={studentYear} onValueChange={(value) => setStudentYear(value as Year)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={studentSection} onValueChange={(value) => setStudentSection(value as Section)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section} value={section}>
                    Section {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button onClick={handleEditStudent} className="flex-1">
                Update Student
              </Button>
              <Button variant="outline" onClick={() => setEditingStudent(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {filteredStudents.length === 0 && (
        <Card className="android-card">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No students found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};