import type { StatsCard, ProjectData, Author, NotificationData, Message } from './types';

export const statsData: StatsCard[] = [
  {
    title: "Global Click Rate",
    description: "Average across all campaigns",
    lastUpdate: "campaign sent 2 days ago",
    chartData: [12, 10, 8, 9, 7, 5, 4],
    chartLabels: ["M", "T", "W", "T", "F", "S", "S"]
  },
  {
    title: "Avg Reaction Time",
    description: "Time to action (minutes)",
    lastUpdate: "updated 4 min ago",
    chartData: [45, 42, 38, 30, 25, 20, 15, 12, 10, 8, 5, 4],
    chartLabels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },
  {
    title: "Reporting Rate",
    description: "Phishing emails reported",
    lastUpdate: "just updated",
    chartData: [15, 20, 25, 35, 45, 50, 60, 65, 70, 75, 80, 85],
    chartLabels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  }
];

export const ordersOverview = [
  {
    icon: "bell",
    iconColor: "text-red-500",
    title: "Urgent: Password Expiration",
    time: "22 DEC 7:20 PM"
  },
  {
    icon: "package",
    iconColor: "text-orange-500",
    title: "Package Delivery Failed",
    time: "21 DEC 11 PM"
  },
  {
    icon: "credit-card",
    iconColor: "text-blue-500",
    title: "Unusual Login Attempt",
    time: "21 DEC 9:34 PM"
  },
  {
    icon: "plus",
    iconColor: "text-blue-500",
    title: "New Policy Update",
    time: "20 DEC 2:20 AM"
  },
  {
    icon: "shopping-cart",
    iconColor: "text-purple-500",
    title: "Gift Card Reward",
    time: "18 DEC 4:54 AM"
  },
  {
    icon: "bell",
    iconColor: "text-red-500",
    title: "Executive: Mandatory Meeting",
    time: "17 DEC"
  }
];

