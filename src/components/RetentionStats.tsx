import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Network, Users, BookOpen, ArrowRightLeft, MapPin, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { GeographicFlowMap } from './GeographicFlowMap';
import { WordCloud } from './WordCloud';

// --- Mock Data ---
const wordCloudData = [
  { text: 'Great culture', value: 10 },
  { text: 'Supportive environment', value: 8 },
  { text: 'Challenging projects', value: 7 },
  { text: 'Fast-paced', value: 6 },
  { text: 'Learning opportunities', value: 9 },
  { text: 'Networking', value: 5 },
  { text: 'Work-life balance', value: 4 },
  { text: 'Mentorship', value: 8 },
  { text: 'Career progression', value: 9 },
  { text: 'Innovative', value: 7 },
  { text: 'Inclusive', value: 6 },
  { text: 'Global reach', value: 5 },
  { text: 'Impactful', value: 4 },
  { text: 'Collaborative', value: 8 },
  { text: 'Dynamic', value: 6 },
];

const negativeWordCloudData = [
  { text: 'Long hours', value: 10 },
  { text: 'High pressure', value: 8 },
  { text: 'Complex systems', value: 7 },
  { text: 'Bureaucracy', value: 6 },
  { text: 'Steep learning curve', value: 9 },
  { text: 'Commute', value: 5 },
  { text: 'Slow processes', value: 4 },
  { text: 'Heavy workload', value: 8 },
  { text: 'Corporate structure', value: 6 },
];

const retentionData = [
  { name: 'Newcastle', retained: 45, left: 55 },
  { name: 'Durham', retained: 30, left: 70 },
  { name: 'Northumbria', retained: 50, left: 50 },
  { name: 'Sunderland', retained: 60, left: 40 },
  { name: 'Teesside', retained: 55, left: 45 },
];

const newcastleRetentionData = [
  { year: '2021', rate: 65 },
  { year: '2022', rate: 68 },
  { year: '2023', rate: 72 },
  { year: '2024', rate: 75 },
  { year: '2025', rate: 82 },
];

const transferData = [
  { destination: 'London', count: 15 },
  { destination: 'Manchester', count: 8 },
  { destination: 'Edinburgh', count: 5 },
  { destination: 'Birmingham', count: 4 },
  { destination: 'Leeds', count: 3 },
];

const roles = [
  { id: 'DevOps', group: 'role', radius: 35 },
  { id: 'QA', group: 'role', radius: 30 },
  { id: 'Software Engineering', group: 'role', radius: 40 },
  { id: 'Data Science', group: 'role', radius: 35 },
  { id: 'UX Design', group: 'role', radius: 30 },
  { id: 'Product Management', group: 'role', radius: 35 },
  { id: 'Cyber Security', group: 'role', radius: 30 },
];

