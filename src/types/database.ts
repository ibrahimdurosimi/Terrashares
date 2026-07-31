export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          location: string | null
          theme: 'light' | 'dark' | 'system' | null
          role: 'investor' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          theme?: 'light' | 'dark' | 'system' | null
          role?: 'investor' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          location?: string | null
          theme?: 'light' | 'dark' | 'system' | null
          role?: 'investor' | 'admin'
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          slug: string
          location: string
          description: string
          image_urls: string[] | null
          min_investment: number
          returns_percent: number
          duration_months: number
          payout_style: 'after_maturity' | 'monthly'
          category: 'residential' | 'commercial' | 'land' | 'mixed_use'
          type_details: Json
          is_fractional: boolean
          unit_value: number | null
          total_units: number | null
          units_sold: number | null
          status: 'open' | 'closed'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          location: string
          description: string
          image_urls?: string[] | null
          min_investment: number
          returns_percent: number
          duration_months: number
          payout_style: 'after_maturity' | 'monthly'
          category: 'residential' | 'commercial' | 'land' | 'mixed_use'
          type_details?: Json
          is_fractional?: boolean
          unit_value?: number | null
          total_units?: number | null
          units_sold?: number | null
          status?: 'open' | 'closed'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          location?: string
          description?: string
          image_urls?: string[] | null
          min_investment?: number
          returns_percent?: number
          duration_months?: number
          payout_style?: 'after_maturity' | 'monthly'
          category?: 'residential' | 'commercial' | 'land' | 'mixed_use'
          type_details?: Json
          is_fractional?: boolean
          unit_value?: number | null
          total_units?: number | null
          units_sold?: number | null
          status?: 'open' | 'closed'
          created_at?: string
        }
      }
      property_valuations: {
        Row: {
          id: string
          property_id: string
          recorded_date: string
          value: number
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          recorded_date?: string
          value: number
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          recorded_date?: string
          value?: number
          note?: string | null
          created_at?: string
        }
      }
      investments: {
        Row: {
          id: string
          user_id: string
          property_id: string
          amount: number
          units_purchased: number | null
          status: 'pending' | 'confirmed' | 'matured'
          invested_at: string
          matures_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          amount: number
          units_purchased?: number | null
          status?: 'pending' | 'confirmed' | 'matured'
          invested_at?: string
          matures_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          amount?: number
          units_purchased?: number | null
          status?: 'pending' | 'confirmed' | 'matured'
          invested_at?: string
          matures_at?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          location: string | null
          theme: 'light' | 'dark' | 'system' | null
          property_id: string | null
          message: string
          status: 'new' | 'contacted' | 'converted'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          location?: string | null
          theme?: 'light' | 'dark' | 'system' | null
          property_id?: string | null
          message: string
          status?: 'new' | 'contacted' | 'converted'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          location?: string | null
          theme?: 'light' | 'dark' | 'system' | null
          property_id?: string | null
          message?: string
          status?: 'new' | 'contacted' | 'converted'
          created_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          sort_order?: number
          created_at?: string
        }
      }
    }
  }
}
