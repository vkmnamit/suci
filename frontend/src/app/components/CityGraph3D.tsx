import React, { useMemo, useRef, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { Zone } from "../data/mockData";
import * as THREE from "three";

interface CityGraph3DProps {
  zones: Zone[];
  onZoneSelect: (zone: Zone) => void;
  selectedZoneId?: string;
}

export function CityGraph3D({ zones, onZoneSelect, selectedZoneId }: CityGraph3DProps) {
  const fgRef = useRef<any>();

  const graphData = useMemo(() => {
    const nodes = zones.map((z) => ({
      id: z.id,
      name: z.name,
      val: Math.sqrt(z.population || 1000) / 40 || 3,
      color: z.carbonEmission > 3500 ? "#FF3B3B" : z.carbonEmission > 2500 ? "#FFD60A" : "#30D158",
      emission: z.carbonEmission,
      zone: z,
    }));

    const links: any[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = Math.sqrt(
          Math.pow(nodes[i].zone.coordinates.x - nodes[j].zone.coordinates.x, 2) +
          Math.pow(nodes[i].zone.coordinates.y - nodes[j].zone.coordinates.y, 2)
        );
        if (d < 450) { // Increased distance for better connectivity
          links.push({
            source: nodes[i].id,
            target: nodes[j].id,
            distance: d
          });
        }
      }
    }

    return { nodes, links };
  }, [zones]);

  useEffect(() => {
    if (fgRef.current) {
        const controls = fgRef.current.controls() as any;
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.8;
          controls.enableDamping = true;
          controls.dampingFactor = 0.05;
        }
    }
  }, []);

  return (
    <div className="w-full h-full bg-[#070707] rounded-2xl overflow-hidden border border-white/5 relative group">
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor="#070707"
        nodeLabel={(node: any) => `
          <div style="background: rgba(0,0,0,0.9); border: 1px solid rgba(232, 220, 207, 0.2); padding: 12px; border-radius: 12px; color: white; font-family: 'Inter', sans-serif; backdrop-filter: blur(8px);">
            <div style="font-size: 10px; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 4px;">Metropolitan Node</div>
            <div style="font-size: 14px; font-weight: 300; margin-bottom: 8px; tracking-widest: 0.05em;">${node.name}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
               <div style="width: 8px; height: 8px; border-radius: 50%; background: ${node.color}; box-shadow: 0 0 10px ${node.color};"></div>
               <div style="font-size: 12px; font-weight: 200;">${node.emission.toLocaleString()} <span style="font-size: 10px; opacity: 0.4;">KG CO₂ / HR</span></div>
            </div>
          </div>
        `}
        nodeThreeObject={(node: any) => {
          const geometry = new THREE.SphereGeometry(Math.log(node.emission) * 0.8);
          const material = new THREE.MeshPhongMaterial({
            color: node.color,
            transparent: true,
            opacity: 0.9,
            emissive: node.color,
            emissiveIntensity: 0.5,
            shininess: 100
          });
          return new THREE.Mesh(geometry, material);
        }}
        linkColor={() => "rgba(232, 220, 207, 0.1)"}
        linkWidth={0.8}
        linkDirectionalParticles={4}
        linkDirectionalParticleSpeed={(d: any) => 0.002 + (1 / d.distance) * 0.5}
        linkDirectionalParticleWidth={2.5}
        linkDirectionalParticleColor={() => "#E8DCCF"}
        onNodeClick={(node: any) => onZoneSelect(node.zone)}
        showNavInfo={false}
      />
      
      <div className="absolute top-6 left-6 pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#E8DCCF] animate-pulse shadow-[0_0_10px_#E8DCCF]" />
          <h4 className="text-white/60 text-[11px] uppercase tracking-[0.3em] font-light">
            Bangalore Metropolitan Intelligence Hub
          </h4>
        </div>
        <p className="text-white/20 text-[9px] uppercase tracking-[0.1em] mt-1 ml-5 font-light">
          Graph V2.4 • Dynamic Node Connectivity • Real-time Urban Pulse
        </p>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <p className="text-white/10 text-[9px] uppercase tracking-widest font-light text-right">
          Interaction Mode: Shift + Drag to Orbit<br/>
          Scroll to Synchronize Scale
        </p>
      </div>
    </div>
  );
}
