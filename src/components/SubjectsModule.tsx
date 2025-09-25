import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { BookOpen, Plus, Edit, Trash2, Users } from 'lucide-react';
import { mockSubjects } from '../data/mockData';
import { Subject, Department } from '../types';
import { useToast } from '@/hooks/use-toast';

export const SubjectsModule = () => {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  
  // Form states
  const [subjectName, setSubjectName] = useState('');
  const [subjectDepartment, setSubjectDepartment] = useState<Department>('CSE');
  
  const departments: (Department | 'ALL')[] = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  
  const handleAddSubject = () => {
    if (!subjectName.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive"
      });
      return;
    }

    const newSubject: Subject = {
      id: `SUB${(subjects.length + 1).toString().padStart(3, '0')}`,
      name: subjectName.trim(),
      department: subjectDepartment,
      totalSessions: 0
    };

    setSubjects([...subjects, newSubject]);
    
    toast({
      title: "Success",
      description: "Subject added successfully"
    });

    resetForm();
    setShowAddForm(false);
  };

  const handleEditSubject = () => {
    if (!editingSubject || !subjectName.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive"
      });
      return;
    }

    const updatedSubject: Subject = {
      ...editingSubject,
      name: subjectName.trim(),
      department: subjectDepartment
    };

    setSubjects(subjects.map(s => s.id === editingSubject.id ? updatedSubject : s));
    
    toast({
      title: "Success",
      description: "Subject updated successfully"
    });

    resetForm();
    setEditingSubject(null);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
    toast({
      title: "Success",
      description: "Subject deleted successfully"
    });
  };

  const resetForm = () => {
    setSubjectName('');
    setSubjectDepartment('CSE');
  };

  const openEditForm = (subject: Subject) => {
    setSubjectName(subject.name);
    setSubjectDepartment(subject.department);
    setEditingSubject(subject);
  };

  const filteredSubjects = subjects.filter(subject => {
    return selectedDepartment === 'ALL' || subject.department === selectedDepartment;
  });
  
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
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <p className="text-3xl font-bold text-primary">{filteredSubjects.length}</p>
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
                  <DialogTitle>Add New Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Subject Name"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />

                  <Select value={subjectDepartment} onValueChange={(value) => setSubjectDepartment(value as Department)}>
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

                  <div className="flex space-x-2">
                    <Button onClick={handleAddSubject} className="flex-1">
                      Add Subject
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
      
      {/* Subjects List */}
      <div className="space-y-3">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="android-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{subject.name}</h3>
                      <p className="text-sm text-muted-foreground">{subject.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={getDepartmentColor(subject.department)}>
                      {subject.department}
                    </Badge>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{subject.totalSessions} Sessions</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => openEditForm(subject)}
                  >
                    <Edit className="h-4 w-4 text-warning" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDeleteSubject(subject.id)}
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
      <Dialog open={!!editingSubject} onOpenChange={(open) => !open && setEditingSubject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Subject Name"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />

            <Select value={subjectDepartment} onValueChange={(value) => setSubjectDepartment(value as Department)}>
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

            <div className="flex space-x-2">
              <Button onClick={handleEditSubject} className="flex-1">
                Update Subject
              </Button>
              <Button variant="outline" onClick={() => setEditingSubject(null)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {filteredSubjects.length === 0 && (
        <Card className="android-card">
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No subjects found</p>
              <p className="text-sm">Add subjects for the selected department</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};