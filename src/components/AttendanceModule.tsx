import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { mockMonthlyAttendance, mockIATAttendance, mockStudents } from '../data/mockData';
import { AttendanceRecord } from '../types';

export const AttendanceModule = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [selectedIAT, setSelectedIAT] = useState('IAT 1');
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const iats = ['IAT 1', 'IAT 2', 'IAT 3'];
  
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
            <Button className="flex flex-col items-center space-y-2 h-16">
              <Users className="h-5 w-5" />
              <span className="text-sm">Take Attendance</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center space-y-2 h-16">
              <Calendar className="h-5 w-5" />
              <span className="text-sm">View Calendar</span>
            </Button>
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