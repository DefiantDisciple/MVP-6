import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { User, Tender, VendorBid, Clarification, Notification, Dispute, Milestone, NoticeToAward } from "./types"

// Entity store slice
interface EntityState {
  tenders: Tender[]
  bids: VendorBid[]
  clarifications: Clarification[]
  evaluations: any[]
  awards: NoticeToAward[]
  milestones: Milestone[]

  // Actions
  setTenders: (tenders: Tender[]) => void
  addTender: (tender: Tender) => void
  updateTender: (id: string, updates: Partial<Tender>) => void
  removeTender: (id: string) => void

  setBids: (bids: VendorBid[]) => void

  setClarifications: (clarifications: Clarification[]) => void
  addClarification: (clarification: Clarification) => void
  updateClarification: (id: string, updates: Partial<Clarification>) => void

  setMilestones: (milestones: Milestone[]) => void
  updateMilestone: (id: string, updates: Partial<Milestone>) => void
}

// Provider store slice
interface ProviderState {
  availableTenders: Tender[]
  myBids: VendorBid[]
  myClarifications: Clarification[]
  myDisputes: Dispute[]
  myAwards: NoticeToAward[]
  myMilestones: Milestone[]

  // Actions
  setAvailableTenders: (tenders: Tender[]) => void

  setMyBids: (bids: VendorBid[]) => void
  addBid: (bid: VendorBid) => void
  updateBid: (id: string, updates: Partial<VendorBid>) => void

  setMyClarifications: (clarifications: Clarification[]) => void
  addClarification: (clarification: Clarification) => void

  setMyDisputes: (disputes: Dispute[]) => void
  addDispute: (dispute: Dispute) => void

  setMyMilestones: (milestones: Milestone[]) => void
}

// Admin store slice
interface AdminState {
  allTenders: Tender[]
  allBids: VendorBid[]
  allDisputes: Dispute[]
  platformStats: {
    totalTenders: number
    activeTenders: number
    totalProviders: number
    totalEntities: number
  }

  // Actions
  setAllTenders: (tenders: Tender[]) => void
  setAllBids: (bids: VendorBid[]) => void
  setAllDisputes: (disputes: Dispute[]) => void
  setPlatformStats: (stats: AdminState["platformStats"]) => void
}

// Shared state
interface SharedState {
  user: User | null
  notifications: Notification[]
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  setIsLoading: (isLoading: boolean) => void
}

// Combined store type
type StoreState = EntityState & ProviderState & AdminState & SharedState

// Create store with optimistic updates
export const useStore = create<StoreState>()(
  devtools(
    (set) => ({
      // Shared state
      user: null,
      notifications: [],
      isLoading: false,

      // Entity state
      tenders: [],
      bids: [],
      clarifications: [],
      evaluations: [],
      awards: [],
      milestones: [],

      // Provider state
      availableTenders: [],
      myBids: [],
      myClarifications: [],
      myDisputes: [],
      myAwards: [],
      myMilestones: [],

      // Admin state
      allTenders: [],
      allBids: [],
      allDisputes: [],
      platformStats: {
        totalTenders: 0,
        activeTenders: 0,
        totalProviders: 0,
        totalEntities: 0,
      },

      // Shared actions
      setUser: (user) => set({ user }),
      setNotifications: (notifications) => set({ notifications }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date() } : n)),
        })),
      setIsLoading: (isLoading) => set({ isLoading }),

      // Entity actions
      setTenders: (tenders) => set({ tenders }),
      addTender: (tender) => set((state) => ({ tenders: [tender, ...state.tenders] })),
      updateTender: (id, updates) =>
        set((state) => ({
          tenders: state.tenders.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)),
        })),
      removeTender: (id) =>
        set((state) => ({
          tenders: state.tenders.filter((t) => t.id !== id),
        })),

      setBids: (bids) => set({ bids }),

      setClarifications: (clarifications) => set({ clarifications }),
      addClarification: (clarification) =>
        set((state) => ({
          clarifications: [clarification, ...state.clarifications],
        })),
      updateClarification: (id, updates) =>
        set((state) => ({
          clarifications: state.clarifications.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c,
          ),
        })),

      setMilestones: (milestones) => set({ milestones }),
      updateMilestone: (id, updates) =>
        set((state) => ({
          milestones: state.milestones.map((m) => (m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m)),
        })),

      // Provider actions
      setAvailableTenders: (availableTenders) => set({ availableTenders }),

      setMyBids: (myBids) => set({ myBids }),
      addBid: (bid) => set((state) => ({ myBids: [bid, ...state.myBids] })),
      updateBid: (id, updates) =>
        set((state) => ({
          myBids: state.myBids.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b)),
        })),

      setMyClarifications: (myClarifications) => set({ myClarifications }),

      setMyDisputes: (myDisputes) => set({ myDisputes }),
      addDispute: (dispute) => set((state) => ({ myDisputes: [dispute, ...state.myDisputes] })),

      setMyMilestones: (myMilestones) => set({ myMilestones }),

      // Admin actions
      setAllTenders: (allTenders) => set({ allTenders }),
      setAllBids: (allBids) => set({ allBids }),
      setAllDisputes: (allDisputes) => set({ allDisputes }),
      setPlatformStats: (platformStats) => set({ platformStats }),
    }),
    { name: "tender-store" },
  ),
)

// Selectors for better performance
export const selectEntityTendersByStage = (state: StoreState, stage: string) =>
  state.tenders.filter((t) => t.stage === stage)

export const selectProviderActiveTenders = (state: StoreState) =>
  state.availableTenders.filter(
    (t) => t.stage === "published" || t.stage === "clarification" || t.stage === "submission",
  )

export const selectUnreadNotifications = (state: StoreState) => state.notifications.filter((n) => !n.isRead)
