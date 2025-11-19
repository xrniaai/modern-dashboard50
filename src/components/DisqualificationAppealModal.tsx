import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, X, Send, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface DisqualificationAppealModalProps {
  surveyAttemptId: Id<"surveys">;
  onClose: () => void;
}

export function DisqualificationAppealModal({
  surveyAttemptId,
  onClose,
}: DisqualificationAppealModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const analysis = useQuery(api.appeals.analyzeDisqualification, {
    surveyAttemptId,
  });

  const appealMessage = useQuery(api.appeals.generateAppealMessage, {
    surveyAttemptId,
  });

  const submitAppeal = useMutation(api.appeals.submitAppeal);

  const handleSubmit = async () => {
    if (!analysis || !appealMessage) return;

    setIsSubmitting(true);
    try {
      await submitAppeal({
        surveyAttemptId,
        appealMessage,
        aiReasoning: analysis.reasoning,
        aiConfidence: analysis.confidenceScore,
      });

      setSubmitted(true);
      toast.success("Your appeal has been submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit appeal. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!analysis || !appealMessage) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Analyzing disqualification...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="border-2 border-primary/20">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex p-6 rounded-full bg-green-100 dark:bg-green-900 mb-6"
              >
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
              </motion.div>

              <h2 className="text-2xl font-bold mb-3">Appeal Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your appeal has been submitted. We'll notify you when there's an update.
              </p>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
                <p className="text-sm text-muted-foreground">
                  <strong>What happens next?</strong>
                  <br />
                  We'll review your appeal within 24-72 hours. You'll receive a notification
                  once a decision has been made.
                </p>
              </div>

              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-2 border-primary/20 shadow-2xl">
            <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-primary" />
                    Disqualification Appeal Review
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {analysis.surveyTitle}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* AI Analysis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">AI Analysis</h3>
                  <Badge
                    variant={
                      analysis.confidenceScore >= 70
                        ? "default"
                        : analysis.confidenceScore >= 50
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {analysis.confidenceScore}% Confidence
                  </Badge>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
                </div>

                {analysis.isUncertain && (
                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      <strong>Note:</strong> We're not completely certain if this
                      disqualification can be appealed, but you may proceed if you believe
                      it was incorrect.
                    </p>
                  </div>
                )}
              </div>

              {/* Appeal Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Generated Appeal Message
                </h3>

                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed">
                    {appealMessage}
                  </pre>
                </div>
              </div>

              {/* Survey Details */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Time Spent</p>
                  <p className="font-semibold">
                    {Math.floor(analysis.timeSpent / 60)}m {analysis.timeSpent % 60}s
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Your Qualification Rate
                  </p>
                  <p className="font-semibold">
                    {analysis.userQualificationRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Appeal
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
