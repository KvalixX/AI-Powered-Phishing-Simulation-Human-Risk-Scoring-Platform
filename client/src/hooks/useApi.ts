import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Campaign, Contact, RiskScore, BehavioralEvent } from "../lib/api";

export function useCampaigns() {
    return useQuery<Campaign[]>({
        queryKey: ["/api/v1/campaigns"],
        queryFn: api.getCampaigns,
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

export function useCreateBehavioralEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<BehavioralEvent>) => api.createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/v1/behavioral-events"] });
        },
    });
}
