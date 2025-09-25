import { MobileLayout } from '../components/MobileLayout';
import { Card, CardContent } from '../components/ui/card';

const Reports = () => {
  return (
    <MobileLayout title="Reports & Analytics">
      <Card className="android-card">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Reports Module</h2>
          <p className="text-muted-foreground">Coming soon...</p>
        </CardContent>
      </Card>
    </MobileLayout>
  );
};

export default Reports;