-- SparkLend P2P Lending Platform Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE public.app_role AS ENUM ('borrower', 'lender', 'admin');

-- KYC status enum  
CREATE TYPE public.kyc_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');

-- Credit tier enum
CREATE TYPE public.credit_tier AS ENUM ('starter', 'bronze', 'silver', 'gold', 'platinum');

-- Loan status enum
CREATE TYPE public.loan_status AS ENUM ('pending', 'partial', 'fulfilled', 'active', 'completed', 'defaulted', 'cancelled');

-- Transaction type enum
CREATE TYPE public.transaction_type AS ENUM ('escrow_hold', 'escrow_release', 'disbursement', 'repayment', 'fee', 'fine');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  pan_number TEXT,
  aadhar_number TEXT,
  kyc_status kyc_status DEFAULT 'pending',
  cibil_score INTEGER,
  credit_tier credit_tier DEFAULT 'starter',
  is_blacklisted BOOLEAN DEFAULT false,
  total_borrowed DECIMAL(12,2) DEFAULT 0,
  total_lent DECIMAL(12,2) DEFAULT 0,
  successful_repayments INTEGER DEFAULT 0,
  current_borrowing_limit DECIMAL(10,2) DEFAULT 1000,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Wallets table for escrow management
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance_available DECIMAL(12,2) DEFAULT 0,
  balance_escrow DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loan requests table
CREATE TABLE public.loan_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  borrower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  term_days INTEGER NOT NULL,
  purpose TEXT,
  status loan_status DEFAULT 'pending',
  amount_funded DECIMAL(10,2) DEFAULT 0,
  visibility_radius_km INTEGER DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Loan splits (multiple lenders can fund one request)
CREATE TABLE public.loan_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_request_id UUID REFERENCES public.loan_requests(id) ON DELETE CASCADE NOT NULL,
  lender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_contributed DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  platform_fee DECIMAL(8,2) DEFAULT 0,
  status loan_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Active loans table (created when request is fully funded)
CREATE TABLE public.loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_request_id UUID REFERENCES public.loan_requests(id) NOT NULL,
  borrower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,
  term_days INTEGER NOT NULL,
  due_date TIMESTAMPTZ NOT NULL,
  amount_repaid DECIMAL(10,2) DEFAULT 0,
  fine_amount DECIMAL(10,2) DEFAULT 0,
  status loan_status DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Repayments table
CREATE TABLE public.repayments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID REFERENCES public.loans(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  interest_portion DECIMAL(10,2) NOT NULL,
  principal_portion DECIMAL(10,2) NOT NULL,
  fine_portion DECIMAL(10,2) DEFAULT 0,
  payment_method TEXT,
  transaction_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions table for audit trail
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  reference_id UUID, -- Could reference loan_id, repayment_id, etc.
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ratings and reviews
CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  to_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  loan_id UUID REFERENCES public.loans(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_user_id, to_user_id, loan_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repayments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Insert user roles" ON public.user_roles
FOR INSERT WITH CHECK (true);

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallet" ON public.wallets
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own wallet" ON public.wallets
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Insert wallet" ON public.wallets
FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for loan_requests
CREATE POLICY "Anyone can view active loan requests" ON public.loan_requests
FOR SELECT USING (status IN ('pending', 'partial'));

CREATE POLICY "Borrowers can view their own requests" ON public.loan_requests
FOR SELECT USING (borrower_id = auth.uid());

CREATE POLICY "Borrowers can insert their own requests" ON public.loan_requests
FOR INSERT WITH CHECK (borrower_id = auth.uid());

CREATE POLICY "Borrowers can update their own requests" ON public.loan_requests
FOR UPDATE USING (borrower_id = auth.uid());

-- RLS Policies for loan_splits
CREATE POLICY "Lenders can view their investments" ON public.loan_splits
FOR SELECT USING (lender_id = auth.uid());

CREATE POLICY "Anyone can view splits for visible requests" ON public.loan_splits
FOR SELECT USING (
  loan_request_id IN (
    SELECT id FROM public.loan_requests 
    WHERE status IN ('pending', 'partial', 'fulfilled')
  )
);

CREATE POLICY "Lenders can insert splits" ON public.loan_splits
FOR INSERT WITH CHECK (lender_id = auth.uid());

-- RLS Policies for loans
CREATE POLICY "Borrowers can view their loans" ON public.loans
FOR SELECT USING (borrower_id = auth.uid());

CREATE POLICY "Lenders can view loans they funded" ON public.loans
FOR SELECT USING (
  id IN (
    SELECT l.id FROM public.loans l
    JOIN public.loan_splits ls ON l.loan_request_id = ls.loan_request_id
    WHERE ls.lender_id = auth.uid()
  )
);

CREATE POLICY "Insert loans" ON public.loans
FOR INSERT WITH CHECK (true);

CREATE POLICY "Update loans" ON public.loans
FOR UPDATE USING (true);

-- RLS Policies for repayments
CREATE POLICY "View repayments for own loans" ON public.repayments
FOR SELECT USING (
  loan_id IN (
    SELECT id FROM public.loans WHERE borrower_id = auth.uid()
    UNION
    SELECT l.id FROM public.loans l
    JOIN public.loan_splits ls ON l.loan_request_id = ls.loan_request_id
    WHERE ls.lender_id = auth.uid()
  )
);

CREATE POLICY "Insert repayments" ON public.repayments
FOR INSERT WITH CHECK (true);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON public.transactions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Insert transactions" ON public.transactions
FOR INSERT WITH CHECK (true);

-- RLS Policies for ratings
CREATE POLICY "Users can view ratings about them" ON public.ratings
FOR SELECT USING (to_user_id = auth.uid() OR from_user_id = auth.uid());

CREATE POLICY "Users can insert ratings" ON public.ratings
FOR INSERT WITH CHECK (from_user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_kyc_status ON public.profiles(kyc_status);
CREATE INDEX idx_loan_requests_status ON public.loan_requests(status);
CREATE INDEX idx_loan_requests_expires_at ON public.loan_requests(expires_at);
CREATE INDEX idx_loan_splits_lender_id ON public.loan_splits(lender_id);
CREATE INDEX idx_loans_borrower_id ON public.loans(borrower_id);
CREATE INDEX idx_loans_due_date ON public.loans(due_date);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loan_requests_updated_at
  BEFORE UPDATE ON public.loan_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loans_updated_at
  BEFORE UPDATE ON public.loans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();