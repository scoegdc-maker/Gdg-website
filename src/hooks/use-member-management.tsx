import { useState, useEffect } from 'react';
import { supabase, type Member } from '@/lib/supabase';

export function useMemberManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const fetchMembers = async (showLoader = true) => {
    try {
      if (showLoader) setLoadingMembers(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      if (showLoader) setLoadingMembers(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    setMembers,
    loadingMembers,
    fetchMembers,
  };
}
