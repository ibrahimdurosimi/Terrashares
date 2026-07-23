import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Building2, TrendingUp, LogOut, Settings, Wallet } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type Investment = Database['public']['Tables']['investments']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];

type InvestmentWithProperty = Investment & {
  property: Property | null;
};

export default function Dashboard() {
  const [investments, setInvestments] = useState<InvestmentWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserAndFetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      
      // Fetch investments with joined properties
      const { data } = await supabase
        .from('investments')
        .select(`
          *,
          property:property_id (*)
        `)
        .eq('user_id', session.user.id)
        .order('invested_at', { ascending: false });
        
      if (data) {
        setInvestments(data as unknown as InvestmentWithProperty[]);
      }
      setLoading(false);
    }
    
    checkUserAndFetchData();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9B8924]"></div>
      </div>
    );
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2">My Portfolio</h1>
            <p className="text-[#0A0A0A]/60">Welcome back, {user?.user_metadata?.full_name || 'Investor'}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard/profile"
              className="p-3 rounded-full bg-white/50 backdrop-blur-sm border border-black/5 text-[#0A0A0A] hover:opacity-70 transition-opacity"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center px-6 py-3 rounded-full bg-white/50 backdrop-blur-sm text-[#0A0A0A] font-medium hover:bg-white transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] border border-black/5 shadow-sm">
            <div className="flex items-center text-[#0A0A0A]/50 mb-4">
              <Wallet className="w-5 h-5 mr-2" />
              <span className="font-medium uppercase tracking-wider text-sm">Total Invested</span>
            </div>
            <p className="text-4xl font-black text-[#0A0A0A]">${totalInvested.toLocaleString()}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2rem] border border-black/5 shadow-sm">
            <div className="flex items-center text-[#0A0A0A]/50 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="font-medium uppercase tracking-wider text-sm">Active Investments</span>
            </div>
            <p className="text-4xl font-black text-[#0A0A0A]">{investments.length}</p>
          </div>
          <div className="bg-[#0A0A0A] text-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
            <div className="flex items-center text-white/50 mb-4">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-medium uppercase tracking-wider text-sm">Avg. Target Returns</span>
            </div>
            <p className="text-4xl font-black text-[#F7D0BC]">
              {investments.length > 0 
                ? (investments.reduce((sum, inv) => sum + (inv.property?.returns_percent || 0), 0) / investments.length).toFixed(1) 
                : '0'}%
            </p>
          </div>
        </div>

        {/* Investments List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0A0A0A]">Investment History</h2>
          </div>
          
          {investments.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-[#0A0A0A]/20 mx-auto mb-4" />
              <p className="text-[#0A0A0A]/50 mb-6">You haven't made any investments yet.</p>
              <Link 
                to="/properties"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0A0A0A] px-8 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 text-[#0A0A0A]/50 text-sm uppercase tracking-wider">
                    <th className="p-6 font-medium">Property</th>
                    <th className="p-6 font-medium">Amount</th>
                    <th className="p-6 font-medium">Returns</th>
                    <th className="p-6 font-medium">Status</th>
                    <th className="p-6 font-medium">Invested On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-[#0A0A0A]">
                  {investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/50 transition-colors">
                      <td className="p-6">
                        <Link to={`/properties/${inv.property?.slug}`} className="font-bold hover:text-[#9B8924] transition-colors">
                          {inv.property?.title || 'Unknown Property'}
                        </Link>
                        {inv.units_purchased && (
                          <p className="text-sm text-[#0A0A0A]/50 mt-1">{inv.units_purchased} Units</p>
                        )}
                      </td>
                      <td className="p-6 font-bold text-lg">${inv.amount.toLocaleString()}</td>
                      <td className="p-6">
                        <span className="text-[#9B8924] font-bold">{inv.property?.returns_percent}%</span>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          inv.status === 'matured' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-6 text-[#0A0A0A]/50">
                        {format(parseISO(inv.invested_at), 'MMM dd, yyyy')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
