import { ArrowLeft, Bell } from 'lucide-react';
import { Button } from './ui/button';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader = ({ title, showBack, onBack }: MobileHeaderProps) => {
  return (
    <header className="mobile-header fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 text-primary-foreground">
      <div className="flex items-center space-x-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-primary-foreground hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-primary-foreground hover:bg-white/20"
      >
        <Bell className="h-5 w-5" />
      </Button>
    </header>
  );
};