import { MobileLayout } from '../components/MobileLayout';
import { AttendanceModule } from '../components/AttendanceModule';

const Attendance = () => {
  return (
    <MobileLayout title="Attendance Management">
      <AttendanceModule />
    </MobileLayout>
  );
};

export default Attendance;