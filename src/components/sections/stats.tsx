import { Users, Briefcase, Calendar, UserCheck } from 'lucide-react';

const staticStats = [
  {
    icon: <Users className="w-10 h-10" style={{ color: '#4285F4' }} />, // Blue
    value: '1560+',
    label: 'Community Members',
  },
  {
    icon: <Briefcase className="w-10 h-10" style={{ color: '#34A853' }} />, // Green
    value: '24',
    label: 'Team Members',
  },
  {
    icon: <Calendar className="w-10 h-10" style={{ color: '#FBBC05' }} />, // Yellow
    value: '12+',
    label: 'Events Held',
  },
  {
    icon: <UserCheck className="w-10 h-10" style={{ color: '#EA4335' }} />, // Red
    value: '2000+',
    label: 'Event Attendees',
  },
];

const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
  <div className="flex flex-col items-center p-4 rounded-lg transition-transform duration-300 hover:-translate-y-2">
    {icon}
    <p className="text-4xl font-extrabold text-foreground mt-2">{value}</p>
    <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
  </div>
);


const StatsSection = () => {
  return (
    <section id="stats" className="py-12 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {staticStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
