import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { mockStudents } from '../data/mockData';
import { Student, Department } from '../types';
import { cn } from '@/lib/utils';

export const StudentsModule = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const departments: (Department | 'ALL')[] = ['ALL', 'CSE', 'ECE', 'MECH', 'IT', 'CIVIL'];
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'ALL' || student.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
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
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-primary">{filteredStudents.length}</p>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4 text-primary" />
                  </Button>
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