import { useState } from "react";
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
    Bell, 
    Shield, 
    Building, 
    Mail, 
    Lock, 
    Smartphone, 
    Eye, 
    EyeOff,
    Save,
    Trash2,
    Globe,
    Moon,
    Sun,
    Monitor
} from "lucide-react";
import { authApi } from "@/services/api";
import { useAppStore } from "@/store/useAppStore";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
    const { currentUser, setCurrentUser } = useAppStore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        department: currentUser?.department || "",
        role: currentUser?.position || "",
        organization: currentUser?.organization || ""
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        campaignAlerts: true,
        riskScoreChanges: true,
        weeklyReports: true
    });

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const { data } = await authApi.updateProfile({
                ...profileData,
                position: profileData.role // Map role back to position
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

    const handleToggleNotification = (key: keyof typeof notificationSettings) => {
        setNotificationSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="h-full overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-stone-900 dark:text-white">Settings</h1>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Manage your account settings and preferences.</p>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
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
                                            <Button size="sm">Change Avatar</Button>
                                            <Button size="sm" variant="outline">Remove</Button>
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

                    {/* Notification Settings */}
                    <TabsContent value="notifications" className="mt-6">
                        <Card className="border-stone-200 dark:border-stone-800 dark:bg-stone-900">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>Decide which notifications you'd like to receive and where.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider">Channels</h3>
                                    {[
                                        { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive daily digests and important alerts via email.' },
                                        { id: 'pushNotifications', label: 'Push Notifications', desc: 'Get real-time browser notifications for campaign events.' },
                                        { id: 'smsNotifications', label: 'SMS Notifications', desc: 'High-priority security alerts sent directly to your phone.' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-medium">{item.label}</Label>
                                                <p className="text-xs text-stone-500">{item.desc}</p>
                                            </div>
                                            <Switch 
                                                checked={notificationSettings[item.id as keyof typeof notificationSettings]} 
                                                onCheckedChange={() => handleToggleNotification(item.id as keyof typeof notificationSettings)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider">Activity Alerts</h3>
                                    {[
                                        { id: 'campaignAlerts', label: 'Campaign Updates', desc: 'Alert when a new campaign starts or finishes.' },
                                        { id: 'riskScoreChanges', label: 'Risk Score Fluctuations', desc: 'Notify when significant changes occur in human risk scores.' },
                                        { id: 'weeklyReports', label: 'Weekly Summary', desc: 'A comprehensive weekly report of platform activity.' },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                                            <div className="space-y-0.5">
                                                <Label className="text-sm font-medium">{item.label}</Label>
                                                <p className="text-xs text-stone-500">{item.desc}</p>
                                            </div>
                                            <Switch 
                                                checked={notificationSettings[item.id as keyof typeof notificationSettings]} 
                                                onCheckedChange={() => handleToggleNotification(item.id as keyof typeof notificationSettings)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 p-4">
                                <Button className="ml-auto bg-blue-600 hover:bg-blue-700">Save Preferences</Button>
                            </CardFooter>
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
                                    <CardDescription>Secure your account with a strong password and two-factor authentication.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-pass">Current Password</Label>
                                            <div className="relative">
                                                <Input id="current-pass" type={showPassword ? "text" : "password"} placeholder="••••••••" />
                                                <button 
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-start-1">
                                            <Label htmlFor="new-pass">New Password</Label>
                                            <Input id="new-pass" type="password" placeholder="••••••••" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-pass">Confirm New Password</Label>
                                            <Input id="confirm-pass" type="password" placeholder="••••••••" />
                                        </div>
                                    </div>
                                    <Button className="bg-amber-600 hover:bg-amber-700">Update Password</Button>

                                    <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="space-y-0.5">
                                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                                    <Smartphone className="w-4 h-4 text-stone-500" />
                                                    Two-Factor Authentication (2FA)
                                                </h4>
                                                <p className="text-xs text-stone-500">Add an extra layer of security to your account.</p>
                                            </div>
                                            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Disabled</Badge>
                                        </div>
                                        <Button variant="outline">Enable 2FA</Button>
                                    </div>
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
                                    <Button variant="destructive">Delete Account</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="org-name">Organization Name</Label>
                                        <Input 
                                            id="org-name" 
                                            value={profileData.organization}
                                            onChange={e => setProfileData(p => ({ ...p, organization: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="org-domain">Primary Domain</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                            <Input id="org-domain" placeholder="example.com" className="pl-9" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                                    <h3 className="text-sm font-semibold text-stone-900 dark:text-white uppercase tracking-wider">Appearance</h3>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-800">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm font-medium">Theme Preference</Label>
                                            <p className="text-xs text-stone-500">Switch between light, dark, and system themes.</p>
                                        </div>
                                        <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-md">
                                            <button className="p-1 px-3 rounded text-xs flex items-center gap-1 bg-white dark:bg-stone-700 shadow-sm"><Sun className="w-3 h-3" /> Light</button>
                                            <button className="p-1 px-3 rounded text-xs flex items-center gap-1 text-stone-500 hover:text-stone-700"><Moon className="w-3 h-3" /> Dark</button>
                                            <button className="p-1 px-3 rounded text-xs flex items-center gap-1 text-stone-500 hover:text-stone-700"><Monitor className="w-3 h-3" /> System</button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 p-4">
                                <Button className="ml-auto bg-purple-600 hover:bg-purple-700">Save Org Details</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
