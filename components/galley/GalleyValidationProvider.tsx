"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  approveDeliverable,
  createMockValidationState,
  editDeliverable,
  rejectDeliverable,
} from "@/lib/galley/mockValidationNode";
import type { MockValidationState } from "@/lib/galley/types";

type GalleyValidationContextValue = MockValidationState & {
  selectedDeliverableId: string;
  selectDeliverable: (deliverableId: string) => void;
  approve: (deliverableId: string) => void;
  edit: (deliverableId: string) => void;
  reject: (deliverableId: string) => void;
};

const GalleyValidationContext = createContext<GalleyValidationContextValue | null>(null);

export function GalleyValidationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MockValidationState>(createMockValidationState);
  const [selectedDeliverableId, setSelectedDeliverableId] = useState(
    () => state.deliverables[0]?.id ?? "",
  );

  const selectDeliverable = useCallback((deliverableId: string) => {
    setSelectedDeliverableId(deliverableId);
  }, []);

  const approve = useCallback((deliverableId: string) => {
    setState((current) => {
      const deliverable = current.deliverables.find((item) => item.id === deliverableId);
      if (!deliverable || deliverable.status !== "awaiting_proof") return current;

      const result = approveDeliverable(deliverable);
      return {
        ...current,
        deliverables: current.deliverables.map((item) =>
          item.id === deliverableId ? result.deliverable : item,
        ),
        approvals: [...current.approvals, result.approval],
        events: [...current.events, result.event],
      };
    });
  }, []);

  const edit = useCallback((deliverableId: string) => {
    setState((current) => {
      const deliverable = current.deliverables.find((item) => item.id === deliverableId);
      const drafts = current.drafts
        .filter((draft) => draft.deliverableId === deliverableId)
        .sort((left, right) => right.version - left.version);
      const latestDraft = drafts[0];
      if (!deliverable || !latestDraft || deliverable.status !== "awaiting_proof") return current;

      const result = editDeliverable(deliverable, latestDraft);
      return {
        ...current,
        deliverables: current.deliverables.map((item) =>
          item.id === deliverableId ? result.deliverable : item,
        ),
        drafts: [...current.drafts, result.draft],
        approvals: [...current.approvals, result.approval],
        events: [...current.events, result.event],
      };
    });
  }, []);

  const reject = useCallback((deliverableId: string) => {
    setState((current) => {
      const deliverable = current.deliverables.find((item) => item.id === deliverableId);
      if (!deliverable || deliverable.status !== "awaiting_proof") return current;

      const result = rejectDeliverable(deliverable);
      return {
        ...current,
        deliverables: current.deliverables.map((item) =>
          item.id === deliverableId ? result.deliverable : item,
        ),
        approvals: [...current.approvals, result.approval],
        events: [...current.events, result.event],
      };
    });
  }, []);

  const value = useMemo<GalleyValidationContextValue>(
    () => ({
      ...state,
      selectedDeliverableId,
      selectDeliverable,
      approve,
      edit,
      reject,
    }),
    [state, selectedDeliverableId, selectDeliverable, approve, edit, reject],
  );

  return (
    <GalleyValidationContext.Provider value={value}>
      {children}
    </GalleyValidationContext.Provider>
  );
}

export function useGalleyValidation(): GalleyValidationContextValue {
  const context = useContext(GalleyValidationContext);
  if (!context) {
    throw new Error("useGalleyValidation must be used inside GalleyValidationProvider.");
  }
  return context;
}
