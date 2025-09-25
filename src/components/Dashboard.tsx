import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Users, BookOpen, Calendar, UserCheck, UserX, Clock, Plus } from 'lucide-react';
import { mockStudents, mockSubjects, mockMonthlyAttendance, mockIATRecords } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  
  // Calculate dashboard stats
  const totalStudents = mockStudents.length;
  const totalSubjects = mockSubjects.length;
  const totalSessions = 45; // Mock data
  
  // Today's attendance summary (mock data)
  const todayAttendance = {
    present: 42,
    absent: 8,
    onDuty: 10
  };
  
  const activeIAT = mockIATRecords.find(iat => iat.isActive);
  
  const quickActions = [
    { icon: Users, label: 'Add Student', action: () => navigate('/students?action=add') },
    { icon: BookOpen, label: 'Add Subject', action: () => navigate('/subjects?action=add') },
    { icon: Calendar, label: 'Add Session', action: () => navigate('/sessions?action=add') },
    { icon: UserCheck, label: 'Take Attendance', action: () => navigate('/attendance') }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="android-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">{totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="android-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subjects</p>
                <p className="text-2xl font-bold">{totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="android-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">{totalSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="android-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold text-success">{todayAttendance.present}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Attendance Summary */}
      <Card className="android-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <span>Today's Attendance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-2">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">{todayAttendance.present}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-destructive/10 rounded-full mx-auto mb-2">
                <UserX className="h-6 w-6 text-destructive" />
              </div>
              <p className="text-2xl font-bold text-destructive">{todayAttendance.absent}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-warning/10 rounded-full mx-auto mb-2">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">{todayAttendance.onDuty}</p>
              <p className="text-sm text-muted-foreground">On Duty</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Active IAT */}
      {activeIAT && (
        <Card className="android-card border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-primary">Active IAT</span>
              <Badge variant="default" className="bg-primary text-primary-foreground">
                {activeIAT.type}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              {activeIAT.startDate.toLocaleDateString()} - {activeIAT.endDate.toLocaleDateString()}
            </p>
            <Button 
              className="w-full" 
              onClick={() => navigate('/attendance?iat=active')}
            >
              Mark IAT Attendance
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Quick Actions */}
      <Card className="android-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.label}
                  variant="outline"
                  className="flex flex-col items-center space-y-2 h-auto py-4"
                  onClick={action.action}
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};