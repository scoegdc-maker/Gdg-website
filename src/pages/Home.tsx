
import EventsSection from '../components/sections/events';
import LibrarySection from '../components/sections/library';
import MembersSection from '../components/sections/members';
import HeroSection from '@/components/sections/hero';
import StatsSection from '@/components/sections/stats';
import MainLayout from '@/components/layout/main-layout';
import AdvisorSection from '@/components/sections/advisor';
import Footer from '@/components/layout/footer';

export default function Home() {
    return (
        <MainLayout footer={<Footer />}>
            <HeroSection />
            <StatsSection />
            <EventsSection />
            <LibrarySection />
            <MembersSection />
            <AdvisorSection />
        </MainLayout>
    );
}
