import { create } from "zustand";
import { saveResponse } from "../lib/supabase";

/* Generate a simple anonymous session ID */
function newSessionId() {
  return "sess_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now();
}

/*
  useSurveyStore
  ─────────────
  Holds the entire survey lifecycle for one app session.

  Shape:
  {
    sessionId       : string
    moduleId        : string | null          — which module is active
    tsStart         : string | null          — ISO timestamp when module opened
    preDraft        : object                 — in-progress pre-survey answers
    postDraft       : object                 — in-progress post-survey answers
    submitted       : string[]               — moduleIds already submitted this session
    saving          : boolean
    saveError       : string | null
  }
*/

export const useSurveyStore = create((set, get) => ({
  sessionId:  newSessionId(),
  moduleId:   null,
  tsStart:    null,
  preDraft:   {},
  postDraft:  {},
  submitted:  [],
  saving:     false,
  saveError:  null,

  /* Called when a module page mounts */
  beginModule: (moduleId) =>
    set({
      moduleId,
      tsStart:   new Date().toISOString(),
      preDraft:  {},
      postDraft: {},
      saveError: null,
    }),

  /* Update a single pre-survey answer */
  setPreAnswer: (questionId, value) =>
    set((s) => ({ preDraft: { ...s.preDraft, [questionId]: value } })),

  /* Update a single post-survey answer */
  setPostAnswer: (questionId, value) =>
    set((s) => ({ postDraft: { ...s.postDraft, [questionId]: value } })),

  /*
    submitResponse — packages everything up and sends to Supabase.
    moduleMetrics  : object pulled from the relevant game store
                     e.g. { ending, securityRisk, socialPressure, incidents }
  */
  submitResponse: async (moduleMetrics = {}) => {
    const { sessionId, moduleId, tsStart, preDraft, postDraft } = get();

    set({ saving: true, saveError: null });

    const payload = {
      session_id:     sessionId,
      module_id:      moduleId,
      ts_start:       tsStart,
      ts_end:         new Date().toISOString(),
      pre_survey:     preDraft,
      post_survey:    postDraft,
      module_metrics: moduleMetrics,
    };

    const { error } = await saveResponse(payload);

    if (error) {
      set({ saving: false, saveError: error.message });
      return false;
    }

    set((s) => ({
      saving:    false,
      submitted: [...s.submitted, moduleId],
    }));

    return true;
  },

  /* Check if required questions are all answered */
  isPreComplete: (schema) => {
    const { preDraft } = get();
    return schema
      .filter((q) => q.required)
      .every((q) => {
        const v = preDraft[q.id];
        return v !== undefined && v !== null && v !== "";
      });
  },

  isPostComplete: (schema) => {
    const { postDraft } = get();
    return schema
      .filter((q) => q.required)
      .every((q) => {
        const v = postDraft[q.id];
        return v !== undefined && v !== null && v !== "";
      });
  },
}));