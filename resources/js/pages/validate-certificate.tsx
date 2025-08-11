import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ValidateCertificate() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);

  const handleValidateCertificate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input value to allow resubmission of the same file
    e.target.value = '';

    setIsValidating(true);
    setValidationResult(null);

    const formData = new FormData();
    formData.append('certificate', file);

    try {
      toast.promise(
        (async () => {
          const response = await fetch(route('certificates.validate.public'), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'X-XSRF-TOKEN': decodeURIComponent(
                document.cookie
                  .split('; ')
                  .find((row) => row.startsWith('XSRF-TOKEN='))
                  ?.split('=')[1] || '',
              ),
            },
            credentials: 'include',
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            // Set validation result for UI display
            setValidationResult({
              error: true,
              message: result.message || `HTTP error! status: ${response.status}`,
            });
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
          }

          // Set successful validation result
          setValidationResult({
            error: false,
            message: 'Certificate is valid',
            data: result.data,
          });

          return result;
        })(),
        {
          loading: 'Validating certificate...',
          success: 'Certificate validated successfully',
          error: (err) => `Validation failed: ${err.message}`,
        },
      );
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <Head title="Validate Certificate" />
      <div className={cn('flex flex-col gap-6')}>
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="flex flex-col gap-6 p-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Ramerame Certificate Validation</h1>
                <CardDescription>Upload your certificate file to verify if it's genuine and hasn't been modified.</CardDescription>
              </div>

              <div className="flex flex-col items-center gap-4">
                <Input type="file" accept=".png" onChange={handleValidateCertificate} disabled={isValidating} className="flex-1" />

                {isValidating && (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Validating certificate...</span>
                  </div>
                )}

                {validationResult && (
                  <Alert variant={validationResult.error ? 'destructive' : 'default'}>
                    {validationResult.error ? (
                      <>
                        <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                        <div>
                          <AlertTitle>Invalid Certificate</AlertTitle>
                          <AlertDescription>{validationResult.message}</AlertDescription>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                        <div>
                          <AlertTitle className="pt-0.5 pb-2">Valid Certificate</AlertTitle>
                          <AlertDescription>
                            <div className="space-y-1">
                              <p className="text-sm">
                                <strong>Name:</strong> {validationResult.data?.name}
                              </p>
                              <p className="text-sm">
                                <strong>Certificate No:</strong> {validationResult.data?.certificate_no}
                              </p>
                              <p className="text-sm">
                                <strong>Generated At:</strong> {new Date(validationResult.data?.generated_at || '').toLocaleString()}
                              </p>
                              <p className="text-sm">
                                <strong>Issuer:</strong> {validationResult.data?.issuer}
                              </p>
                            </div>
                          </AlertDescription>
                        </div>
                      </>
                    )}
                  </Alert>
                )}
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full bg-white text-left text-black">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-muted relative hidden md:block">
              <img
                src="/logo-ramerame-white.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
