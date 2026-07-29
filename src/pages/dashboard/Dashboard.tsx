import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database';
import { Building2, Wallet, TrendingUp, LogOut, Settings, Heart, CheckCircle2 } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

type Investment = Database['public']['Tables']['investments']['Row'];
type Property = Database['public']['Tables']['properties']['Row'];

type InvestmentWithProperty = Investment & {
  property: Property | null;
  isLocal?: boolean;
  localType?: 'wishlist' | 'offline';
};

export default function Dashboard() {
  const [investments, setInvestments] = useState<InvestmentWithProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserAndFetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
        
      if (userData?.role === 'admin') {
        setIsAdmin(true);
      }
      
      // Fetch investments with joined properties from DB
      const { data: dbData } = await supabase
        .from('investments')
        .select(`
          *,
          property:property_id (*)
        `)
        .eq('user_id', session.user.id)
        .order('invested_at', { ascending: false });
        
      let allInvestments: InvestmentWithProperty[] = (dbData as any) || [];

      // Read local portfolio
      const key = `terrashare_portfolio_${session.user.id}`;
      const localData = JSON.parse(localStorage.getItem(key) || '[]');
      
      const localInvestments: InvestmentWithProperty[] = localData.map((item: any) => ({
        id: item.id,
        user_id: session.user.id,
        property_id: item.property_id,
        amount: item.min_investment || 0, // Fallback to min investment
        status: item.type === 'offline' ? 'confirmed' : 'pending',
        invested_at: item.added_at,
        isLocal: true,
        localType: item.type,
        property: {
          id: item.property_id,
          title: item.title,
          slug: item.property_slug,
          returns_percent: item.returns_percent,
          duration_months: 12, // default
          category: item.category,
        }
      }));

      // Merge and sort
      allInvestments = [...allInvestments, ...localInvestments].sort((a, b) => 
        new Date(b.invested_at).getTime() - new Date(a.invested_at).getTime()
      );

      setInvestments(allInvestments);
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
      <div className="flex items-center justify-center py-24 min-h-screen bg-[#FAF8F5]">
        <div className="w-12 h-12 border-4 border-[#0A0A0A]/10 border-t-[#9B8924] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate stats (only for confirmed / offline investments, not wishlist)
  const activeInvestments = investments.filter(inv => inv.status === 'confirmed' || inv.status === 'matured' || inv.localType === 'offline');
  
  const totalInvested = activeInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  
  // Calculate appreciation
  const totalValue = activeInvestments.reduce((sum, inv) => {
    const amount = inv.amount || 0;
    const returns = inv.property?.returns_percent || 0;
    const durationMonths = inv.property?.duration_months || 12;
    
    const daysSince = Math.max(0, differenceInDays(new Date(), parseISO(inv.invested_at)));
    const totalDays = durationMonths * 30;
    const fraction = Math.min(1, daysSince / totalDays);
    
    const appreciation = amount * (returns / 100) * fraction;
    return sum + amount + appreciation;
  }, 0);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#FAF8F5]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0A0A] mb-2 font-serif">My Portfolio</h1>
            <p className="text-[#0A0A0A]/60 font-medium">Welcome back, {user?.user_metadata?.full_name || 'Investor'}</p>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link 
                to="/admin"
                className="flex items-center px-6 py-3 rounded-full bg-[#0A0A0A] text-white font-bold hover:bg-[#0A0A0A]/80 transition-colors shadow-sm"
              >
                Admin Panel
              </Link>
            )}
            <Link 
              to="/dashboard/profile"
              className="p-3 rounded-full bg-white border border-black/5 text-[#0A0A0A] hover:bg-gray-50 transition-colors shadow-sm"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center px-6 py-3 rounded-full bg-white border border-black/5 text-[#0A0A0A] font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </button>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
            <div className="flex items-center text-[#0A0A0A]/50 mb-4">
              <Wallet className="w-5 h-5 mr-2" />
              <span className="font-bold uppercase tracking-wider text-sm">Total Invested</span>
            </div>
            <p className="text-4xl font-black text-[#0A0A0A]">₦{totalInvested.toLocaleString()}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
            <div className="flex items-center text-[#0A0A0A]/50 mb-4">
              <TrendingUp className="w-5 h-5 mr-2" />
              <span className="font-bold uppercase tracking-wider text-sm">Current Value</span>
            </div>
            <p className="text-4xl font-black text-[#449175]">₦{totalValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
            <p className="text-sm text-[#449175] font-medium mt-2">+₦{(totalValue - totalInvested).toLocaleString(undefined, {maximumFractionDigits: 0})} Appreciation</p>
          </div>
          <div className="bg-[#0A0A0A] text-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
            <div className="flex items-center text-white/50 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="font-bold uppercase tracking-wider text-sm">Active Properties</span>
            </div>
            <p className="text-4xl font-black text-[#BFA15F]">
              {activeInvestments.length}
            </p>
          </div>
        </div>

        {/* Investments List */}
        <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#0A0A0A]">Your Properties & Wishlist</h2>
          </div>
          
          {investments.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="w-16 h-16 text-[#0A0A0A]/20 mx-auto mb-4" />
              <p className="text-[#0A0A0A]/50 mb-6 font-medium">You haven't added any properties to your portfolio yet.</p>
              <Link 
                to="/properties"
                className="inline-flex h-14 items-center justify-center rounded-full bg-[#0A0A0A] px-8 font-bold text-white transition-colors hover:bg-gray-800"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="p-6">Property</th>
                    <th className="p-6">Type</th>
                    <th className="p-6">Amount</th>
                    <th className="p-6">Returns</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-900">
                  {investments.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-6">
                        <Link to={`/properties/${inv.property?.slug}`} className="font-bold hover:text-[#9B8924] transition-colors">
                          {inv.property?.title || 'Unknown Property'}
                        </Link>
                        {inv.localType === 'wishlist' && (
                          <div className="flex items-center text-xs text-gray-500 font-medium mt-1">
                            <Heart className="w-3 h-3 mr-1 text-red-400 fill-current" /> Tracking
                          </div>
                        )}
                        {inv.localType === 'offline' && (
                          <div className="flex items-center text-xs text-gray-500 font-medium mt-1">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" /> Offline Investment
                          </div>
                        )}
                      </td>
                      <td className="p-6 font-medium text-gray-600 capitalize">
                        {inv.property?.category?.replace('_', ' ') || '-'}
                      </td>
                      <td className="p-6 font-bold text-lg">
                        {inv.localType === 'wishlist' ? '-' : `₦${inv.amount.toLocaleString()}`}
                      </td>
                      <td className="p-6">
                        <span className="text-[#449175] font-bold">{inv.property?.returns_percent}%</span>
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          inv.localType === 'wishlist' ? 'bg-gray-100 text-gray-600' :
                          inv.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          inv.status === 'matured' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {inv.localType === 'wishlist' ? 'Wishlist' : inv.status}
                        </span>
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
