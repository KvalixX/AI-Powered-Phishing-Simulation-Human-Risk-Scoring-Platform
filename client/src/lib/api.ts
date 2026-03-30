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
    event_timestamp?: string;
}

export interface TrainingModule {
    id: number;
    title: string;
    description: string | null;
    category: string | null;
    duration: string | null;
    difficulty: string | null;
    icon: string | null;
    is_ai_recommended: boolean;
}

export interface Report {
    id: number;
    title: string;
    type: string;
    date: string;
    status: string;
    size: string | null;
    author_id: number | null;
    author?: any;
    file_path: string | null;
}

export interface EmailTemplate {
    id: number;
    name: string;
    subject: string;
    content_html: string;
    category: string | null;
    difficulty_level: "facile" | "moyen" | "difficile" | "expert";
}

export interface Department {
    id: number;
    name: string;
    description: string | null;
    contacts_count?: number;
}

export const api = {
    // Campaigns
    getCampaigns: async (): Promise<Campaign[]> => {
        const { data } = await apiInstance.get("/campaigns");
        return data;
    },
    createCampaign: async (campaign: Partial<Campaign>): Promise<Campaign> => {
        const { data } = await apiInstance.post("/campaigns", campaign);
        return data;
    },
    updateCampaign: async (id: number, campaign: Partial<Campaign>): Promise<Campaign> => {
        const { data } = await apiInstance.put(`/campaigns/${id}`, campaign);
        return data;
    },
    deleteCampaign: async (id: number): Promise<void> => {
        await apiInstance.delete(`/campaigns/${id}`);
    },
    pauseCampaign: async (id: number): Promise<Campaign> => {
        const { data } = await apiInstance.post(`/campaigns/${id}/pause`);
        return data;
    },
    resumeCampaign: async (id: number): Promise<Campaign> => {
        const { data } = await apiInstance.post(`/campaigns/${id}/resume`);
        return data;
    },

    // Contacts
    getContacts: async (): Promise<Contact[]> => {
        const { data } = await apiInstance.get("/contacts");
        return data;
    },
    createContact: async (contact: Partial<Contact>): Promise<Contact> => {
        const { data } = await apiInstance.post("/contacts", contact);
        return data;
    },
    updateContact: async (id: number, contact: Partial<Contact>): Promise<Contact> => {
        const { data } = await apiInstance.put(`/contacts/${id}`, contact);
        return data;
    },
    deleteContact: async (id: number): Promise<void> => {
        await apiInstance.delete(`/contacts/${id}`);
    },

    // Risk Scores
    getRiskScores: async (): Promise<RiskScore[]> => {
        const { data } = await apiInstance.get("/risk-scores");
        return data;
    },

    // Behavioral Events
    getBehavioralEvents: async (): Promise<BehavioralEvent[]> => {
        const { data } = await apiInstance.get("/behavioral-events");
        return data;
    },

    createEvent: async (data: Partial<BehavioralEvent>): Promise<BehavioralEvent> => {
        const { data: responseData } = await apiInstance.post("/behavioral-events", data);
        return responseData;
    },

    // Trainings
    getTrainings: async (): Promise<any[]> => {
        const { data } = await apiInstance.get("/trainings");
        return data;
    },
    createTraining: async (training: any): Promise<any> => {
        const { data } = await apiInstance.post("/trainings", training);
        return data;
    },
    deleteTraining: async (id: number): Promise<void> => {
        await apiInstance.delete(`/trainings/${id}`);
    },

    // Training Modules
    getTrainingModules: async (): Promise<TrainingModule[]> => {
        const { data } = await apiInstance.get("/training-modules");
        return data;
    },
    createTrainingModule: async (module: Partial<TrainingModule>): Promise<TrainingModule> => {
        const { data } = await apiInstance.post("/training-modules", module);
        return data;
    },
    updateTrainingModule: async (id: number, module: Partial<TrainingModule>): Promise<TrainingModule> => {
        const { data } = await apiInstance.put(`/training-modules/${id}`, module);
        return data;
    },
    deleteTrainingModule: async (id: number): Promise<void> => {
        await apiInstance.delete(`/training-modules/${id}`);
    },

    // Reports
    getReports: async (): Promise<Report[]> => {
        const { data } = await apiInstance.get("/reports");
        return data;
    },
    createReport: async (report: Partial<Report>): Promise<Report> => {
        const { data } = await apiInstance.post("/reports", report);
        return data;
    },
    deleteReport: async (id: number): Promise<void> => {
        await apiInstance.delete(`/reports/${id}`);
    },
    downloadReport: async (id: number): Promise<Blob> => {
        const { data } = await apiInstance.get(`/reports/${id}/download`, {
            responseType: 'blob'
        });
        return data;
    },

    // Email Templates
    getEmailTemplates: async (): Promise<EmailTemplate[]> => {
        const { data } = await apiInstance.get("/email-templates");
        return data;
    },
    createEmailTemplate: async (template: Partial<EmailTemplate>): Promise<EmailTemplate> => {
        const { data } = await apiInstance.post("/email-templates", template);
        return data;
    },
    deleteEmailTemplate: async (id: number): Promise<void> => {
        await apiInstance.delete(`/email-templates/${id}`);
    },

    // Departments
    getDepartments: async (): Promise<Department[]> => {
        const { data } = await apiInstance.get("/departments");
        return data;
    },
    createDepartment: async (dept: Partial<Department>): Promise<Department> => {
        const { data } = await apiInstance.post("/departments", dept);
        return data;
    },
    deleteDepartment: async (id: number): Promise<void> => {
        await apiInstance.delete(`/departments/${id}`);
    }
};
