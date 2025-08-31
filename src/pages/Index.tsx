import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import heroImage from '@/assets/hero-fintech.jpg';
import { 
  Shield, 
  Zap, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  DollarSign,
  Clock,
  MapPin
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<'borrower' | 'lender'>('borrower');

  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "KYC verified users, encrypted transactions, and regulatory compliance ensure your money is safe.",
      color: "text-success"
    },
    {
      icon: Zap,
      title: "Instant Matching",
      description: "AI-powered algorithms match borrowers with lenders in real-time for faster loan approvals.",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Community Lending",
      description: "Connect with local lenders and borrowers in your area for personalized lending experiences.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Competitive Returns",
      description: "Earn attractive returns on your investments while helping others achieve their financial goals.",
      color: "text-secondary"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Create Account",
      description: "Sign up and complete KYC verification to unlock full platform access"
    },
    {
      step: "2", 
      title: "Choose Your Role",
      description: "Switch between borrower and lender modes based on your current needs"
    },
    {
      step: "3",
      title: "Get Matched",
      description: "Our smart matching system connects you with the right people nearby"
    },
    {
      step: "4",
      title: "Transact Safely",
      description: "Complete loans with escrow protection and automated repayment tracking"
    }
  ];

  const stats = [
    { value: "₹50L+", label: "Loans Facilitated" },
    { value: "10K+", label: "Happy Users" },
    { value: "98%", label: "On-time Repayments" },
    { value: "12%", label: "Avg. Returns" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation userRole={userRole} onRoleSwitch={setUserRole} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🇮🇳 Made for India
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Peer-to-Peer
                  <br />
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    Lending Platform
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Connect directly with verified lenders and borrowers. No middlemen, no hidden fees. 
                  Just transparent, secure, and fair financial transactions.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Button variant="hero" size="xl" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="hero" size="xl" asChild>
                      <Link to="/auth">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="xl" asChild>
                      <Link to="#how-it-works">Learn More</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-10 blur-3xl transform rotate-6" />
              <img
                src={heroImage}
                alt="SparkLend Platform"
                className="relative z-10 rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mx-auto">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">
              Why Choose SparkLend?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with security, transparency, and user experience at the core.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg bg-gradient-card">
                <CardHeader>
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-background shadow-md flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="mx-auto">
              How It Works
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">
              Simple Steps to Get Started
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From registration to your first transaction in minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground font-bold text-xl flex items-center justify-center">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                Safety First
              </Badge>
              <h2 className="text-3xl lg:text-5xl font-bold">
                Your Security is Our Priority
              </h2>
              <p className="text-xl text-muted-foreground">
                Every user is KYC verified, every transaction is encrypted, and every loan is backed by our comprehensive fraud detection system.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <span className="text-lg">Aadhaar & PAN Verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <span className="text-lg">Escrow Protection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <span className="text-lg">AI Fraud Detection</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <span className="text-lg">CIBIL Integration</span>
                </div>
              </div>
            </div>

            <Card className="p-8 shadow-2xl border-0 bg-gradient-card">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Star className="h-6 w-6 text-accent" />
                  <span className="text-lg font-semibold">Trusted by thousands</span>
                </div>
                <blockquote className="text-lg italic">
                  "SparkLend made it so easy to get a loan for my business. The process was transparent, fast, and I got competitive rates from local lenders."
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary" />
                  <div>
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-sm text-muted-foreground">Small Business Owner</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Ready to Start Your Financial Journey?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of Indians who are already using SparkLend to borrow, lend, and grow their wealth.
            </p>
            {!user && (
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-primary text-primary-foreground font-bold">
                  S
                </div>
                <span className="font-bold text-xl">SparkLend</span>
              </div>
              <p className="text-muted-foreground">
                India's most trusted peer-to-peer lending platform. Connecting borrowers and lenders directly.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Platform</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>How it works</div>
                <div>Safety & Security</div>
                <div>Fees & Charges</div>
                <div>FAQs</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Company</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>About Us</div>
                <div>Careers</div>
                <div>Press</div>
                <div>Contact</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Terms of Service</div>
                <div>Privacy Policy</div>
                <div>Compliance</div>
                <div>Grievance</div>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SparkLend. All rights reserved. | Regulated by RBI</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
