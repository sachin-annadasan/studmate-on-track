import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { BookOpen, Plus, Edit, Trash2, Users } from 'lucide-react';
import { mockSubjects } from '../data/mockData';
import { Subject, Department } from '../types';

export const SubjectsModule = () => {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const departments: (Department | 'ALL')[] = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  
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
            <Button 
              className="fab relative bottom-0 right-0 position-static"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4 text-warning" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
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