import { create } from "zustand"

const initialInbox = () => ({
  1: [
    { id: "dance", subject: "Dance Competition Registration", type: "legit" },
    { id: "gmail", subject: "Unusual Sign in Attempt", type: "phish" }
  ],
    2: [
    { id: "amazon", subject: "Amazon Purchase Receipt", type: "phish" }
  ]
})

export const useGameStore = create((set, get) => ({
  day: 1,
  inbox: initialInbox(),
  currentEmailId: null,
  simulationMode: null, // "gmail" | "amazon" | "dance" | null

  // flags
  danceLegitVisited: false,
  danceDeleted: false,
  gmailResolvedSafely: false,
  amazonResolvedSafely: false,

  failReason: "",
  ending: null, // "fail" | "good" | "perfect" | null

  // helpers
  getCurrentEmail() {
    const { day, inbox, currentEmailId } = get()
    if (!currentEmailId) return null
    const list = inbox[day] || []
    return list.find(e => e.id === currentEmailId) || null
  },

  selectEmail(id) {
    set({ currentEmailId: id })
  },

  deleteEmail(id) {
    const { day, inbox } = get()
    const newInbox = { ...inbox }
    newInbox[day] = (newInbox[day] || []).filter(e => e.id !== id)

    const updates = { inbox: newInbox }

    if (id === "dance") {
      updates.danceDeleted = true
    }
    if (id === "gmail") {
      updates.gmailResolvedSafely = true
    }
    if (id === "amazon") {
      updates.amazonResolvedSafely = true
    }

    set(updates)
    get().maybeAdvanceDay()
    get().maybeSetEnding()
  },

 setDanceVisited() {
  const { inbox } = get()
  const newInbox = { ...inbox }
  newInbox[1] = (newInbox[1] || []).filter(e => e.id !== "dance")

  set({
    inbox: newInbox,
    danceLegitVisited: true
  })

  get().maybeAdvanceDay()
},


  handleGmailSafe() {
    const { inbox } = get()
    const newInbox = { ...inbox }
    newInbox[1] = (newInbox[1] || []).filter(e => e.id !== "gmail")

    set({
      inbox: newInbox,
      gmailResolvedSafely: true
    })

    get().maybeAdvanceDay()
  },

  handleAmazonSafe() {
    const { inbox } = get()
    const newInbox = { ...inbox }
    newInbox[2] = (newInbox[2] || []).filter(e => e.id !== "amazon")

    set({
      inbox: newInbox,
      amazonResolvedSafely: true
    })

    get().maybeSetEnding()
  },

  startSimulation(mode) {
    set({ simulationMode: mode })
  },

  endSimulation() {
    set({ simulationMode: null })
  },

  setFail(reason) {
    set({
      failReason: reason,
      ending: "fail",
      simulationMode: null
    })
  },

  maybeAdvanceDay() {
    const {
      day,
      danceLegitVisited,
      danceDeleted,
      gmailResolvedSafely
    } = get()

    if (day === 1) {
      const danceHandled = danceLegitVisited || danceDeleted
      if (danceHandled && gmailResolvedSafely) {
        set({ day: 2, currentEmailId: null })
      }
    }
  },

  maybeSetEnding() {
    const {
      day,
      danceLegitVisited,
      danceDeleted,
      gmailResolvedSafely,
      amazonResolvedSafely,
      ending
    } = get()

    if (ending) return
    if (day !== 2 || !amazonResolvedSafely) return

    if (danceLegitVisited && !danceDeleted && gmailResolvedSafely) {
      set({ ending: "perfect" })
      return
    }

    if (danceDeleted && gmailResolvedSafely) {
      set({ ending: "good" })
    }
  },

  resetGame() {
    set({
      day: 1,
      inbox: initialInbox(),
      currentEmailId: null,
      simulationMode: null,
      danceLegitVisited: false,
      danceDeleted: false,
      gmailResolvedSafely: false,
      amazonResolvedSafely: false,
      failReason: "",
      ending: null
    })
  }
}))
