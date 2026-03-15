import { apiRequest } from "./queryClient";

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
        const res = await apiRequest("GET", "/api/v1/campaigns");
        return res.json();
    },

    // Contacts
    getContacts: async (): Promise<Contact[]> => {
        const res = await apiRequest("GET", "/api/v1/contacts");
        return res.json();
    },

    // Risk Scores
    getRiskScores: async (): Promise<RiskScore[]> => {
        const res = await apiRequest("GET", "/api/v1/risk-scores");
        return res.json();
    },

    // Behavioral Events
    createEvent: async (data: Partial<BehavioralEvent>): Promise<BehavioralEvent> => {
        const res = await apiRequest("POST", "/api/v1/behavioral-events", data);
        return res.json();
    }
};
