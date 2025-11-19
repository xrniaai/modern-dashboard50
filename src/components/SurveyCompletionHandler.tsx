import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DisqualificationAppealModal } from "./DisqualificationAppealModal";

interface SurveyCompletionHandlerProps {
  surveyAttemptId: Id<"surveys"> | null;
  onClose: () => void;
}

export function SurveyCompletionHandler({
  surveyAttemptId,
  onClose,
}: SurveyCompletionHandlerProps) {
  const [showAppealModal, setShowAppealModal] = useState(false);

  const analysis = useQuery(
    api.appeals.analyzeDisqualification,
    surveyAttemptId ? { surveyAttemptId } : "skip"
  );

  useEffect(() => {
    if (analysis && (analysis.shouldAppeal || analysis.isUncertain)) {
      setShowAppealModal(true);
    }
  }, [analysis]);

  if (!surveyAttemptId || !showAppealModal) {
    return null;
  }

  return (
    <DisqualificationAppealModal
      surveyAttemptId={surveyAttemptId}
      onClose={() => {
        setShowAppealModal(false);
        onClose();
      }}
    />
  );
}
