import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
    User, 
    Shield, 
    Building, 
    Mail, 
    Lock, 
    Smartphone, 
    Eye, 
    EyeOff,
    Save,
    Trash2
} from "lucide-react";
import { authApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Settings() {
    const { currentUser, setCurrentUser } = useAppStore();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [profileData, setProfileData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        department: currentUser?.department || "",
        role: currentUser?.position || "",
        organization: currentUser?.organization || ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);



    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const { data } = await authApi.updateProfile({
                ...profileData,
                position: profileData.role
            });
            
            setCurrentUser(data.user);
            
            toast({
                title: "Profile updated",
                description: data.message || "Your profile information has been successfully updated."
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update profile.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await authApi.updateProfile({
                current_password: passwordData.currentPassword,
                password: passwordData.newPassword,
                password_confirmation: passwordData.confirmPassword
            });
            
            toast({ title: "Success", description: "Password updated successfully." });
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to update password.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrgSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await authApi.updateProfile({
                organization: profileData.organization
            });
            setCurrentUser(data.user);
            toast({ title: "Success", description: "Organization details updated." });
        } catch (error: any) {
            toast({ title: "Error", description: "Failed to update organization.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result as string;
                setIsLoading(true);
                try {
                    const { data } = await authApi.updateProfile({ avatar: base64String });
                    setCurrentUser(data.user);
                    toast({ title: "Success", description: "Avatar updated." });
                } catch (error: any) {
                    toast({ 
                        title: "Error", 
                        description: error.response?.data?.message || "Failed to upload avatar.", 
                        variant: "destructive" 
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveAvatar = async () => {
        setIsLoading(true);
        try {
            const { data } = await authApi.updateProfile({ avatar: null });
            setCurrentUser(data.user);
            toast({ title: "Success", description: "Avatar removed." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to remove avatar.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await authApi.deleteAccount();
            toast({ title: "Account Deleted", description: "Your account has been successfully removed." });
            // The interceptor will handle token removal, but let's be explicit
            localStorage.removeItem("auth_token");
            setCurrentUser(null);
            navigate("/sign-in");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to delete account.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="h-full overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Manage your account settings and preferences.</p>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="organization">Organization</TabsTrigger>
                    </TabsList>

                    {/* Profile Settings */}
                    <TabsContent value="profile" className="mt-6">
                        <Card className="border-stone-200 dark:border-stone-800 dark:bg-stone-900">
                            <CardHeader>
                                <CardTitle className="text-lg">Profile Information</CardTitle>
                                <CardDescription>Update your personal details and how others see you on the platform.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6 pb-6 border-b border-stone-100 dark:border-stone-800">
                                    <Avatar className="w-20 h-20 ring-4 ring-stone-100 dark:ring-stone-800">
                                        <AvatarImage src={currentUser?.avatar} />
                                        <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                                            {currentUser?.name?.split(" ").map(n => n[0]).join("") ?? "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                            />
                                            <Button size="sm" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                                                Change Avatar
                                            </Button>
                                            <Button size="sm" variant="outline" onClick={handleRemoveAvatar} disabled={isLoading}>
                                                Remove
                                            </Button>
                                        </div>
                                        <p className="text-xs text-stone-500">JPG, GIF or PNG. Max size of 2MB.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                            <Input 
                                                id="name" 
                                                value={profileData.name}
                                                onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                                                className="pl-9" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                            <Input 
                                                id="email" 
                                                type="email" 
                                                value={profileData.email}
                                                onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))}
                                                className="pl-9" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department">Department</Label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                            <Input 
                                                id="department" 
                                                value={profileData.department}
                                                onChange={e => setProfileData(p => ({ ...p, department: e.target.value }))}
                                                className="pl-9" 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Job Title</Label>
                                        <Input 
                                            id="role" 
                                            value={profileData.role}
                                            onChange={e => setProfileData(p => ({ ...p, role: e.target.value }))}
                                        />
                                    </div>
                                    <div className="md:col-span-2 pt-4">
                                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                            {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>



                    {/* Security Settings */}
                    <TabsContent value="security" className="mt-6">
                        <div className="grid gap-6">
                            <Card className="border-stone-200 dark:border-stone-800 dark:bg-stone-900">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-amber-600" />
                                        Password & Authentication
                                    </CardTitle>
                                    <CardDescription>Secure your account with a strong password.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="current-pass">Current Password</Label>
                                                <div className="relative">
                                                    <Input 
                                                        id="current-pass" 
                                                        type={showPassword ? "text" : "password"} 
                                                        placeholder="••••••••" 
                                                        value={passwordData.currentPassword}
                                                        onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                                                        required
                                                    />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-start-1">
                                                <Label htmlFor="new-pass">New Password</Label>
                                                <Input 
                                                    id="new-pass" 
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    value={passwordData.newPassword}
                                                    onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirm-pass">Confirm New Password</Label>
                                                <Input 
                                                    id="confirm-pass" 
                                                    type="password" 
                                                    placeholder="••••••••" 
                                                    value={passwordData.confirmPassword}
                                                    onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <Button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700">
                                            {isLoading ? "Updating..." : "Update Password"}
                                        </Button>
                                    </form>


                                </CardContent>
                            </Card>

                            <Card className="border-red-200 dark:border-red-900 bg-red-50/20 dark:bg-red-950/10">
                                <CardHeader>
                                    <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                                        <Trash2 className="w-5 h-5" />
                                        Danger Zone
                                    </CardTitle>
                                    <CardDescription>Permanent actions that cannot be undone.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 font-medium">
                                        Deleting your account will remove all your data, progress, and history. This action is irreversible.
                                    </p>
                                    <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>Delete Account</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Delete Account Confirmation */}
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDeleteAccount}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Deleting..." : "Permanently Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Organization Settings */}
                    <TabsContent value="organization" className="mt-6">
                        <Card className="border-stone-200 dark:border-stone-800 dark:bg-stone-900">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Building className="w-5 h-5 text-purple-600" />
                                    Organization Profile
                                </CardTitle>
                                <CardDescription>Manage your organization's identity and global settings.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <form onSubmit={handleOrgSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="org-name">Organization Name</Label>
                                            <Input 
                                                id="org-name" 
                                                value={profileData.organization}
                                                onChange={e => setProfileData(p => ({ ...p, organization: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                                        {isLoading ? "Saving..." : "Save Org Details"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
