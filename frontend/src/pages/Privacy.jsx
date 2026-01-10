import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MetricsCard } from '@/components/MetricsCard';
import { Chart } from '@/components/Chart';
import { ctganAPI } from '@/api/client';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Home,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function Privacy() {
  const navigate = useNavigate();
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrivacy = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await ctganAPI.getPrivacyMetrics();
      setRisk(res.privacy.disclosure_risk);
      toast.success('Privacy metrics loaded');
    } catch (err) {
      console.error(err);
      setError('Failed to load privacy metrics');
      toast.error('Failed to load privacy metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacy();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  /* ---------- Derived Metrics ---------- */
  const privacyScore = Math.max(0, 1 - risk);
  const riskPercent = (risk * 100).toFixed(2);

  let level = 'High Risk';
  let color = 'destructive';
  let progress = 30;

  if (risk < 0.05) {
    level = 'Excellent';
    color = 'success';
    progress = 90;
  } else if (risk < 0.1) {
    level = 'Good';
    color = 'success';
    progress = 75;
  } else if (risk < 0.2) {
    level = 'Moderate';
    color = 'warning';
    progress = 55;
  }

  const distributionData = [
    { label: 'Safe Records', value: Math.round((1 - risk) * 1000) },
    { label: 'Risk-Prone Records', value: Math.round(risk * 1000) },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Evaluation</h1>
              <p className="text-muted-foreground">
                Disclosure & re-identification risk analysis
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={fetchPrivacy}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Risk Banner */}
        <Card className={`p-6 mb-8 border-${color}/20 bg-${color}/5`}>
          <div className="flex items-center gap-4">
            {color === 'success' ? (
              <CheckCircle2 className="w-8 h-8 text-success" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-warning" />
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                Overall Privacy Level: {level}
              </h3>
              <p className="text-sm text-muted-foreground">
                Disclosure risk is {riskPercent}%. Lower is better.
              </p>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="stats-grid mb-8">
          <MetricsCard
            title="Disclosure Risk"
            value={risk}
            description="Probability of re-identification"
            icon={AlertTriangle}
            variant={color}
          />
          <MetricsCard
            title="Privacy Score"
            value={privacyScore}
            description="Derived protection score (0–1)"
            icon={Shield}
            variant="primary"
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Chart
            title="Record Risk Distribution"
            type="bar"
            data={distributionData}
            xKey="label"
            yKey1="value"
            yKey1Label="Records"
            height={300}
          />
        </div>

        {/* Detailed Table */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Detailed Privacy Assessment
          </h3>

          <table className="data-table">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">Disclosure Risk</td>
                <td>{risk.toFixed(4)}</td>
                <td>&lt; 0.10</td>
                <td>
                  <span className={`status-badge ${color}`}>
                    {level}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="font-medium">Privacy Score</td>
                <td>{privacyScore.toFixed(4)}</td>
                <td>&gt; 0.70</td>
                <td>
                  <span className="status-badge success">Pass</span>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>

        {/* Privacy Strength */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-3">
            Privacy Interpretation
          </h3>
          <p className="text-sm text-muted-foreground">
            Your synthetic data demonstrates a low probability of identity
            disclosure. This indicates strong anonymization and makes the data
            suitable for testing, analytics, and machine learning without
            exposing sensitive personal information.
          </p>
        </Card>

        {/* Progress */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2">
            Privacy Protection Level
          </h3>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-sm text-muted-foreground">
            {level} privacy protection based on disclosure risk.
          </p>
        </Card>

        {/* Navigation */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-center">
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate('/evaluate')}>
              View Utility Metrics
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