const peopleBase = [
  { id: 'Alice', group: 'person', radius: 10, role: 'DevOps', learning: 'Cyber Security', nextRole: 'Security Architect', skills: 'AWS Security, Pen Testing', prob: '85%', loc: (m: number) => 'Newcastle' },
  { id: 'Bob', group: 'person', radius: 10, role: 'QA', learning: 'Software Engineering', nextRole: 'SDET', skills: 'Cypress, CI/CD', prob: '90%', loc: (m: number) => 'Newcastle' },
  { id: 'Charlie', group: 'person', radius: 10, role: 'Software Engineering', learning: 'DevOps', nextRole: 'Platform Engineer', skills: 'Kubernetes, Terraform', prob: '75%', loc: (m: number) => m >= 12 ? 'London' : 'Newcastle' },
  { id: 'Diana', group: 'person', radius: 10, role: 'Data Science', learning: 'Product Management', nextRole: 'Data Product Manager', skills: 'Agile, Stakeholder Mgmt', prob: '60%', loc: (m: number) => 'Newcastle' },
  { id: 'Eve', group: 'person', radius: 10, role: 'UX Design', learning: 'Software Engineering', nextRole: 'Frontend Engineer', skills: 'React, TypeScript', prob: '80%', loc: (m: number) => m >= 18 ? 'London' : 'Newcastle' },
  { id: 'Frank', group: 'person', radius: 10, role: 'DevOps', learning: null, nextRole: 'Senior DevOps', skills: 'System Architecture', prob: '95%', loc: (m: number) => 'Newcastle' },
  { id: 'Grace', group: 'person', radius: 10, role: 'QA', learning: 'UX Design', nextRole: 'UX Researcher', skills: 'User Interviews, Figma', prob: '70%', loc: (m: number) => 'Newcastle' },
  { id: 'Hank', group: 'person', radius: 10, role: 'Software Engineering', learning: 'Data Science', nextRole: 'Machine Learning Engineer', skills: 'Python, PyTorch', prob: '65%', loc: (m: number) => m >= 24 ? 'London' : 'Newcastle' },
  { id: 'Ivy', group: 'person', radius: 10, role: 'Product Management', learning: 'UX Design', nextRole: 'Product Designer', skills: 'Prototyping, Wireframing', prob: '85%', loc: (m: number) => 'Newcastle' },
  { id: 'Jack', group: 'person', radius: 10, role: 'Cyber Security', learning: 'DevOps', nextRole: 'DevSecOps', skills: 'CI/CD Security', prob: '90%', loc: (m: number) => 'Newcastle' },
  { id: 'Karen', group: 'person', radius: 10, role: 'Data Science', learning: null, nextRole: 'Senior Data Scientist', skills: 'Deep Learning', prob: '95%', loc: (m: number) => 'Newcastle' },
  { id: 'Leo', group: 'person', radius: 10, role: 'Software Engineering', learning: 'Cyber Security', nextRole: 'Security Engineer', skills: 'AppSec, Cryptography', prob: '80%', loc: (m: number) => m >= 12 ? 'London' : 'Newcastle' },
  { id: 'Mia', group: 'person', radius: 10, role: 'UX Design', learning: 'Product Management', nextRole: 'Product Manager', skills: 'Roadmapping, Analytics', prob: '75%', loc: (m: number) => 'Newcastle' },
  { id: 'Noah', group: 'person', radius: 10, role: 'DevOps', learning: 'QA', nextRole: 'Release Manager', skills: 'Test Automation', prob: '85%', loc: (m: number) => 'Newcastle' },
  { id: 'Olivia', group: 'person', radius: 10, role: 'Product Management', learning: 'Data Science', nextRole: 'Data PM', skills: 'SQL, Tableau', prob: '80%', loc: (m: number) => m >= 18 ? 'London' : 'Newcastle' },
  { id: 'Paul', group: 'person', radius: 10, role: 'Software Engineering', learning: null, nextRole: 'Tech Lead', skills: 'System Design, Leadership', prob: '90%', loc: (m: number) => 'Newcastle' },
  { id: 'Quinn', group: 'person', radius: 10, role: 'QA', learning: 'Cyber Security', nextRole: 'Security Analyst', skills: 'Threat Modeling', prob: '70%', loc: (m: number) => 'Newcastle' },
  { id: 'Rachel', group: 'person', radius: 10, role: 'Data Science', learning: 'Software Engineering', nextRole: 'Data Engineer', skills: 'Spark, Kafka', prob: '85%', loc: (m: number) => 'Newcastle' },
  { id: 'Sam', group: 'person', radius: 10, role: 'Cyber Security', learning: null, nextRole: 'CISO', skills: 'Risk Management', prob: '60%', loc: (m: number) => m >= 30 ? 'London' : 'Newcastle' },
  { id: 'Tom', group: 'person', radius: 10, role: 'Software Engineering', learning: 'DevOps', nextRole: 'SRE', skills: 'Observability, Go', prob: '85%', loc: (m: number) => 'Newcastle' },
];

