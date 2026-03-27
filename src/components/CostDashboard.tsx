import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PoundSterling, TrendingUp, TrendingDown, Receipt, Users, Briefcase } from 'lucide-react';

const spendBreakdown = [
  { name: 'Events & Fairs', value: 45000 },
  { name: 'University Partnerships', value: 35000 },
  { name: 'Marketing & Ads', value: 25000 },
  { name: 'Swag & Materials', value: 15000 },
  { name: 'Travel & Accommodation', value: 25000 },
];

const universitySpend = [
  { name: 'Newcastle', spend: 35000 },
  { name: 'Durham', spend: 28000 },
  { name: 'Northumbria', spend: 22000 },
  { name: 'Sunderland', spend: 12000 },
  { name: 'Teesside', spend: 8000 },
];

const monthlySpend = [
  { month: 'Sep', spend: 15000 },
  { month: 'Oct', spend: 45000 },
  { month: 'Nov', spend: 25000 },
  { month: 'Dec', spend: 10000 },
  { month: 'Jan', spend: 20000 },
  { month: 'Feb', spend: 30000 },
];

const recentExpenses = [
  { id: 1, item: 'Newcastle Autumn Fair Platinum Sponsorship', category: 'Events', amount: 5000, date: 'Oct 12, 2025' },
  { id: 2, item: 'Durham Tech Talk Catering', category: 'Events', amount: 850, date: 'Oct 20, 2025' },
  { id: 3, item: 'Accenture Branded Hoodies (500x)', category: 'Swag', amount: 12500, date: 'Sep 15, 2025' },
  { id: 4, item: 'LinkedIn Targeted Ads (North East)', category: 'Marketing', amount: 4500, date: 'Nov 01, 2025' },
  { id: 5, item: 'Northumbria Hackathon Prize Fund', category: 'Events', amount: 2000, date: 'Feb 20, 2026' },
];

const COLORS = ['#A100FF', '#7500c0', '#4a007a', '#c44dff', '#e099ff'];

export function CostDashboard() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <PoundSterling size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total YTD Spend</p>
              <h3 className="text-2xl font-bold">£145,000</h3>
              <p className="text-xs text-red-500 flex items-center mt-1">
                <TrendingUp size={12} className="mr-1" /> +8% vs budget
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cost Per Applicant</p>
              <h3 className="text-2xl font-bold">£30.85</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingDown size={12} className="mr-1" /> -12% vs last year
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cost Per Hire</p>
              <h3 className="text-2xl font-bold">£1,250</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingDown size={12} className="mr-1" /> -5% vs last year
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Receipt size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Event Spend</p>
              <h3 className="text-2xl font-bold">£45,000</h3>
              <p className="text-xs text-muted-foreground mt-1">31% of total budget</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Spend Breakdown</CardTitle>
            <CardDescription>Allocation of recruitment budget</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `£${value.toLocaleString()}`} 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spend by University</CardTitle>
            <CardDescription>Total investment per target university in the North East</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={universitySpend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis tickFormatter={(value) => `£${value / 1000}k`} stroke="#888" />
                <Tooltip 
                  formatter={(value: number) => `£${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#ffffff10' }}
                />
                <Bar dataKey="spend" name="Total Spend" fill="#A100FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Spend Trend</CardTitle>
            <CardDescription>Recruitment expenditure over the academic year</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlySpend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis tickFormatter={(value) => `£${value / 1000}k`} stroke="#888" />
                <Tooltip 
                  formatter={(value: number) => `£${value.toLocaleString()}`}
                  contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="spend" name="Spend" stroke="#A100FF" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Latest recruitment transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex flex-col space-y-2 p-3 rounded-lg border border-white/10 bg-card/40 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-sm line-clamp-2">{expense.item}</h4>
                  <span className="font-bold text-primary ml-2">£{expense.amount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="px-2 py-1 rounded-full bg-white/5">{expense.category}</span>
                  <span>{expense.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
