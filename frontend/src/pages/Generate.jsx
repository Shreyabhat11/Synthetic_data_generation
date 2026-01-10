import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ctganAPI } from '@/api/client';
import { Sparkles, Download, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export const Generate = () => {
  const navigate = useNavigate();
  const [numRows, setNumRows] = useState(1000);
  const [isTraining, setIsTraining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleTrain = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setError(null);

    try {
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 500);

      const response = await ctganAPI.trainModel();
      
      clearInterval(progressInterval);
      setTrainingProgress(100);
      setTrainingComplete(true);
      
      toast.success('Model trained successfully!');
      console.log('Training response:', response);
      
    } catch (error) {
      console.error('Training error:', error);
      setError(error.message || 'Failed to train model');
      setTrainingProgress(0);
      toast.error('Training failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsTraining(false);
    }
  };

  const handleGenerate = async () => {
    if (!numRows || numRows <= 0) {
      toast.error('Please enter a valid number of rows');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    try {
      // Simulate generation progress
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await ctganAPI.generateData(numRows);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationComplete(true);
      
      toast.success(`Generated ${numRows} synthetic rows successfully!`);
      console.log('Generation response:', response);
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message || 'Failed to generate data');
      setGenerationProgress(0);
      toast.error('Generation failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await ctganAPI.downloadSyntheticData();
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Generate Synthetic Data
              </h1>
              <p className="text-muted-foreground mt-1">
                Train CTGAN model and generate synthetic data
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Train Model */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-chart-1/10 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-chart-1 text-white flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Train CTGAN Model
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    First, train the CTGAN model on your uploaded dataset. This process learns the statistical patterns and distributions.
                  </p>
                  
                  {isTraining && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Training in progress...</span>
                        <span className="text-sm font-medium text-foreground">{trainingProgress}%</span>
                      </div>
                      <Progress value={trainingProgress} className="h-2" />
                    </div>
                  )}

                  {trainingComplete && (
                    <Alert className="mb-4 border-success/20 bg-success/5">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <AlertDescription className="text-success">
                        Model training completed successfully!
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    onClick={handleTrain}
                    disabled={isTraining || trainingComplete}
                    className="gap-2"
                  >
                    {isTraining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Training Model...
                      </>
                    ) : trainingComplete ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Training Complete
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Start Training
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Step 2: Generate Data */}
            <Card className={`p-6 ${!trainingComplete ? 'opacity-50' : ''}`}>
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 rounded-lg bg-chart-2/10 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-chart-2 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Generate Synthetic Rows
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Specify how many synthetic data rows you want to generate from the trained model.
                  </p>

                  <div className="mb-4">
                    <Label htmlFor="numRows" className="mb-2 block">
                      Number of Rows
                    </Label>
                    <Input
                      id="numRows"
                      type="number"
                      min="1"
                      max="100000"
                      value={numRows}
                      onChange={(e) => setNumRows(parseInt(e.target.value))}
                      disabled={!trainingComplete || isGenerating}
                      placeholder="Enter number of rows"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Recommended: 1000-10000 rows
                    </p>
                  </div>

                  {isGenerating && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Generating synthetic data...</span>
                        <span className="text-sm font-medium text-foreground">{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="h-2" />
                    </div>
                  )}

                  {generationComplete && (
                    <Alert className="mb-4 border-success/20 bg-success/5">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      <AlertDescription className="text-success">
                        Successfully generated {numRows} synthetic rows!
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleGenerate}
                      disabled={!trainingComplete || isGenerating}
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Data
                        </>
                      )}
                    </Button>
                    
                    {generationComplete && (
                      <Button 
                        onClick={handleDownload}
                        disabled={isDownloading}
                        variant="outline"
                        className="gap-2"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download CSV
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Next Steps */}
            {generationComplete && (
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Generation Complete!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your synthetic data has been generated. Proceed to evaluate the quality and check privacy metrics.
                    </p>
                    <div className="flex items-center gap-4">
                      <Button onClick={() => navigate('/evaluate')} className="gap-2">
                        Evaluate Quality
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => navigate('/privacy')} 
                        variant="outline"
                        className="gap-2"
                      >
                        Check Privacy
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                About CTGAN
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  CTGAN (Conditional Tabular GAN) is a deep learning model that generates synthetic tabular data.
                </p>
                <p>
                  It uses conditional generators and training-by-sampling to handle imbalanced discrete columns and complex distributions.
                </p>
                <p>
                  The model learns the statistical patterns from your original data without memorizing individual records.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-muted/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Training Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Training may take several minutes depending on dataset size</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Larger datasets typically produce better quality synthetic data</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>You can generate multiple batches from a single trained model</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Progress } from '@/components/ui/progress';
// import { ctganAPI } from '@/api/client';
// 

// const POLL_INTERVAL = 2000;

// const Generate = () => {
//   const navigate = useNavigate();

//   // -------------------------
//   // State
//   // -------------------------
//   const [numRows, setNumRows] = useState(1000);

//   const [trainingState, setTrainingState] = useState('idle');
//   const [trainingProgress, setTrainingProgress] = useState(0);
//   const [currentEpoch, setCurrentEpoch] = useState(0);
//   const [totalEpochs, setTotalEpochs] = useState(0);
//   const [trainingMessage, setTrainingMessage] = useState('');

//   const [isGenerating, setIsGenerating] = useState(false);
//   const [generationComplete, setGenerationComplete] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

//   const [error, setError] = useState(null);

//   const isTraining = trainingState === 'running';
//   const trainingComplete = trainingState === 'completed';

//   // -------------------------
//   // Poll training status
//   // -------------------------
//   useEffect(() => {
//     if (!isTraining) return;

//     const interval = setInterval(async () => {
//       try {
//         const status = await ctganAPI.getTrainingStatus();

//         setTrainingState(status.state);
//         setTrainingProgress(status.progress || 0);
//         setCurrentEpoch(status.epoch || 0);
//         setTotalEpochs(status.total_epochs || 0);
//         setTrainingMessage(status.message || '');

//         if (status.state === 'completed') {
//           toast.success('CTGAN training completed');
//           clearInterval(interval);
//         }

//         if (status.state === 'failed') {
//           setError(status.message || 'Training failed');
//           toast.error('Training failed');
//           clearInterval(interval);
//         }
//       } catch {
//         setError('Failed to fetch training status');
//         clearInterval(interval);
//       }
//     }, POLL_INTERVAL);

//     return () => clearInterval(interval);
//   }, [isTraining]);

//   // -------------------------
//   // Start training
//   // -------------------------
//   const handleTrain = async () => {
//   setError(null);
//   setTrainingProgress(0);
//   setGenerationComplete(false);

//   try {
//     await ctganAPI.trainModel();
//     toast.info('Training started');
//     // ❗ DO NOT set trainingState here
//   } catch (err) {
//     setTrainingState('idle');
//     setError(err.message || 'Failed to start training');
//     toast.error('Could not start training');
//   }
// };


//   // -------------------------
//   // Generate synthetic data
//   // -------------------------
//   const handleGenerate = async () => {
//     if (!numRows || numRows <= 0) {
//       toast.error('Enter a valid number of rows');
//       return;
//     }

//     setIsGenerating(true);
//     setError(null);

//     try {
//       await ctganAPI.generateData(numRows);
//       setGenerationComplete(true);
//       toast.success(`Generated ${numRows} synthetic rows`);
//     } catch (err) {
//       setError(err.message || 'Generation failed');
//       toast.error('Generation failed');
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // -------------------------
//   // Download CSV
//   // -------------------------
//   const handleDownload = async () => {
//     setIsDownloading(true);
//     try {
//       await ctganAPI.downloadSyntheticData();
//       toast.success('Download started');
//     } catch {
//       toast.error('Download failed');
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   // -------------------------
//   // UI
//   // -------------------------
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="page-container">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Generate Synthetic Data</h1>
//           <p className="text-muted-foreground mt-1">
//             Train CTGAN and generate synthetic rows
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2 space-y-6">

//             {/* Step 1: Train */}
//             <Card className="p-6">
//               <h2 className="text-xl font-semibold mb-4">1. Train CTGAN</h2>

//               {isTraining && (
//                 <div className="mb-4">
//                   <div className="flex justify-between text-sm mb-1">
//                     <span>{trainingMessage || 'Training in progress…'}</span>
//                     <span>{trainingProgress}%</span>
//                   </div>
//                   <Progress value={trainingProgress} />
//                   {totalEpochs > 0 && (
//                     <p className="text-xs text-muted-foreground mt-1">
//                       Epoch {currentEpoch} / {totalEpochs}
//                     </p>
//                   )}
//                 </div>
//               )}

//               {trainingComplete && (
//                 <Alert className="mb-4 border-success/20 bg-success/5">
//                   <CheckCircle2 className="w-4 h-4 text-success" />
//                   <AlertDescription className="text-success">
//                     Training completed successfully
//                   </AlertDescription>
//                 </Alert>
//               )}

//               <Button
//                 onClick={handleTrain}
//                 disabled={isTraining || trainingComplete}
//                 className="gap-2"
//               >
//                 {isTraining ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Training…
//                   </>
//                 ) : trainingComplete ? (
//                   <>
//                     <CheckCircle2 className="w-4 h-4" />
//                     Trained
//                   </>
//                 ) : (
//                   <>
//                     <Sparkles className="w-4 h-4" />
//                     Start Training
//                   </>
//                 )}
//               </Button>
//             </Card>

//             {/* Step 2: Generate */}
//             <Card className={`p-6 ${!trainingComplete && 'opacity-50'}`}>
//               <h2 className="text-xl font-semibold mb-4">
//                 2. Generate Synthetic Data
//               </h2>

//               <Label>Number of Rows</Label>
//               <Input
//                 type="number"
//                 value={numRows}
//                 onChange={(e) => setNumRows(Number(e.target.value))}
//                 disabled={!trainingComplete || isGenerating}
//                 className="mb-4"
//               />

//               <div className="flex gap-4">
//                 <Button
//                   onClick={handleGenerate}
//                   disabled={!trainingComplete || isGenerating}
//                 >
//                   {isGenerating ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                       Generating…
//                     </>
//                   ) : (
//                     'Generate'
//                   )}
//                 </Button>

//                 {generationComplete && (
//                   <Button
//                     variant="outline"
//                     onClick={handleDownload}
//                     disabled={isDownloading}
//                   >
//                     {isDownloading ? (
//                       <Loader2 className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Download className="w-4 h-4" />
//                     )}
//                     Download CSV
//                   </Button>
//                 )}
//               </div>
//             </Card>

//             {/* Errors */}
//             {error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="w-4 h-4" />
//                 <AlertDescription>{String(error)}</AlertDescription>
//               </Alert>
//             )}

//             {/* Next steps */}
//             {generationComplete && (
//               <Card className="p-6 bg-primary/5">
//                 <h3 className="font-semibold mb-2">Next steps</h3>
//                 <div className="flex gap-4">
//                   <Button onClick={() => navigate('/evaluate')}>
//                     Evaluate Utility <ArrowRight className="w-4 h-4 ml-1" />
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => navigate('/privacy')}
//                   >
//                     Privacy Metrics <ArrowRight className="w-4 h-4 ml-1" />
//                   </Button>
//                 </div>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Generate;
