import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar as CalendarIcon, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { mockMonthlyAttendance, mockIATAttendance, mockStudents, mockIATRecords } from '../data/mockData';
import { AttendanceRecord, AttendanceStatus, Department, IATType, Student } from '../types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const AttendanceModule = () => {
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [selectedIAT, setSelectedIAT] = useState('IAT 1');
  const [showTakeAttendance, setShowTakeAttendance] = useState(false);
  const [showIATManager, setShowIATManager] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState<Date>();
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('CSE');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: AttendanceStatus}>({});
  const [iATRecords, setIATRecords] = useState(mockIATRecords);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const iats = ['IAT 1', 'IAT 2', 'IAT 3'];
  const departments: Department[] = ['CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  
  const getDepartmentStudents = () => {
    return mockStudents.filter(student => student.department === selectedDepartment);
  };

  const handleTakeAttendance = () => {
    if (!attendanceDate) {
      toast({
        title: "Error", 
        description: "Please select a date",
        variant: "destructive"
      });
      return;
    }

    const students = getDepartmentStudents();
    const presentCount = Object.values(attendanceData).filter(status => status === 'Present').length;
    
    toast({
      title: "Success",
      description: `Attendance taken for ${students.length} students. ${presentCount} present.`
    });

    setAttendanceData({});
    setShowTakeAttendance(false);
  };

  const handleAttendanceChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const updateIATDates = (iatType: IATType, startDate: Date, endDate: Date) => {
    setIATRecords(prev => prev.map(record => 
      record.type === iatType 
        ? { ...record, startDate, endDate, isActive: true }
        : { ...record, isActive: false }
    ));
    
    toast({
      title: "Success",
      description: `${iatType} dates updated successfully`
    });
  };

  const getMonthlyData = () => {
    return mockMonthlyAttendance.filter(record => record.month === selectedMonth);
  };
  
  const getIATData = () => {
    return mockIATAttendance.filter(record => record.iatType === selectedIAT);
  };
  
  const getStatusIcon = (status: string, percentage?: number) => {
    if (percentage && percentage >= 75) {
      return <CheckCircle className="h-4 w-4 text-success" />;
    } else if (percentage && percentage >= 50) {
      return <AlertCircle className="h-4 w-4 text-warning" />;
    } else {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }
  };
  
  const getStatusColor = (percentage?: number) => {
    if (percentage && percentage >= 75) return 'text-success';
    if (percentage && percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const AttendanceCard = ({ record }: { record: AttendanceRecord }) => {
    const student = mockStudents.find(s => s.id === record.studentId);
    if (!student) return null;

    return (
      <Card key={record.id} className="android-card">
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
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                {getStatusIcon(record.status, record.percentage)}
                <span className={`font-bold ${getStatusColor(record.percentage)}`}>
                  {record.percentage}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {record.classesAttended}/{record.totalClasses}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="android-card bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Dialog open={showTakeAttendance} onOpenChange={setShowTakeAttendance}>
              <DialogTrigger asChild>
                <Button className="flex flex-col items-center space-y-2 h-16">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Take Attendance</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Take Attendance</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {attendanceDate ? format(attendanceDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={attendanceDate}
                        onSelect={setAttendanceDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <h3 className="font-medium">Students ({selectedDepartment})</h3>
                    {getDepartmentStudents().map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.id}</p>
                        </div>
                        <div className="flex space-x-1">
                          {(['Present', 'Absent', 'On Duty'] as AttendanceStatus[]).map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={attendanceData[student.id] === status ? "default" : "outline"}
                              onClick={() => handleAttendanceChange(student.id, status)}
                              className="text-xs px-2 py-1"
                            >
                              {status === 'On Duty' ? 'OD' : status}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleTakeAttendance} className="flex-1">
                      Submit Attendance
                    </Button>
                    <Button variant="outline" onClick={() => setShowTakeAttendance(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={showIATManager} onOpenChange={setShowIATManager}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex flex-col items-center space-y-2 h-16">
                  <CalendarIcon className="h-5 w-5" />
                  <span className="text-sm">Manage IAT</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Manage IAT Dates</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {iATRecords.map((iat) => (
                    <Card key={iat.id} className={cn("p-4", iat.isActive && "border-primary bg-primary/5")}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{iat.type}</h3>
                          {iat.isActive && <Badge>Active</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format(iat.startDate, "MMM dd")} - {format(iat.endDate, "MMM dd, yyyy")}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => updateIATDates(iat.type, iat.startDate, iat.endDate)}
                          disabled={iat.isActive}
                        >
                          {iat.isActive ? 'Currently Active' : 'Activate'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Card className="android-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span>Attendance Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="iat">IAT Based</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly" className="px-4 pb-4">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {months.map((month) => (
                    <Button
                      key={month}
                      variant={selectedMonth === month ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMonth(month)}
                    >
                      {month}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getMonthlyData().slice(0, 10).map((record) => (
                    <AttendanceCard key={record.id} record={record} />
                  ))}
                </div>
                
                {getMonthlyData().length > 10 && (
                  <Button variant="outline" className="w-full">
                    Load More ({getMonthlyData().length - 10} remaining)
                  </Button>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="iat" className="px-4 pb-4">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {iats.map((iat) => (
                    <Button
                      key={iat}
                      variant={selectedIAT === iat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedIAT(iat)}
                      disabled={iat === 'IAT 3'}
                    >
                      {iat}
                      {iat === 'IAT 3' && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Active
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getIATData().slice(0, 10).map((record) => (
                    <AttendanceCard key={record.id} record={record} />
                  ))}
                </div>
                
                {selectedIAT === 'IAT 3' && (
                  <Card className="android-card border-primary/20 bg-primary/5">
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                      <p className="text-primary font-semibold">IAT 3 is Currently Active</p>
                      <p className="text-sm text-muted-foreground mb-3">May 1 - May 31, 2024</p>
                      <Button className="w-full">
                        Mark IAT 3 Attendance
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};