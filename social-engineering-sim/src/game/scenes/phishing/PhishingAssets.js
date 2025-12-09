export const GameState = {
  day: 1,

  inbox: {
    1: [
      { id: "dance", subject: "Dance Competition Registration", type: "legit" },
      { id: "gmail", subject: "Unusual Sign in Attempt", type: "phish" }
    ],
    2: [
      { id: "amazon", subject: "Amazon Purchase Receipt", type: "phish" }
    ]
  },

  danceLegitVisited: false,
  danceDeleted: false,
  gmailResolvedSafely: false,
  amazonResolvedSafely: false,

  failReason: "",

  reset() {
    this.day = 1

    this.inbox = {
      1: [
        { id: "dance", subject: "Dance Competition Registration", type: "legit" },
        { id: "gmail", subject: "Unusual Sign in Attempt", type: "phish" }
      ],
      2: [
        { id: "amazon", subject: "Amazon Purchase Receipt", type: "phish" }
      ]
    }

    this.danceLegitVisited = false
    this.danceDeleted = false
    this.gmailResolvedSafely = false
    this.amazonResolvedSafely = false
    this.failReason = ""
  }
}