export const projectsData: ProjectData[] = [
  {
    id: "1",
    name: "Engineering Department",
    company: "High Risk",
    icon: "bug",
    iconColor: "bg-red-500 text-white",
    members: [
      { id: "1", name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", color: "bg-blue-500" },
      { id: "2", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face", color: "bg-green-500" },
      { id: "3", name: "Michael Brown", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", color: "bg-yellow-500" },
      { id: "4", name: "Emma Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face", color: "bg-red-500" }
    ],
    budget: "Score: 85/100",
    completion: 60,
    status: "working"
  },
  {
    id: "2",
    name: "HR Division",
    company: "Medium Risk",
    icon: "chart-line",
    iconColor: "bg-orange-500 text-white",
    members: [
      { id: "5", name: "David Wilson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", color: "bg-purple-500" },
      { id: "6", name: "Jessica Martinez", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face", color: "bg-pink-500" }
    ],
    budget: "Score: 65/100",
    completion: 80,
    status: "working"
  },
  {
    id: "3",
    name: "Finance Team",
    company: "Low Risk",
    icon: "palette",
    iconColor: "bg-green-500 text-white",
    members: [
      { id: "7", name: "Ryan Thompson", avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face", color: "bg-indigo-500" },
      { id: "8", name: "Lisa Garcia", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face", color: "bg-teal-500" }
    ],
    budget: "Score: 92/100",
    completion: 100,
    status: "done"
  },
  {
    id: "4",
    name: "Executive Board",
    company: "High Risk",
    icon: "smartphone",
    iconColor: "bg-red-500 text-white",
    members: [
      { id: "9", name: "James Rodriguez", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", color: "bg-orange-500" },
      { id: "10", name: "Maria Lopez", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face", color: "bg-cyan-500" },
      { id: "11", name: "Kevin Lee", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", color: "bg-lime-500" },
      { id: "12", name: "Anna White", avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face", color: "bg-rose-500" }
    ],
    budget: "Score: 40/100",
    completion: 30,
    status: "working"
  },
  {
    id: "5",
    name: "Sales & Marketing",
    company: "Medium Risk",
    icon: "tag",
    iconColor: "bg-orange-400 text-white",
    members: [
      { id: "13", name: "User 13", avatar: "", color: "bg-gray-800" }
    ],
    budget: "Score: 70/100",
    completion: 65,
    status: "working"
  },
  {
    id: "6",
    name: "IT Support",
    company: "Low Risk",
    icon: "shopping-bag",
    iconColor: "bg-green-600 text-white",
    members: [
      { id: "14", name: "User 14", avatar: "", color: "bg-violet-500" },
      { id: "15", name: "User 15", avatar: "", color: "bg-amber-500" }
    ],
    budget: "Score: 98/100",
    completion: 95,
    status: "working"
  }
];

export const authorsData: Author[] = [
  {
    id: "1",
    name: "John Michael",
    email: "john@creative-tim.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    role: "Manager",
    department: "Organization",
    status: "online",
    employed: "23/04/18"
  },
  {
    id: "2",
    name: "Alexa Liras",
    email: "alexa@creative-tim.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=80&h=80&fit=crop&crop=face",
    role: "Programator",
    department: "Developer",
    status: "offline",
    employed: "11/01/19"
  },
  {
    id: "3",
    name: "Laurent Perrier",
    email: "laurent@creative-tim.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    role: "Executive",
    department: "Projects",
    status: "offline",
    employed: "19/09/17"
  },
  {
    id: "4",
    name: "Michael Levi",
    email: "michael@creative-tim.com",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=face",
    role: "Programator",
    department: "Developer",
    status: "online",
    employed: "24/12/08"
  },
  {
    id: "5",
    name: "Richard Gran",
    email: "richard@creative-tim.com",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
    role: "Manager",
    department: "Executive",
    status: "offline",
    employed: "04/10/21"
  },
  {
    id: "6",
    name: "Miriam Eric",
    email: "miriam@creative-tim.com",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&crop=face",
    role: "Programator",
    department: "Developer",
    status: "offline",
    employed: "14/09/20"
  }
];

export const notificationsData: NotificationData[] = [
  {
    id: "1",
    type: "info",
    title: "New project assigned",
    message: "You have been assigned to the Material XD Version project",
    time: "2 min ago",
    isRead: false
  },
  {
    id: "2",
    type: "success",
    title: "Task completed",
    message: "Fix Platform Errors task has been completed successfully",
    time: "1 hour ago",
    isRead: false
  },
  {
    id: "3",
    type: "warning",
    title: "Budget alert",
    message: "Project budget has exceeded 80% of allocated funds",
    time: "3 hours ago",
    isRead: false
  },
  {
    id: "4",
    type: "info",
    title: "New team member",
    message: "Sophie B. has joined your team",
    time: "1 day ago",
    isRead: false
  },
  {
    id: "5",
    type: "error",
    title: "Server maintenance",
    message: "Scheduled maintenance will occur tonight from 2-4 AM",
    time: "2 days ago",
    isRead: false
  }
];

export const messagesData: Message[] = [
  {
    id: "1",
    sender: "Sophie B.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
    preview: "Hi! I need more information...",
    time: "2 min ago"
  },
  {
    id: "2",
    sender: "Alexander",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=40&h=40&fit=crop&crop=face",
    preview: "Awesome work, can you change...",
    time: "1 hour ago"
  },
  {
    id: "3",
    sender: "Ivanna",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face",
    preview: "About files I can...",
    time: "3 hours ago"
  },
  {
    id: "4",
    sender: "Peterson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    preview: "Have a great afternoon...",
    time: "1 day ago"
  },
  {
    id: "5",
    sender: "Bruce Mars",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&h=40&fit=crop&crop=face",
    preview: "Hi! I need more information...",
    time: "2 days ago"
  }
];
