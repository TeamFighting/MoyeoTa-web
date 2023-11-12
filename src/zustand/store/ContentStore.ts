/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'

interface ContentStore {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    totalData: any[]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateTotalData: (data: any[]) => void
}

const ContentStore = create<ContentStore>((set) => ({
    totalData: [],
    updateTotalData: (data: any[]) => set((state) => ({ totalData: [...state.totalData, ...data] })),
}))

export default ContentStore
