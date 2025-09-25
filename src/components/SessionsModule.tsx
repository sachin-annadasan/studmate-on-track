import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';
import { mockSubjects, mockStudents } from '../data/mockData';
import { Subject, Department, Session } from '../types';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export const SessionsModule = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  
  // Form states
  const [selectedSubject, setSelectedSubject] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [period, setPeriod] = useState('');
  const [date, setDate] = useState<Date>();

  const departments: (Department | 'ALL')[] = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  
  const filteredSubjects = mockSubjects.filter(subject => 
    selectedDepartment === 'ALL' || subject.department === selectedDepartment
  );

  const filteredSessions = sessions.filter(session => {
    const subject = mockSubjects.find(s => s.id === session.subjectId);
    return selectedDepartment === 'ALL' || subject?.department === selectedDepartment;
  });

  const handleAddSession = () => {
    if (!selectedSubject || !sessionName || !period || !date) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const newSession: Session = {
      id: `SESS${(sessions.length + 1).toString().padStart(3, '0')}`,
      subjectId: selectedSubject,
      name: sessionName,
      period: parseInt(period),
      date: date
    };

    setSessions([...sessions, newSession]);
    
    toast({
      title: "Success",
      description: "Session added successfully"
    });

    resetForm();
    setShowAddForm(false);
  };

  const handleEditSession = () => {
    if (!editingSession || !selectedSubject || !sessionName || !period || !date) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive"
      });
      return;
    }

    const updatedSession: Session = {
      ...editingSession,
      subjectId: selectedSubject,
      name: sessionName,
      period: parseInt(period),
      date: date
    };

    setSessions(sessions.map(s => s.id === editingSession.id ? updatedSession : s));
    
    toast({
      title: "Success",
      description: "Session updated successfully"
    });

    resetForm();
    setEditingSession(null);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast({
      title: "Success",
      description: "Session deleted successfully"
    });
  };

  const resetForm = () => {
    setSelectedSubject('');
    setSessionName('');
    setPeriod('');
    setDate(undefined);
  };

  const openEditForm = (session: Session) => {
    const subject = mockSubjects.find(s => s.id === session.subjectId);
    setSelectedSubject(session.subjectId);
    setSessionName(session.name);
    setPeriod(session.period.toString());
    setDate(session.date);
    setEditingSession(session);
  };

  const getSubjectInfo = (subjectId: string) => {
    return mockSubjects.find(s => s.id === subjectId);
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
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-3xl font-bold text-primary">{filteredSessions.length}</p>
            </div>
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button className="fab relative bottom-0 right-0 position-static">
                  <Plus className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSubjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Session Name"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                  />

                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                        <SelectItem key={p} value={p.toString()}>
                          Period {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>

                  <div className="flex space-x-2">
                    <Button onClick={handleAddSession} className="flex-1">
                      Add Session
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

      {/* Filter */}
      <Card className="android-card">
        <CardContent className="p-4">
          <Select value={selectedDepartment} onValueChange={(value) => setSelectedDepartment(value as Department | 'ALL')}>
            <SelectTrigger className="w-full">
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
        </CardContent>
      </Card>

      {/* Sessions List */}
      <div className="space-y-3">
        {filteredSessions.map((session) => {
          const subject = getSubjectInfo(session.subjectId);
          if (!subject) return null;
          
          return (
            <Card key={session.id} className="android-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{session.name}</h3>
                        <p className="text-sm text-muted-foreground">{subject.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={cn("text-xs", getDepartmentColor(subject.department))}>
                        {subject.department}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Period {session.period}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {format(session.date, "MMM dd, yyyy")}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditForm(session)}
                    >
                      <Edit className="h-4 w-4 text-warning" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSession} onOpenChange={(open) => !open && setEditingSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {mockSubjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Session Name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />

            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
                  <SelectItem key={p} value={p.toString()}>
                    Period {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Calendar className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <div className="flex space-x-2">
              <Button onClick={handleEditSession} className="flex-1">
                Update Session
              </Button>
              <Button variant="outline" onClick={() => setEditingSession(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredSessions.length === 0 && (
        <Card className="android-card">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No sessions found</p>
              <p className="text-sm">Add sessions for the selected department</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};