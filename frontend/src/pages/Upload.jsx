import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ctganAPI } from '@/api/client';
import { CheckCircle2, Upload, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export const UploadPage = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadSuccess(false);
    setUploadError(null);
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await ctganAPI.uploadDataset(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      
      toast.success('Dataset uploaded successfully!');
      console.log('Upload response:', response);
      
      // Navigate to generate page after short delay
      setTimeout(() => {
        navigate('/generate');
      }, 1500);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload dataset');
      setUploadProgress(0);
      toast.error('Upload failed: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="page-container">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Upload Dataset
              </h1>
              <p className="text-muted-foreground mt-1">
                Upload your CSV file to begin the synthesis process
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Alert */}
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                Your CSV file should contain tabular data with column headers. 
                The CTGAN model will learn from this data to generate synthetic samples.
              </AlertDescription>
            </Alert>

            {/* File Upload Component */}
            <FileUpload
              onFileSelect={handleFileSelect}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              uploadError={uploadError}
            />

            {/* Success Message */}
            {uploadSuccess && (
              <Card className="p-6 bg-success/5 border-success/20">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Upload Successful!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your dataset has been uploaded successfully. You can now proceed to train the model and generate synthetic data.
                    </p>
                    <Button onClick={() => navigate('/generate')} className="gap-2">
                      Continue to Generation
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Action Buttons */}
            {selectedFile && !uploadSuccess && (
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  size="lg"
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full spinner" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Dataset
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Requirements */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Dataset Requirements
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">CSV Format</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      File must be in CSV format with proper headers
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Size Limit</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum file size: 100MB
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Data Quality</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Clean data with minimal missing values for best results
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Column Headers</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      First row should contain descriptive column names
                    </p>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-muted/50">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                What Happens Next?
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">1.</span>
                  <span>Your data is uploaded to the server</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">2.</span>
                  <span>CTGAN model is trained on your dataset</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">3.</span>
                  <span>Generate synthetic data that mimics your original</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-semibold text-primary">4.</span>
                  <span>Evaluate quality and privacy metrics</span>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;


// import { useState } from "react";
// import { ctganAPI } from "@/api/client";
// import { Button } from "@/components/ui/button";

// export default function Upload() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   const handleUpload = async () => {
//     if (!file) return alert("Select a CSV file");

//     try {
//       setLoading(true);
//       const res = await ctganAPI.uploadDataset(file);
//       setMsg(res.message || "Upload successful");
//     } catch (e) {
//       setMsg(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-8 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">Upload Dataset</h2>

//       <input
//         type="file"
//         accept=".csv"
//         onChange={(e) => setFile(e.target.files[0])}
//         className="mb-4"
//       />

//       <Button onClick={handleUpload} disabled={loading}>
//         {loading ? "Uploading..." : "Upload"}
//       </Button>

//       {msg && <p className="mt-4">{msg}</p>}
//     </div>
//   );
// }
