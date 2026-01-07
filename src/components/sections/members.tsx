
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Linkedin, Twitter } from 'lucide-react';
import { useMemberManagement } from '@/hooks/use-member-management';

const MemberCard = ({ member }: { member: any }) => (
  <div className="flex flex-col items-center text-center">
    <Avatar className="w-40 h-40 mb-4 border-4 border-white shadow-lg transition-transform duration-300 hover:scale-110">
      <AvatarImage src={member.image_url} alt={member.name} className="object-cover" />
      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
    </Avatar>
    <h3 className="text-xl font-bold font-headline">{member.name}</h3>
    <p className="text-primary">{member.role}</p>
    <div className="flex justify-center mt-2 space-x-3">
      {member.linkedin && (
        <a href={`https://linkedin.com/in/${member.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-google-blue">
          <Linkedin size={20} />
        </a>
      )}
      {member.twitter && (
        <a href={`https://twitter.com/${member.twitter}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-google-yellow">
          <Twitter size={20} />
        </a>
      )}
    </div>
  </div>
);

const MembersSection = () => {
  const { members, loadingMembers } = useMemberManagement();

  const lead = members[0];
  const secondRow = members.slice(1, 3);
  const otherMembers = members.slice(3);

  return (
    <section id="members" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-headline">
            Meet Our Community
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            The amazing people building our community.
          </p>
        </div>

        {loadingMembers ? (
          <p className="text-center text-muted-foreground">Loading team members...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground">No team members found.</p>
        ) : (
          <div className="space-y-16">
            {/* Top row */}
            {lead && (
              <div className="flex justify-center">
                <MemberCard member={lead} />
              </div>
            )}

            {/* Second row */}
            {secondRow.length > 0 && (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12 max-w-2xl">
                  {secondRow.map((member, index) => (
                    <MemberCard key={index} member={member} />
                  ))}
                </div>
              </div>
            )}

            {/* Other Members Grid */}
            {otherMembers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-12 md:gap-x-8">
                {otherMembers.map((member, index) => (
                  <MemberCard key={index} member={member} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default MembersSection;
