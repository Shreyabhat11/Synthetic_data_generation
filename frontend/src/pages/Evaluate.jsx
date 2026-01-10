import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MetricsCard } from '@/components/MetricsCard';
import { Chart } from '@/components/Chart';
import { ctganAPI } from '@/api/client';
import {
  BarChart3,
  TrendingUp,
  Target,
  Activity,
  ArrowRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function Evaluate() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvaluation = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await ctganAPI.getEvaluationMetrics();
      setData(res);
      toast.success('Evaluation metrics loaded');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to load evaluation metrics');
      toast.error('Failed to load evaluation metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluation();
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

  const { utility, distributions, correlation_comparison } = data;

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Utility Evaluation</h1>
              <p className="text-muted-foreground">
                Synthetic data quality & statistical fidelity
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={fetchEvaluation}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="stats-grid mb-8">
          <MetricsCard
            title="Statistical Similarity"
            value={utility.statistical_similarity}
            description="Overall similarity score (0–1)"
            icon={Target}
            variant="primary"
          />

          <MetricsCard
            title="TSTR AUC"
            value={utility.tstr_auc}
            description="Train Synthetic, Test Real"
            icon={TrendingUp}
          />

          <MetricsCard
            title="Mean Squared Error"
            value={utility.mean_squared_error}
            description="Distribution error"
            icon={Activity}
          />

          <MetricsCard
            title="Correlation Difference"
            value={utility.correlation_difference}
            description="Feature relationship drift"
            icon={Activity}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Chart
            title="Feature Distribution Comparison"
            type="bar"
            data={distributions}
            xKey="feature"
            yKey1="real"
            yKey2="synthetic"
            yKey1Label="Real"
            yKey2Label="Synthetic"
            height={350}
          />

          <Chart
            title="Feature Correlation Comparison"
            type="bar"
            data={correlation_comparison}
            xKey="pair"
            yKey1="real"
            yKey2="synthetic"
            yKey1Label="Real"
            yKey2Label="Synthetic"
            height={350}
          />
        </div>

        {/* Detailed Metrics Table */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                  <th>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">TSTR AUC</td>
                  <td>{utility.tstr_auc.toFixed(4)}</td>
                  <td>
                    Measures how well models trained on synthetic data generalize to real data.
                  </td>
                </tr>

                <tr>
                  <td className="font-medium">Mean Squared Error</td>
                  <td>{utility.mean_squared_error.toFixed(4)}</td>
                  <td>
                    Lower values indicate better numeric distribution alignment.
                  </td>
                </tr>

                <tr>
                  <td className="font-medium">KL Divergence</td>
                  <td>{utility.kullback_leibler_divergence.toFixed(4)}</td>
                  <td>
                    Lower divergence means synthetic distributions closely match real ones.
                  </td>
                </tr>

                <tr>
                  <td className="font-medium">Correlation Difference</td>
                  <td>{utility.correlation_difference.toFixed(4)}</td>
                  <td>
                    Indicates preservation of feature relationships.
                  </td>
                </tr>

                <tr>
                  <td className="font-medium">Statistical Similarity</td>
                  <td>{utility.statistical_similarity.toFixed(4)}</td>
                  <td>
                    Aggregate similarity score derived from multiple metrics.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Interpretation & Recommendations */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quality Assessment</h3>

            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                The synthetic dataset demonstrates strong statistical similarity to the real dataset.
              </p>
              <p>
                Feature distributions and correlations are well preserved, making the data suitable
                for downstream analytics and model development.
              </p>
              <p>
                TSTR AUC indicates that machine learning models trained on synthetic data can
                generalize effectively to real-world data.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-muted/50">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>✓ Use synthetic data for model development and testing</li>
              <li>✓ Suitable for exploratory data analysis</li>
              <li>✓ Preserves critical statistical properties</li>
              <li>→ Proceed to privacy evaluation for risk assessment</li>
            </ul>
          </Card>

        </div>

        {/* Next Step */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Utility Evaluation Complete</h3>
              <p className="text-sm text-muted-foreground">
                Continue to privacy analysis for full validation.
              </p>
            </div>
            <Button onClick={() => navigate('/privacy')}>
              Go to Privacy Metrics
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
}
