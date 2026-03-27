import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NorthEastMap } from './Map';
import { CibylRanking } from './CibylRanking';
import { CostDashboard } from './CostDashboard';
import { RetentionStats } from './RetentionStats';
import { Users, GraduationCap, Briefcase, MapPin, TrendingUp, CalendarDays, Clock, QrCode, Mail, Phone, UserCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Mock Data
const degreeData = [
  { name: '1st Class', value: 35 },
  { name: '2:1', value: 45 },
  { name: '2:2', value: 15 },
  { name: '3rd/Pass', value: 5 },
];

const upcomingEvents = [
  { title: 'Accenture Hackathon', location: 'Newcastle University', date: 'Oct 15, 2026', time: '09:00 AM' },
  { title: 'Autumn Careers Fair', location: 'Newcastle University', date: 'Oct 18, 2026', time: '10:00 AM' },
  { title: 'Tech Careers Talk', location: 'Durham Teaching and Learning Centre', date: 'Oct 22, 2026', time: '02:00 PM' },
  { title: 'Durhack 2026', location: 'Durham University', date: 'Nov 05, 2026', time: '08:00 AM' },
];

const employeeOriginData = [
  { name: 'Newcastle Univ', value: 35 },
  { name: 'Northumbria Univ', value: 25 },
  { name: 'Durham Univ', value: 20 },
  { name: 'Sunderland Univ', value: 10 },
  { name: 'Other UK', value: 10 },
];

const previousEvents = [
  { title: 'Newcastle Spring Fair', date: 'Mar 10, 2026', scans: 342, delta: 45 },
  { title: 'Northumbria Hackathon', date: 'Feb 22, 2026', scans: 256, delta: 89 },
  { title: 'Durham Tech Talk', date: 'Feb 15, 2026', scans: 128, delta: -12 },
];

const universityContacts = [
  { id: 'newcastle', name: 'Newcastle University', contact: 'Jane Doe', role: 'Head of Employer Engagement', email: 'jane.doe@newcastle.ac.uk', phone: '+44 191 208 6000' },
  { id: 'durham', name: 'Durham University', contact: 'John Smith', role: 'Careers Advisor', email: 'john.smith@durham.ac.uk', phone: '+44 191 334 2000' },
  { id: 'northumbria', name: 'Northumbria University', contact: 'Sarah Lee', role: 'Placements Coordinator', email: 'sarah.lee@northumbria.ac.uk', phone: '+44 191 227 4000' },
  { id: 'sunderland', name: 'University of Sunderland', contact: 'Mike Brown', role: 'Industry Links Manager', email: 'mike.brown@sunderland.ac.uk', phone: '+44 191 515 2000' },
  { id: 'teesside', name: 'Teesside University', contact: 'Emily White', role: 'Graduate Outcomes Officer', email: 'emily.white@tees.ac.uk', phone: '+44 164 221 8000' },
];

const currentOpenings = [
  { id: 1, title: 'Technology Graduate Programme', type: 'Grad Scheme', applicants: 1245, status: 'Open' },
  { id: 2, title: 'Consulting Graduate Programme', type: 'Grad Scheme', applicants: 2103, status: 'Open' },
  { id: 3, title: 'Software Engineering Degree Apprenticeship', type: 'Apprenticeship', applicants: 850, status: 'Open' },
  { id: 4, title: 'Data Analytics Apprenticeship', type: 'Apprenticeship', applicants: 620, status: 'Closing Soon' },
  { id: 5, title: 'Summer Internship Programme 2027', type: 'Internship', applicants: 430, status: 'Open' },
];

const jobUniversityMetrics: Record<number, { uni: string, applicants: number }[]> = {
  1: [
    { uni: 'University of Manchester', applicants: 320 },
    { uni: 'University of Leeds', applicants: 215 },
    { uni: 'Newcastle University', applicants: 180 },
    { uni: 'Durham University', applicants: 150 },
    { uni: 'University of Edinburgh', applicants: 120 },
    { uni: 'Other', applicants: 260 },
  ],
  2: [
    { uni: 'LSE', applicants: 450 },
    { uni: 'UCL', applicants: 380 },
    { uni: 'University of Warwick', applicants: 310 },
    { uni: 'University of Bath', applicants: 290 },
    { uni: 'Durham University', applicants: 210 },
    { uni: 'Other', applicants: 463 },
  ],
  3: [
    { uni: 'Newcastle College', applicants: 250 },
    { uni: 'Gateshead College', applicants: 180 },
    { uni: 'Sunderland College', applicants: 150 },
    { uni: 'Middlesbrough College', applicants: 120 },
    { uni: 'Other', applicants: 150 },
  ],
  4: [
    { uni: 'Leeds City College', applicants: 180 },
    { uni: 'Manchester College', applicants: 150 },
    { uni: 'Newcastle College', applicants: 120 },
    { uni: 'Other', applicants: 170 },
  ],
  5: [
    { uni: 'Newcastle University', applicants: 120 },
    { uni: 'Durham University', applicants: 90 },
    { uni: 'Northumbria University', applicants: 80 },
    { uni: 'University of York', applicants: 60 },
    { uni: 'Other', applicants: 80 },
  ],
};

const COLORS = ['#A100FF', '#7500c0', '#4a007a', '#c44dff', '#e099ff'];

export function Dashboard() {
  const [selectedUni, setSelectedUni] = useState(universityContacts[0].id);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('insights');

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background flex flex-col text-foreground">
      {/* Header */}
      <header className="bg-card border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 163.4 43" className="h-6 w-auto" xmlns="http://www.w3.org/2000/svg">
              <polygon fill="#A100FF" points="95.1,4.9 95.1,0 111.2,6.5 111.2,10.5 95.1,17 95.1,12 104.5,8.5" />
              <path fill="currentColor" d="M 6.2,43 C 2.8,43 0,41.3 0,37.5 v -0.2 c 0,-4.6 4,-6.2 8.9,-6.2 h 2.3 v -0.9 c 0,-1.9 -0.8,-3 -2.8,-3 -1.8,0 -2.7,1 -2.8,2.4 h -5 c 0.4,-4.2 3.7,-6.2 8.1,-6.2 4.5,0 7.8,1.9 7.8,6.6 V 42.6 H 11.4 V 40.4 C 10.4,41.8 8.7,43 6.2,43 Z m 5,-6.6 V 34.6 H 9.1 c -2.6,0 -3.9,0.7 -3.9,2.4 v 0.2 c 0,1.3 0.8,2.2 2.6,2.2 1.8,-0.1 3.4,-1.1 3.4,-3 z M 28.4,43 c -5.2,0 -9,-3.2 -9,-9.6 v -0.3 c 0,-6.4 4,-9.8 9,-9.8 4.3,0 7.8,2.2 8.2,7.1 h -5 c -0.3,-1.8 -1.3,-3 -3.1,-3 -2.2,0 -3.8,1.8 -3.8,5.5 v 0.6 c 0,3.8 1.4,5.5 3.8,5.5 1.8,0 3.1,-1.3 3.4,-3.4 h 4.8 C 36.4,40 33.5,43 28.4,43 Z M 48,43 c -5.2,0 -9,-3.2 -9,-9.6 v -0.3 c 0,-6.4 4,-9.8 9,-9.8 4.3,0 7.8,2.2 8.2,7.1 h -5 c -0.3,-1.8 -1.3,-3 -3.1,-3 -2.2,0 -3.8,1.8 -3.8,5.5 v 0.6 c 0,3.8 1.4,5.5 3.8,5.5 1.8,0 3.1,-1.3 3.4,-3.4 h 4.8 C 56,40 53.1,43 48,43 Z m 19.7,0 c -5.4,0 -9.1,-3.2 -9.1,-9.5 v -0.4 c 0,-6.3 3.9,-9.8 9,-9.8 4.7,0 8.6,2.6 8.6,8.9 v 2.3 H 63.9 c 0.2,3.4 1.7,4.7 3.9,4.7 2,0 3.1,-1.1 3.5,-2.4 h 4.9 C 75.6,40.3 72.6,43 67.7,43 Z M 64,31 h 7 c -0.1,-2.8 -1.4,-4 -3.5,-4 -1.6,0.1 -3.1,1 -3.5,4 z m 15.4,-7.2 h 5.3 v 2.8 c 0.9,-1.8 2.8,-3.2 5.7,-3.2 3.4,0 5.7,2.1 5.7,6.6 V 42.6 H 90.8 V 30.8 c 0,-2.2 -0.9,-3.2 -2.8,-3.2 -1.8,0 -3.3,1.1 -3.3,3.5 v 11.5 h -5.3 z m 26.4,-5.7 v 5.7 h 3.6 v 3.9 h -3.6 v 8.9 c 0,1.4 0.6,2.1 1.9,2.1 0.8,0 1.3,-0.1 1.8,-0.3 v 4.1 c -0.6,0.2 -1.7,0.4 -3,0.4 -4.1,0 -6,-1.9 -6,-5.7 v -9.5 h -2.2 v -3.9 h 2.2 v -3.5 z m 23.4,24.5 H 124 v -2.8 c -0.9,1.8 -2.7,3.2 -5.5,3.2 -3.4,0 -5.9,-2.1 -5.9,-6.5 V 23.8 h 5.3 v 12 c 0,2.2 0.9,3.2 2.7,3.2 1.8,0 3.3,-1.2 3.3,-3.5 V 23.8 h 5.3 z m 3.9,-18.8 h 5.3 v 3.5 c 1.1,-2.5 2.9,-3.7 5.7,-3.7 v 5.2 c -3.6,0 -5.7,1.1 -5.7,4.2 v 9.7 h -5.3 z M 154.8,43 c -5.4,0 -9.1,-3.2 -9.1,-9.5 v -0.4 c 0,-6.3 3.9,-9.8 9,-9.8 4.7,0 8.6,2.6 8.6,8.9 v 2.3 h -12.2 c 0.2,3.4 1.7,4.7 3.9,4.7 2,0 3.1,-1.1 3.5,-2.4 h 4.9 c -0.8,3.5 -3.7,6.2 -8.6,6.2 z M 151,31 h 7.1 c -0.1,-2.8 -1.4,-4 -3.5,-4 -1.6,0.1 -3.1,1 -3.6,4 z" />
            </svg>
            <span className="ml-4 text-sm font-medium text-muted-foreground border-l pl-4 hidden sm:block">
              Graduate Recruitment
            </span>
            </div>
            <nav className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'insights' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
              >
                Insights
              </button>
              <button 
                onClick={() => setActiveTab('costs')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'costs' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
              >
                Costs
              </button>
              <button 
                onClick={() => setActiveTab('network')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'network' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'}`}
              >
                Retention Stats
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">North East UK Region</div>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              HR
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {activeTab === 'costs' ? (
          <CostDashboard />
        ) : activeTab === 'network' ? (
          <RetentionStats />
        ) : (
          <div className="space-y-8">
            {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                <h3 className="text-2xl font-bold">4,700</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" /> +12% vs last year
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Regional Retention</p>
                <h3 className="text-2xl font-bold">42%</h3>
                <p className="text-xs text-muted-foreground mt-1">Stayed in North East</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Direct Employment</p>
                <h3 className="text-2xl font-bold">78%</h3>
                <p className="text-xs text-muted-foreground mt-1">Secured job post-grad</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accenture Offers</p>
                <h3 className="text-2xl font-bold">12%</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp size={12} className="mr-1" /> +2% vs last year
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Openings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight">Current Openings (UK)</h2>
            <span className="text-sm text-muted-foreground">Live data from Accenture Careers</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currentOpenings.map(job => (
              <Card 
                key={job.id} 
                className="bg-card/60 border-white/10 hover:bg-card/80 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary">
                      {job.type}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${job.status === 'Closing Soon' ? 'text-orange-400' : 'text-green-400'}`}>
                      {job.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm leading-tight h-10">{job.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span>{job.applicants.toLocaleString()} applied</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Degree Classifications (Offer Holders)</CardTitle>
              <CardDescription>Breakdown of degree results for students who received an Accenture offer</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={degreeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {degreeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Applicant Heatmap: North East</CardTitle>
              <CardDescription>Concentration of applicants by university location</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center p-0">
              <NorthEastMap />
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Accenture recruitment events in the region</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, idx) => (
                <div key={idx} className="flex flex-col space-y-2 p-3 rounded-lg border border-white/10 bg-card/40 hover:bg-muted/50 transition-colors">
                  <h4 className="font-semibold text-sm">{event.title}</h4>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <MapPin size={12} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground gap-4">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3: Cibyl Ranking */}
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle>Cibyl Top UK graduate employers ranking</CardTitle>
                <CardDescription>Top UK Graduate Employers: 2024 vs 2025 Rankings</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-500">-56</div>
                <div className="text-xs text-muted-foreground">ranks from last year</div>
              </div>
            </CardHeader>
            <CardContent className="h-[600px]">
              <CibylRanking />
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 4: Employee Origins */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Employee Origins</CardTitle>
              <CardDescription>Universities where current Newcastle employees graduated from</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={employeeOriginData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {employeeOriginData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 5: Events, Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Previous Events */}
          <Card>
            <CardHeader>
              <CardTitle>Previous Events (QR Scans)</CardTitle>
              <CardDescription>Application form scans from recent events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previousEvents.map((event, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-card/40 hover:bg-muted/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-sm">{event.title}</h4>
                    <div className="text-xs text-muted-foreground">{event.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 font-bold">
                      <QrCode size={14} className="text-primary" />
                      {event.scans}
                    </div>
                    <div className={`text-xs ${event.delta > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {event.delta > 0 ? '+' : ''}{event.delta} from last event
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* University Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>University Contacts</CardTitle>
              <CardDescription>Key contacts for event setup</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <select 
                className="w-full p-2 rounded-md border border-white/10 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                value={selectedUni}
                onChange={(e) => setSelectedUni(e.target.value)}
              >
                {universityContacts.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.name}</option>
                ))}
              </select>
              
              {(() => {
                const contact = universityContacts.find(u => u.id === selectedUni);
                if (!contact) return null;
                return (
                  <div className="p-4 rounded-lg border border-white/10 bg-card/40 space-y-3 mt-4">
                    <div className="flex items-center gap-2">
                      <UserCircle className="text-primary" size={18} />
                      <div>
                        <div className="font-semibold text-sm">{contact.contact}</div>
                        <div className="text-xs text-muted-foreground">{contact.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="text-muted-foreground" size={14} />
                      <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="text-muted-foreground" size={14} />
                      <span>{contact.phone}</span>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
        </div>
        )}

      </main>

      {/* Modal for Job Metrics */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-start bg-gradient-to-br from-primary/20 to-transparent">
                <div>
                  <div className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/20 text-primary inline-block mb-2">
                    {selectedJob.type}
                  </div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-muted-foreground mt-1">Applicant University Breakdown</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-5">
                  {jobUniversityMetrics[selectedJob.id]?.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{metric.uni}</span>
                          <span className="text-sm font-bold">{metric.applicants.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(metric.applicants / selectedJob.applicants) * 100}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                            className="bg-primary h-full rounded-full" 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
