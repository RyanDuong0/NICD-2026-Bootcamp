import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Network, Users, BookOpen, ArrowRightLeft } from 'lucide-react';

// --- Mock Data ---
const roles = [
  { id: 'DevOps', group: 'role', radius: 35 },
  { id: 'QA', group: 'role', radius: 30 },
  { id: 'Software Engineering', group: 'role', radius: 40 },
  { id: 'Data Science', group: 'role', radius: 35 },
  { id: 'UX Design', group: 'role', radius: 30 },
  { id: 'Product Management', group: 'role', radius: 35 },
  { id: 'Cyber Security', group: 'role', radius: 30 },
];

const people = [
  { id: 'Alice', group: 'person', radius: 10, role: 'DevOps', learning: 'Cyber Security' },
  { id: 'Bob', group: 'person', radius: 10, role: 'QA', learning: 'Software Engineering' },
  { id: 'Charlie', group: 'person', radius: 10, role: 'Software Engineering', learning: 'DevOps' },
  { id: 'Diana', group: 'person', radius: 10, role: 'Data Science', learning: 'Product Management' },
  { id: 'Eve', group: 'person', radius: 10, role: 'UX Design', learning: 'Software Engineering' },
  { id: 'Frank', group: 'person', radius: 10, role: 'DevOps', learning: null },
  { id: 'Grace', group: 'person', radius: 10, role: 'QA', learning: 'UX Design' },
  { id: 'Hank', group: 'person', radius: 10, role: 'Software Engineering', learning: 'Data Science' },
  { id: 'Ivy', group: 'person', radius: 10, role: 'Product Management', learning: 'UX Design' },
  { id: 'Jack', group: 'person', radius: 10, role: 'Cyber Security', learning: 'DevOps' },
  { id: 'Karen', group: 'person', radius: 10, role: 'Data Science', learning: null },
  { id: 'Leo', group: 'person', radius: 10, role: 'Software Engineering', learning: 'Cyber Security' },
  { id: 'Mia', group: 'person', radius: 10, role: 'UX Design', learning: 'Product Management' },
  { id: 'Noah', group: 'person', radius: 10, role: 'DevOps', learning: 'QA' },
  { id: 'Olivia', group: 'person', radius: 10, role: 'Product Management', learning: 'Data Science' },
  { id: 'Paul', group: 'person', radius: 10, role: 'Software Engineering', learning: null },
  { id: 'Quinn', group: 'person', radius: 10, role: 'QA', learning: 'Cyber Security' },
  { id: 'Rachel', group: 'person', radius: 10, role: 'Data Science', learning: 'Software Engineering' },
  { id: 'Sam', group: 'person', radius: 10, role: 'Cyber Security', learning: null },
  { id: 'Tom', group: 'person', radius: 10, role: 'Software Engineering', learning: 'DevOps' },
];

const initialNodes = [...roles, ...people];

const initialLinks = people.flatMap(p => {
  const links = [{ source: p.id, target: p.role, type: 'primary' }];
  if (p.learning) {
    links.push({ source: p.id, target: p.learning, type: 'learning' });
  }
  return links;
});

export function RoleNetwork() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
    svg.selectAll("*").remove(); // Clear previous render

    // Deep copy data for D3 simulation (D3 mutates the objects)
    const nodes = initialNodes.map(d => ({ ...d }));
    const links = initialLinks.map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => d.type === 'primary' ? 80 : 180))
      .force("charge", d3.forceManyBody().strength((d: any) => d.group === 'role' ? -800 : -150))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 15).iterations(2));

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Draw links
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.type === 'primary' ? "#A100FF" : "#888")
      .attr("stroke-opacity", (d: any) => d.type === 'primary' ? 0.6 : 0.4)
      .attr("stroke-width", (d: any) => d.type === 'primary' ? 2 : 1.5)
      .attr("stroke-dasharray", (d: any) => d.type === 'primary' ? "none" : "5,5");

    // Drag behavior
    const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      return d3.drag<SVGCircleElement, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    // Draw nodes
    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.radius)
      .attr("fill", (d: any) => d.group === 'role' ? "#A100FF" : "#2a2a2a")
      .attr("stroke", (d: any) => d.group === 'role' ? "#fff" : "#A100FF")
      .attr("stroke-width", (d: any) => d.group === 'role' ? 2 : 2)
      .call(drag(simulation))
      .on("mouseover", (event, d: any) => {
        d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 3);
        
        // Highlight connected links
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
          x: event.pageX,
          y: event.pageY,
          content: (
            <div className="space-y-1">
              <div className="font-bold text-sm">{d.id}</div>
              <div className="text-xs text-muted-foreground capitalize">{d.group}</div>
              {d.group === 'person' && (
                <div className="text-xs mt-2">
                  <div><span className="text-primary font-semibold">Role:</span> {d.role}</div>
                  {d.learning && <div><span className="text-green-400 font-semibold">Learning:</span> {d.learning}</div>}
                </div>
              )}
            </div>
          )
        });
      })
      .on("mousemove", (event) => {
        setTooltip(prev => ({ ...prev, x: event.pageX, y: event.pageY }));
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).attr("stroke", (d: any) => d.group === 'role' ? "#fff" : "#A100FF").attr("stroke-width", 2);
        link.attr("stroke-opacity", (d: any) => d.type === 'primary' ? 0.6 : 0.4);
        node.attr("opacity", 1);
        setTooltip(prev => ({ ...prev, visible: false }));
      });

    // Draw labels for roles
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

    // Draw labels for people
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

    // Handle resize
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
  }, []);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Network size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Connections</p>
              <h3 className="text-2xl font-bold">35</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                Active internal network
              </p>
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

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Retention Impact</p>
              <h3 className="text-2xl font-bold">+18%</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                For cross-trained staff
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Graph */}
      <Card className="border-white/10 shadow-2xl overflow-hidden">
        <CardHeader className="bg-card/50 border-b border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Internal Mobility & Knowledge Graph</CardTitle>
              <CardDescription>
                Visualize how employees are connected to their primary roles and the new skills they are learning. 
                Hover over nodes to highlight connections. Drag nodes to explore the network.
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground bg-black/20 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span>Role</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border-2 border-primary bg-[#2a2a2a]"></div>
                <span>Employee</span>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <div className="w-6 h-0.5 bg-primary opacity-60"></div>
                <span>Primary Role</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-0.5 border-t-2 border-dashed border-gray-500 opacity-60"></div>
                <span>Learning / Mentorship</span>
              </div>
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
    </div>
  );
}
