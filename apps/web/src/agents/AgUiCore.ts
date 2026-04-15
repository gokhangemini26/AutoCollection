import { create } from 'zustand';

export type AgentStatus = 'IDLE' | 'THINKING' | 'WARNING' | 'BLOCKED';

export interface AgentState {
    status: AgentStatus;
    message: string | null;
    context: {
        currentModule: number;
        activeSeasonId?: string;
        activeDesignId?: string;
    };
    actions: {
        setStatus: (status: AgentStatus, message?: string | null) => void;
        setContext: (context: Partial<AgentState['context']>) => void;
        validateAction: (actionType: string, payload: any) => boolean;
    };
}

const RULE_BOOK: Record<string, (ctx: any, payload: any) => string | null> = {
    'APPROVE_COST': (_ctx, payload) => {
        if (payload.margin < 0.55) {
            return `Marj İhlali: Hedef %60, mevcut %${(payload.margin * 100).toFixed(1)}. Kumaş maliyetini yeniden görüşün.`;
        }
        return null;
    },
    'CREATE_DESIGN': (ctx) => {
        if (!ctx.activeSeasonId) {
            return 'Bağlam Hatası: Önce Mod 1 Strateji\'den bir sezon seçin.';
        }
        return null;
    },
    'APPROVE_DESIGN': (_ctx, payload) => {
        if (!payload.hasCostSheet) {
            return 'Maliyet Tablosu Eksik: Tasarımı onaylamadan önce maliyetlendirme yapılmalıdır.';
        }
        return null;
    },
};

export const useAgUiStore = create<AgentState>((set, get) => ({
    status: 'IDLE',
    message: null,
    context: { currentModule: 0 },
    actions: {
        setStatus: (status, message = null) => set({ status, message }),
        setContext: (newCtx) => set((state) => ({ context: { ...state.context, ...newCtx } })),

        validateAction: (actionType, payload) => {
            const state = get();
            const rule = RULE_BOOK[actionType];
            if (!rule) return true;

            set({ status: 'THINKING', message: 'Kural kontrol ediliyor...' });

            const error = rule(state.context, payload);

            if (error) {
                set({ status: 'BLOCKED', message: error });
                return false;
            }

            set({ status: 'IDLE', message: null });
            return true;
        },
    },
}));
