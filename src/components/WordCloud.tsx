import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

interface Word {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: Word[];
  colors?: string[];
}

export function WordCloud({ words, colors = ['#A100FF', '#7500c0', '#4a007a', '#c44dff', '#e099ff'] }: WordCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const layout = cloud()
      .size([dimensions.width, dimensions.height])
      .words(words.map((d) => ({ text: d.text, size: 10 + d.value * 5 })))
      .padding(5)
      .rotate(() => (~~(Math.random() * 2) * 90) - 45) // -45 or 45 degrees
      .font('Graphik, Manrope, sans-serif')
      .fontSize((d) => d.size!)
      .on('end', draw);

    layout.start();

    function draw(words: any[]) {
      const colorScale = d3.scaleOrdinal().range(colors);
      
      svg
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d) => `${d.size}px`)
        .style('font-family', 'Graphik, Manrope, sans-serif')
        .style('fill', (d, i) => colorScale(i.toString()) as string)
        .attr('text-anchor', 'middle')
        .attr('transform', (d) => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text((d) => d.text);
    }
  }, [words, dimensions]);

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full h-full min-h-[300px]">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
    </div>
  );
}
