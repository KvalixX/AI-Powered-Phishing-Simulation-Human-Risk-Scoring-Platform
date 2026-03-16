import apiInstance from "@/services/api";

export interface Contact {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    department: string | null;
    position: string | null;
    seniority: string | null;
    language: string;
    risk_score?: RiskScore;
}

export interface RiskScore {
    id: number;
    contact_id: number;
    score: number;
    level: "faible" | "moyen" | "élevé" | "critique";
    confidence: number;
}

export interface Campaign {
    id: number;
    name: string;
    description: string | null;
    status: "draft" | "active" | "scheduled" | "completed" | "paused";
    difficulty_level: "facile" | "moyen" | "difficile" | "expert";
    started_at: string | null;
    ended_at: string | null;
    rl_enabled: boolean;
    metrics?: CampaignMetrics;
}

export interface CampaignMetrics {
    id: number;
    campaign_id: number;
    ctr: number;
    precision: number;
    auc_roc: number;
    statistical_tests?: any;
}

export interface BehavioralEvent {
    id: number;
    contact_id: number;
    campaign_id: number;
    event_type: "click" | "submission" | "report" | "ignore";
    reaction_time: number | null;
}

export const api = {
    // Campaigns
    getCampaigns: async (): Promise<Campaign[]> => {
        const { data } = await apiInstance.get("/campaigns");
        return data;
    },

    // Contacts
    getContacts: async (): Promise<Contact[]> => {
        const { data } = await apiInstance.get("/contacts");
        return data;
    },

    // Risk Scores
    getRiskScores: async (): Promise<RiskScore[]> => {
        const { data } = await apiInstance.get("/risk-scores");
        return data;
    },

    // Behavioral Events
    createEvent: async (data: Partial<BehavioralEvent>): Promise<BehavioralEvent> => {
        const { data: responseData } = await apiInstance.post("/behavioral-events", data);
        return responseData;
    }
};