export function RetentionStats() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);
  const [months, setMonths] = useState(0);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number; content: React.ReactNode }>({
    visible: false,
    x: 0,
    y: 0,
    content: null,
  });

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Generate nodes based on current month
    const currentPeople = peopleBase.map(p => ({
      ...p,
      location: p.loc(months)
    }));

    const nodes = [...roles.map(d => ({ ...d })), ...currentPeople] as any[];
    
    const links = currentPeople.flatMap(p => {
      const l = [{ source: p.id, target: p.role, type: 'primary' }];
      if (p.learning) {
        l.push({ source: p.id, target: p.learning, type: 'learning' });
      }
      return l;
    });

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => d.type === 'primary' ? 60 : 150))
      .force("charge", d3.forceManyBody().strength((d: any) => d.group === 'role' ? -600 : -100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 10).iterations(2))
      .force("x", d3.forceX((d: any) => {
        if (d.group === 'role') return width / 2;
        return d.location === 'Newcastle' ? width * 0.25 : width * 0.75;
      }).strength(0.15))
      .force("y", d3.forceY(height / 2).strength(0.05));

    simulationRef.current = simulation;

    const g = svg.append("g");

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Background labels for locations
    g.append("text")
      .attr("x", width * 0.25)
      .attr("y", height * 0.1)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff20")
      .attr("font-size", "48px")
      .attr("font-weight", "bold")
      .text("Newcastle (Retained)");

    g.append("text")
      .attr("x", width * 0.75)
      .attr("y", height * 0.1)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffffff20")
      .attr("font-size", "48px")
      .attr("font-weight", "bold")
      .text("London (Leak)");

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.type === 'primary' ? "#A100FF" : "#888")
      .attr("stroke-opacity", (d: any) => d.type === 'primary' ? 0.6 : 0.4)
      .attr("stroke-width", (d: any) => d.type === 'primary' ? 2 : 1.5)
      .attr("stroke-dasharray", (d: any) => d.type === 'primary' ? "none" : "5,5");

    const drag = (sim: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
      function dragstarted(event: any) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) sim.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag<SVGCircleElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => {
        if (d.group === 'role') return "#A100FF";
        return d.location === 'Newcastle' ? "#10b981" : "#ef4444"; // Green for retained, Red for leak
      })
      .attr("stroke", (d: any) => d.group === 'role' ? "#fff" : "#fff")
      .attr("stroke-width", (d: any) => d.group === 'role' ? 2 : 1.5)
      .call(drag(simulation))
      .on("mouseover", (event, d: any) => {
        d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 3);
        
        link.attr("stroke-opacity", (l: any) => l.source.id === d.id || l.target.id === d.id ? 1 : 0.1);
        node.attr("opacity", (n: any) => {
          const isConnected = links.some((l: any) => 
            (l.source.id === d.id && l.target.id === n.id) || 
            (l.target.id === d.id && l.source.id === n.id)
          );
          return isConnected || n.id === d.id ? 1 : 0.2;
        });

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          content: (
            <div className="space-y-2 min-w-[200px]">
              <div className="flex justify-between items-start border-b border-white/10 pb-2">
                <div>
                  <div className="font-bold text-lg">{d.id}</div>
                  <div className="text-xs text-muted-foreground capitalize">{d.group}</div>
                </div>
                {d.group === 'person' && (
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${d.location === 'Newcastle' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {d.location}
                  </span>
                )}
              </div>
              
              {d.group === 'person' && (
                <div className="text-sm space-y-2 pt-1">
                  <div><span className="text-primary font-semibold">Current Role:</span> {d.role}</div>
                  {d.learning && <div><span className="text-blue-400 font-semibold">Cross-Training:</span> {d.learning}</div>}
                  
                  <div className="bg-white/5 p-2 rounded-md mt-2 space-y-1 border border-white/10">
                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Actionable Insights</div>
                    <div><span className="font-semibold text-gray-300">Next Best Role:</span> {d.nextRole}</div>
                    <div><span className="font-semibold text-gray-300">Skills to Learn:</span> {d.skills}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-semibold text-gray-300">Transition Prob:</span> 
                      <span className="text-green-400 font-bold">{d.prob}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        });
      })
      .on("mousemove", (event) => {
        setTooltip(prev => ({ ...prev, x: event.clientX, y: event.clientY }));
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", (d: any) => d.group === 'role' ? 2 : 1.5);
        link.attr("stroke-opacity", (d: any) => d.type === 'primary' ? 0.6 : 0.4);
        node.attr("opacity", 1);
        setTooltip(prev => ({ ...prev, visible: false }));
      });

    const label = g.append("g")
      .selectAll("text")
      .data(nodes.filter((d: any) => d.group === 'role'))
      .join("text")
      .text((d: any) => d.id)
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("dy", ".3em")
      .style("pointer-events", "none");

    const personLabel = g.append("g")
      .selectAll("text")
      .data(nodes.filter((d: any) => d.group === 'person'))
      .join("text")
      .text((d: any) => d.id)
      .attr("font-size", "9px")
      .attr("fill", "#aaa")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      label
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);

      personLabel
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      simulation.force("center", d3.forceCenter(newWidth / 2, newHeight / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      simulation.stop();
      window.removeEventListener('resize', handleResize);
    };
  }, [months]); // Re-run effect when months change to update locations

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Local Retention (Post-Switch)</p>
              <h3 className="text-2xl font-bold">85%</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                Highly effective strategy
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
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cross-Training</p>
              <h3 className="text-2xl font-bold">15</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Employees learning new roles
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ArrowRightLeft size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Top Destination</p>
              <h3 className="text-2xl font-bold text-sm leading-tight mt-1">DevOps & Cyber</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Most popular to learn
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moved Retention Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Regional Retention by University</CardTitle>
            <CardDescription>% of graduates staying in the North East vs leaving</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={retentionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="retained" name="Stayed in Region" stackId="a" fill="#10b981" />
                <Bar dataKey="left" name="Left Region" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Newcastle Office Retention Rate</CardTitle>
            <CardDescription>% of graduates staying with the Newcastle Office over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={newcastleRetentionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="rate" name="Retention Rate" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Network Graph */}
      <Card className="border-white/10 shadow-2xl overflow-hidden">
        <CardHeader className="bg-card/50 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Internal Mobility & Talent Flow</CardTitle>
              <CardDescription>
                Visualize how employees move between roles and locations over time. 
                Hover over employees for strategic transition insights.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Newcastle (Retained)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>London (Leak)</span>
              </div>
            </div>
          </div>
          
          {/* Timeline Slider */}
          <div className="pt-4 pb-2">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>0 Months (Hire)</span>
              <span className="text-primary font-bold">{months} Months Tenure</span>
              <span>36 Months</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="36" 
              step="6" 
              value={months} 
              onChange={(e) => setMonths(parseInt(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Onboarding</span>
              <span>First Review (12m)</span>
              <span>Flight Risk Zone (18-24m)</span>
              <span>Established</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 relative">
          <div ref={containerRef} className="w-full h-[600px] bg-[#050505] cursor-grab active:cursor-grabbing">
            <svg ref={svgRef} className="w-full h-full" />
          </div>
          
          {/* Custom Tooltip */}
          {tooltip.visible && (
            <div 
              className="fixed z-50 pointer-events-none bg-[#1a1a1a] border border-white/10 shadow-xl rounded-lg p-3 text-white transform -translate-x-1/2 -translate-y-full"
              style={{ 
                left: tooltip.x, 
                top: tooltip.y - 15,
                transition: 'opacity 0.1s ease-in-out'
              }}
            >
              {tooltip.content}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geographic Flow Map */}
      <GeographicFlowMap />

      {/* Sentiment Word Clouds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Positive Graduate Sentiment</CardTitle>
            <CardDescription>Key themes from positive graduate feedback</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <WordCloud words={wordCloudData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constructive Feedback</CardTitle>
            <CardDescription>Areas for improvement from graduate feedback</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <WordCloud words={negativeWordCloudData} colors={['#ff3333', '#cc0000', '#990000', '#ff6666', '#ff9999']} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
