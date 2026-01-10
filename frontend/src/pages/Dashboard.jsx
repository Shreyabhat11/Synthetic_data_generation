import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Upload, 
  Sparkles, 
  BarChart3, 
  Shield, 
  ArrowRight,
  Database,
  Cpu,
  CheckCircle2
} from 'lucide-react';

export const Dashboard = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: '01',
      title: 'Upload Dataset',
      description: 'Upload your CSV file containing the original dataset',
      icon: Upload,
      path: '/upload',
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      number: '02',
      title: 'Generate Synthetic Data',
      description: 'Train CTGAN model and generate synthetic data',
      icon: Sparkles,
      path: '/generate',
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
    {
      number: '03',
      title: 'Evaluate Quality',
      description: 'Analyze utility metrics and data quality',
      icon: BarChart3,
      path: '/evaluate',
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      number: '04',
      title: 'Verify Privacy',
      description: 'Check privacy metrics and disclosure risks',
      icon: Shield,
      path: '/privacy',
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
  ];

  const features = [
    {
      icon: Database,
      title: 'Preserve Data Distribution',
      description: 'Maintains statistical properties of original data',
    },
    {
      icon: Cpu,
      title: 'Deep Learning Powered',
      description: 'Uses CTGAN neural network for realistic synthesis',
    },
    {
      icon: Shield,
      title: 'Privacy Guaranteed',
      description: 'Protects sensitive information with privacy metrics',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="hero-section relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        <div className="page-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Data Synthesis</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Generative AI for
              <span className="block gradient-text mt-2">Test Data Synthesis</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Generate high-quality synthetic data using CTGAN (Conditional Tabular GAN) 
              while preserving statistical properties and ensuring privacy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/upload')}
                className="gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="page-container">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center card-hover">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Workflow Section */}
        <div id="workflow" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple 4-Step Workflow
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From data upload to privacy verification, follow our streamlined process
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <Card 
                key={index} 
                className="p-6 card-hover cursor-pointer group"
                onClick={() => navigate(step.path)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-xl ${step.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <step.icon className={`w-8 h-8 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-muted-foreground/40">
                        {step.number}
                      </span>
                      <h3 className="text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      <span>Start</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="p-8 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Ready to Generate Synthetic Data?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start by uploading your dataset and let CTGAN create high-quality synthetic data
            </p>
            <Button size="lg" onClick={() => navigate('/upload')} className="gap-2">
              Upload Dataset Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
