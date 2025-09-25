import { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Eye, FileText, Download, Filter } from 'lucide-react';
import { mockStudents, mockMonthlyAttendance, mockIATAttendance } from '../data/mockData';
import { Department, Student } from '../types';
import { cn } from '@/lib/utils';

const Reports = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  
  const departments: (Department | 'ALL')[] = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  
  const filteredStudents = mockStudents.filter(student => 
    selectedDepartment === 'ALL' || student.department === selectedDepartment
  );

  const getStudentAttendance = (studentId: string) => {
    const monthly = mockMonthlyAttendance.filter(record => record.studentId === studentId);
    const iat = mockIATAttendance.filter(record => record.studentId === studentId);
    
    const overallPercentage = monthly.length > 0 
      ? Math.round(monthly.reduce((sum, record) => sum + (record.percentage || 0), 0) / monthly.length)
      : 0;
    
    return { monthly, iat, overallPercentage };
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

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <MobileLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Filter */}
        <Card className="android-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department | 'ALL')}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept === 'ALL' ? 'All Departments' : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students Reports */}
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const attendance = getStudentAttendance(student.id);
            return (
              <Card key={student.id} className="android-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-semibold text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-2">
                        <Badge className={cn("text-xs", getDepartmentColor(student.department))}>
                          {student.department}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {student.year}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Overall</span>
                            <span className={cn("text-xs font-semibold", getPerformanceColor(attendance.overallPercentage))}>
                              {attendance.overallPercentage}%
                            </span>
                          </div>
                          <Progress value={attendance.overallPercentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
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
                      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detailed Report - {student.name}</DialogTitle>
                        </DialogHeader>
                        {viewingStudent && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Student Information</h4>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="text-muted-foreground">ID:</span>
                                  <p className="font-medium">{viewingStudent.id}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Department:</span>
                                  <p className="font-medium">{viewingStudent.department}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Year:</span>
                                  <p className="font-medium">{viewingStudent.year}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Section:</span>
                                  <p className="font-medium">{viewingStudent.section}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">Monthly Attendance</h4>
                              <div className="space-y-2">
                                {attendance.monthly.map((record) => (
                                  <div key={record.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                    <span className="text-sm font-medium">{record.month}</span>
                                    <div className="text-right">
                                      <span className={cn("text-sm font-semibold", getPerformanceColor(record.percentage || 0))}>
                                        {record.percentage}%
                                      </span>
                                      <p className="text-xs text-muted-foreground">
                                        {record.classesAttended}/{record.totalClasses}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="font-medium">IAT Performance</h4>
                              <div className="space-y-2">
                                {attendance.iat.map((record) => (
                                  <div key={record.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                    <span className="text-sm font-medium">{record.iatType}</span>
                                    <div className="text-right">
                                      <span className={cn("text-sm font-semibold", getPerformanceColor(record.percentage || 0))}>
                                        {record.percentage}%
                                      </span>
                                      <p className="text-xs text-muted-foreground">
                                        {record.classesAttended}/{record.totalClasses}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Reports;