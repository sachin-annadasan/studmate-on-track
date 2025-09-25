import { ReactNode } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { MobileHeader } from './MobileHeader';

interface MobileLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileLayout = ({ children, title, showBack, onBack }: MobileLayoutProps) => {
  return (
    <div className="mobile-container mobile-scroll bg-background">
      <MobileHeader title={title} showBack={showBack} onBack={onBack} />
      <main className="pt-14 pb-20 px-4">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};