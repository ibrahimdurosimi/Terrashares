import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'admin_test123@example.com',
    password: 'securepassword123',
    options: {
      data: { role: 'admin' }
    }
  });
  
  if (authError) {
    console.error("Auth error:", authError);
    return;
  }
  console.log("User created, token:", authData.session.access_token);

  const newProps = [
    {
      title: "4 Bedroom Detached House - Beechwood Estate (Co-Own)",
      slug: "4-bed-detached-beechwood-co-own",
      location: "Beechwood Estate, Lekki Axis",
      description: "Co-own a Newly finished 4 bedroom detached House. House garage Packs 10 cars conveniently. 24Hrs Electricity.",
      image_urls: [
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop"
      ],
      min_investment: 5000000,
      returns_percent: 12.5,
      duration_months: 24,
      payout_style: "after_maturity",
      category: "residential",
      type_details: {},
      is_fractional: true,
      unit_value: 5000000,
      status: "open"
    },
    {
      title: "Terrashare Urban II (Residential Plot)",
      slug: "terrashare-urban-ii-residential",
      location: "Epe, Lagos",
      description: "Prime residential plot in the rapidly developing Epe corridor. Perfect for land banking or future development.",
      image_urls: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=800&auto=format&fit=crop"
      ],
      min_investment: 2000000,
      returns_percent: 30,
      duration_months: 12,
      payout_style: "after_maturity",
      category: "land",
      type_details: {},
      is_fractional: false,
      unit_value: 2000000,
      status: "open"
    },
    {
      title: "Terrashare Urban II (Commercial Plot)",
      slug: "terrashare-urban-ii-commercial",
      location: "Epe, Lagos",
      description: "Strategic commercial plot facing the major expressway in Terrashare Urban II. High ROI potential.",
      image_urls: [
        "https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=800&auto=format&fit=crop"
      ],
      min_investment: 5000000,
      returns_percent: 35,
      duration_months: 12,
      payout_style: "after_maturity",
      category: "land",
      type_details: {},
      is_fractional: false,
      unit_value: 5000000,
      status: "closed"
    }
  ];

  const { data, error } = await supabase.from('properties').insert(newProps);
  console.log("Insert error:", error);
}
run();
