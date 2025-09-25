import { MobileLayout } from '../components/MobileLayout';
import { StudentsModule } from '../components/StudentsModule';

const Students = () => {
  return (
    <MobileLayout title="Students Management">
      <StudentsModule />
    </MobileLayout>
  );
};

export default Students;