import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Campaign, Contact, RiskScore, BehavioralEvent, TrainingModule, Report, EmailTemplate, Department, GlobalMetrics } from "../lib/api";

export function useCampaigns() {
    return useQuery<Campaign[]>({
        queryKey: ["/api/v1/campaigns"],
        queryFn: api.getCampaigns,
    });
}

export function useCreateCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Campaign>) => api.createCampaign(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/campaigns"] });
        },
    });
}

export function useUpdateCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Campaign> }) => api.updateCampaign(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/campaigns"] });
        },
    });
}

export function useDeleteCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.deleteCampaign(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/campaigns"] });
        },
    });
}

export function usePauseCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.pauseCampaign(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/campaigns"] });
        },
    });
}

export function useResumeCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.resumeCampaign(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/campaigns"] });
        },
    });
}

export function useLaunchCampaign() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.launchCampaign(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/campaigns"] });
            queryClient.invalidateQueries({ queryKey: ["/api/v1/analytics/global-metrics"] });
        },
    });
}

export function useContacts() {
    return useQuery<Contact[]>({
        queryKey: ["/api/v1/contacts"],
        queryFn: api.getContacts,
    });
}

export function useRiskScores() {
    return useQuery<RiskScore[]>({
        queryKey: ["/api/v1/risk-scores"],
        queryFn: api.getRiskScores,
    });
}

export function useBehavioralEvents() {
    return useQuery<BehavioralEvent[]>({
        queryKey: ["/api/v1/behavioral-events"],
        queryFn: api.getBehavioralEvents,
    });
}

export function useTrainings() {
    return useQuery<any[]>({
        queryKey: ["/api/v1/trainings"],
        queryFn: api.getTrainings,
        refetchOnWindowFocus: true,
        refetchOnMount: "always",
    });
}

export function useCreateTraining() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => api.createTraining(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/trainings"] });
        },
    });
}

export function useDeleteTraining() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.deleteTraining(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/trainings"] });
        },
    });
}

export function useCreateBehavioralEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<BehavioralEvent>) => api.createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/behavioral-events"] });
        },
    });
}

export function useCreateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Contact>) => api.createContact(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/contacts"] });
        },
    });
}

export function useUpdateContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Contact> }) => api.updateContact(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/contacts"] });
        },
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.deleteContact(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/contacts"] });
        },
    });
}

export function useImportContacts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => api.importContacts(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/contacts"] });
        },
    });
}

// Training Modules
export function useTrainingModules() {
    return useQuery<TrainingModule[]>({
        queryKey: ["/api/v1/training-modules"],
        queryFn: api.getTrainingModules,
    });
}

export function useCreateTrainingModule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<TrainingModule>) => api.createTrainingModule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/training-modules"] });
        },
    });
}

// Reports
export function useReports() {
    return useQuery<Report[]>({
        queryKey: ["/api/v1/reports"],
        queryFn: api.getReports,
    });
}

export function useCreateReport() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Report>) => api.createReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/reports"] });
        },
    });
}
export function useDownloadReport() {
    return useMutation({
        mutationFn: (id: number) => api.downloadReport(id),
        onSuccess: (data, id) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
    });
}

// Email Templates
export function useEmailTemplates() {
    return useQuery<EmailTemplate[]>({
        queryKey: ["/api/v1/email-templates"],
        queryFn: api.getEmailTemplates,
    });
}

// Departments
export function useDepartments() {
    return useQuery<Department[]>({
        queryKey: ["/api/v1/departments"],
        queryFn: api.getDepartments,
    });
}

export function useCreateDepartment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Department>) => api.createDepartment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/departments"] });
        },
    });
}

// ─── Dashboard Hooks ─────────────────────────────────────────────────────────
export function useDashboardMetrics() {
    return useQuery({
        queryKey: ["/api/v1/dashboard/metrics"],
        queryFn: api.getDashboardMetrics,
    });
}

export function useDashboardRiskTrend() {
    return useQuery({
        queryKey: ["/api/v1/dashboard/risk-trend"],
        queryFn: api.getDashboardRiskTrend,
    });
}

export function useDashboardRecentCampaigns() {
    return useQuery({
        queryKey: ["/api/v1/dashboard/recent-campaigns"],
        queryFn: api.getDashboardRecentCampaigns,
    });
}

export function useDashboardAiInsights() {
    return useQuery({
        queryKey: ["/api/v1/dashboard/ai-insights"],
        queryFn: api.getDashboardAiInsights,
    });
}

// ─── Users Hooks ─────────────────────────────────────────────────────────────
export function useUsers(params?: { department?: string; riskLevel?: string; search?: string }) {
    return useQuery({
        queryKey: ["/api/v1/users", params],
        queryFn: () => api.getUsers(params),
    });
}

export function useUserById(id: number) {
    return useQuery({
        queryKey: ["/api/v1/users", id],
        queryFn: () => api.getUserById(id),
        enabled: !!id,
    });
}

export function useUserRiskHistory(id: number) {
    return useQuery({
        queryKey: ["/api/v1/users", id, "risk-history"],
        queryFn: () => api.getUserRiskHistory(id),
        enabled: !!id,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => api.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/users"] });
        },
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => api.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/users"] });
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => api.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/users"] });
        },
    });
}

export function useAssignUserTraining() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, moduleId }: { userId: number; moduleId: number }) =>
            api.assignUserTraining(userId, moduleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/users"] });
            queryClient.invalidateQueries({ queryKey: ["/api/v1/trainings"] });
        },
    });
}

// ─── Analytics Hooks ─────────────────────────────────────────────────────────
export function useClickRateTrend() {
    return useQuery({
        queryKey: ["/api/v1/analytics/click-rate-trend"],
        queryFn: api.getClickRateTrend,
    });
}

export function useRiskDistribution() {
    return useQuery({
        queryKey: ["/api/v1/analytics/risk-distribution"],
        queryFn: api.getRiskDistribution,
    });
}

export function useCampaignPerformance() {
    return useQuery({
        queryKey: ["/api/v1/analytics/campaign-performance"],
        queryFn: api.getCampaignPerformance,
    });
}

export function useBehaviorHeatmap() {
    return useQuery({
        queryKey: ["/api/v1/analytics/behavior-heatmap"],
        queryFn: api.getBehaviorHeatmap,
    });
}

export function useTrainingEffectiveness() {
    return useQuery({
        queryKey: ["/api/v1/analytics/training-effectiveness"],
        queryFn: api.getTrainingEffectiveness,
    });
}

export function useDepartmentRisk() {
    return useQuery({
        queryKey: ["/api/v1/analytics/department-risk"],
        queryFn: api.getDepartmentRisk,
    });
}

export function useGlobalMetrics() {
    return useQuery<GlobalMetrics>({
        queryKey: ["/api/v1/analytics/global-metrics"],
        queryFn: api.getGlobalMetrics,
    });
}

export function useGeneratePhishingTemplate() {
    return useMutation({
        mutationFn: (params: { 
            contact_id: number; 
            context?: string; 
            difficulty: string;
            campaign_name?: string;
            attack_type?: string;
        }) => api.generatePhishingTemplate(params)
    });
}
