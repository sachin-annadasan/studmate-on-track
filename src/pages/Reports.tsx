import { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, Download, User, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { mockStudents, mockMonthlyAttendance, mockIATAttendance, mockSubjects } from '../data/mockData';
import { Department, AttendanceRecord, Student, Subject } from '../types';
import { cn } from '@/lib/utils';

const Reports = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const departments: (Department | 'ALL')[] = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  
  const filteredStudents = mockStudents.filter(student => 
    selectedDepartment === 'ALL' || student.department === selectedDepartment
  );

  const getDepartmentSubjects = () => {
    return selectedDepartment === 'ALL' 
      ? mockSubjects 
      : mockSubjects.filter(subject => subject.department === selectedDepartment);
  };

  const calculateOverallAttendance = (studentId: string, subjectId?: string) => {
    const monthlyRecords = mockMonthlyAttendance.filter(r => 
      r.studentId === studentId && (!subjectId || r.subjectId === subjectId)
    );
    const iatRecords = mockIATAttendance.filter(r => 
      r.studentId === studentId && (!subjectId || r.subjectId === subjectId)
    );
    
    const totalClasses = [...monthlyRecords, ...iatRecords].reduce((sum, record) => sum + (record.totalClasses || 0), 0);
    const attendedClasses = [...monthlyRecords, ...iatRecords].reduce((sum, record) => sum + (record.classesAttended || 0), 0);
    
    return totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  };

  const getStudentSubjectAttendance = (studentId: string) => {
    const student = mockStudents.find(s => s.id === studentId);
    if (!student) return [];
    
    return student.enrolledSubjects.map(subjectId => {
      const subject = mockSubjects.find(s => s.id === subjectId);
      const percentage = calculateOverallAttendance(studentId, subjectId);
      
      return {
        subject: subject?.name || 'Unknown',
        percentage,
        monthlyRecords: mockMonthlyAttendance.filter(r => r.studentId === studentId && r.subjectId === subjectId),
        iatRecords: mockIATAttendance.filter(r => r.studentId === studentId && r.subjectId === subjectId)
      };
    });
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
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="android-card bg-primary/5 border-primary/20">
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-primary">{filteredStudents.length}</p>
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          
          <Card className="android-card bg-success/5 border-success/20">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold text-success">{getDepartmentSubjects().length}</p>
              <p className="text-sm text-muted-foreground">Active Subjects</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="android-card">
          <CardContent className="p-4 space-y-3">
            <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department | 'ALL')}>
              <SelectTrigger>
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

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Subject (Optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {getDepartmentSubjects().map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Students Reports */}
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const overallPercentage = calculateOverallAttendance(student.id);
            const statusColor = overallPercentage >= 75 ? 'text-success' : overallPercentage >= 50 ? 'text-warning' : 'text-destructive';
            const subjectAttendance = getStudentSubjectAttendance(student.id);
            
            return (
              <Card key={student.id} className="android-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.id} • {student.department}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {student.enrolledSubjects.slice(0, 2).map(subjectId => {
                            const subject = mockSubjects.find(s => s.id === subjectId);
                            return (
                              <Badge key={subjectId} variant="outline" className="text-xs">
                                {subject?.name}
                              </Badge>
                            );
                          })}
                          {student.enrolledSubjects.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{student.enrolledSubjects.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${statusColor}`}>
                        {overallPercentage}%
                      </span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-2">
                            <User className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{student.name} - Detailed Report</DialogTitle>
                          </DialogHeader>
                          
                          <Tabs defaultValue="subjects" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="subjects">Subjects</TabsTrigger>
                              <TabsTrigger value="monthly">Monthly</TabsTrigger>
                              <TabsTrigger value="iat">IAT</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="subjects" className="space-y-3 mt-4">
                              <h3 className="font-semibold mb-3">Subject-wise Performance</h3>
                              {subjectAttendance.map(({ subject, percentage, monthlyRecords, iatRecords }) => {
                                const statusColor = percentage >= 75 ? 'text-success' : 
                                                  percentage >= 50 ? 'text-warning' : 'text-destructive';
                                
                                return (
                                  <Card key={subject} className="p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium">{subject}</h4>
                                      <span className={`font-bold ${statusColor}`}>
                                        {percentage}%
                                      </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground space-y-1">
                                      <p>Monthly: {monthlyRecords.length} months tracked</p>
                                      <p>IAT: {iatRecords.length} assessments completed</p>
                                      <p>Total Classes: {monthlyRecords.reduce((sum, r) => sum + (r.totalClasses || 0), 0) + iatRecords.reduce((sum, r) => sum + (r.totalClasses || 0), 0)}</p>
                                    </div>
                                  </Card>
                                );
                              })}
                            </TabsContent>
                            
                            <TabsContent value="monthly" className="space-y-3 mt-4">
                              <h3 className="font-semibold mb-3">Monthly Attendance by Subject</h3>
                              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map(month => {
                                const monthRecords = mockMonthlyAttendance.filter(
                                  r => r.studentId === student.id && r.month === month
                                );
                                
                                if (monthRecords.length === 0) return null;
                                
                                return (
                                  <Card key={month} className="p-3">
                                    <h4 className="font-medium mb-2">{month} 2024</h4>
                                    <div className="space-y-2">
                                      {monthRecords.map(record => {
                                        const subject = mockSubjects.find(s => s.id === record.subjectId);
                                        const statusColor = (record.percentage || 0) >= 75 ? 'text-success' : 
                                                          (record.percentage || 0) >= 50 ? 'text-warning' : 'text-destructive';
                                        
                                        return (
                                          <div key={record.id} className="flex items-center justify-between text-sm">
                                            <span>{subject?.name}</span>
                                            <div className="text-right">
                                              <span className={`font-bold ${statusColor}`}>
                                                {record.percentage}%
                                              </span>
                                              <p className="text-xs text-muted-foreground">
                                                {record.classesAttended}/{record.totalClasses}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </Card>
                                );
                              })}
                            </TabsContent>
                            
                            <TabsContent value="iat" className="space-y-3 mt-4">
                              <h3 className="font-semibold mb-3">IAT Performance by Subject</h3>
                              {['IAT 1', 'IAT 2'].map(iat => {
                                const iatRecords = mockIATAttendance.filter(
                                  r => r.studentId === student.id && r.iatType === iat
                                );
                                
                                if (iatRecords.length === 0) return null;
                                
                                return (
                                  <Card key={iat} className="p-3">
                                    <h4 className="font-medium mb-2">{iat}</h4>
                                    <p className="text-xs text-muted-foreground mb-2">
                                      {iat === 'IAT 1' ? 'Feb 25 - Mar 31' : 'Apr 1 - Apr 30'}
                                    </p>
                                    <div className="space-y-2">
                                      {iatRecords.map(record => {
                                        const subject = mockSubjects.find(s => s.id === record.subjectId);
                                        const statusColor = (record.percentage || 0) >= 75 ? 'text-success' : 
                                                          (record.percentage || 0) >= 50 ? 'text-warning' : 'text-destructive';
                                        
                                        return (
                                          <div key={record.id} className="flex items-center justify-between text-sm">
                                            <span>{subject?.name}</span>
                                            <div className="text-right">
                                              <span className={`font-bold ${statusColor}`}>
                                                {record.percentage}%
                                              </span>
                                              <p className="text-xs text-muted-foreground">
                                                {record.classesAttended}/{record.totalClasses}
                                              </p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </Card>
                                );
                              })}
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
                    </div>
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