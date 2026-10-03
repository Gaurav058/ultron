"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { SelectedLocation } from "@/types/location";
import { DEMO_LOCATION_DUBAI } from "@/lib/demo/ultronDemoData";

export interface GlobalIntelligenceGlobeProps {
  selectedLocation?: SelectedLocation;
  onSelectLocation?: (loc: SelectedLocation) => void;
  targetCoordinates?: { lat: number; lon: number } | null;
}

export type IntelLayer =
  | "all"
  | "news"
  | "weather"
  | "markets"
  | "technology"
  | "security"
  | "geopolitical"
  | "environment";

export default function GlobalIntelligenceGlobe({
  selectedLocation = DEMO_LOCATION_DUBAI,
  onSelectLocation,
  targetCoordinates,
}: GlobalIntelligenceGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeLayer, setActiveLayer] = useState<IntelLayer>("all");
  const [showLocationDetails, setShowLocationDetails] = useState(true);
  const [currentLoc, setCurrentLoc] = useState<SelectedLocation>(selectedLocation);

  // Sync prop changes
  useEffect(() => {
    if (selectedLocation) {
      setCurrentLoc(selectedLocation);
    }
  }, [selectedLocation]);

  // Three.js Scene Setup & Canvas Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Group for Earth globe rotation
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Initial orientation: Dubai facing camera (~25° N, ~55° E)
    globeGroup.rotation.y = 1.35;
    globeGroup.rotation.x = 0.28;

    // 1. Earth Sphere Core (Dark navy/space blue)
    const sphereGeo = new THREE.SphereGeometry(0.85, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x051329,
      emissive: 0x020817,
      specular: 0x00d9ff,
      shininess: 25,
      wireframe: false,
    });
    const earthMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(earthMesh);

    // 2. Latitude / Longitude Subtle Tech Grid Wireframe
    const wireGeo = new THREE.SphereGeometry(0.852, 24, 16);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0b2a50,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // 3. Atmospheric Outer Glow
    const glowGeo = new THREE.SphereGeometry(0.88, 32, 32);
    const glowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity * 0.7;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glowMesh);

    // 4. City Lights & Intelligence Marker Nodes (Lat/Lon to 3D Cartesian)
    const markersData = [
      { name: "Dubai", lat: 25.2048, lon: 55.2708, color: 0x00d9ff, size: 0.022 },
      { name: "San Francisco", lat: 37.7749, lon: -122.4194, color: 0x1687ff, size: 0.018 },
      { name: "London", lat: 51.5074, lon: -0.1278, color: 0x7c4dff, size: 0.018 },
      { name: "Tokyo", lat: 35.6762, lon: 139.6503, color: 0x00e6a8, size: 0.018 },
      { name: "Singapore", lat: 1.3521, lon: 103.8198, color: 0x00d9ff, size: 0.018 },
      { name: "Geneva", lat: 46.2044, lon: 6.1432, color: 0xffb020, size: 0.016 },
      { name: "Sydney", lat: -33.8688, lon: 151.2093, color: 0x00e6a8, size: 0.016 },
      { name: "New York", lat: 40.7128, lon: -74.006, color: 0x1687ff, size: 0.018 },
    ];

    const latLonToVec3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    markersData.forEach((marker) => {
      const pos = latLonToVec3(marker.lat, marker.lon, 0.86);
      const markerGeo = new THREE.SphereGeometry(marker.size, 16, 16);
      const markerMat = new THREE.MeshBasicMaterial({ color: marker.color });
      const mesh = new THREE.Mesh(markerGeo, markerMat);
      mesh.position.copy(pos);
      globeGroup.add(mesh);

      // Outer pulsing ring for Dubai
      if (marker.name === "Dubai") {
        const ringGeo = new THREE.RingGeometry(0.025, 0.038, 24);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0x00d9ff,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
        ringMesh.lookAt(pos.clone().multiplyScalar(2));
        globeGroup.add(ringMesh);
      }
    });

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0x061938, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00d9ff, 1.2);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x1687ff, 0.8);
    blueRimLight.position.set(-5, -2, -3);
    scene.add(blueRimLight);

    // Interactive Drag / Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      globeGroup.rotation.y += deltaX * 0.005;
      globeGroup.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.001; // subtle cinematic rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      sphereGeo.dispose();
      sphereMat.dispose();
    };
  }, []);

  const layers: { id: IntelLayer; label: string; icon: string }[] = [
    { id: "all", label: "All", icon: "🌐" },
    { id: "news", label: "News", icon: "📰" },
    { id: "weather", label: "Weather", icon: "⛅" },
    { id: "markets", label: "Markets", icon: "📈" },
    { id: "technology", label: "Technology", icon: "⚡" },
    { id: "security", label: "Security", icon: "🛡️" },
    { id: "geopolitical", label: "Geopolitical", icon: "📍" },
    { id: "environment", label: "Environment", icon: "🌿" },
  ];

  return (
    <div
      className="ultron-panel-base"
      style={{
        flex: "1 1 0%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* SECTION HEADER */}
      <div
        style={{
          padding: "10px 14px 6px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #0B2A50",
          zIndex: 5,
        }}
      >
        <div>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#EAF4FF",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            GLOBAL INTELLIGENCE
          </span>
          <span style={{ fontSize: "10px", color: "#7187A5", display: "block", marginTop: "1px" }}>
            Live world data & intelligence sources
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            style={{
              background: "rgba(11, 42, 80, 0.4)",
              border: "1px solid #0B2A50",
              borderRadius: "5px",
              padding: "2px 6px",
              color: "#7187A5",
              cursor: "pointer",
              fontSize: "10px",
            }}
          >
            ⚙
          </button>
        </div>
      </div>

      {/* BODY: LEFT FILTER BAR + THREE.JS GLOBE */}
      <div style={{ flex: 1, display: "flex", position: "relative", overflow: "hidden" }}>
        {/* Left Filter Layer Controls */}
        <div
          style={{
            width: "100px",
            borderRight: "1px solid #0B2A50",
            padding: "8px 6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            zIndex: 4,
            background: "rgba(2, 8, 23, 0.6)",
          }}
        >
          {layers.map((layer) => {
            const isActive = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                style={{
                  background: isActive ? "rgba(22, 135, 255, 0.25)" : "transparent",
                  border: isActive ? "1px solid #00D9FF" : "1px solid transparent",
                  borderRadius: "6px",
                  padding: "4px 6px",
                  color: isActive ? "#00D9FF" : "#7187A5",
                  fontSize: "10.5px",
                  fontWeight: isActive ? 600 : 500,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontSize: "11px" }}>{layer.icon}</span>
                <span>{layer.label}</span>
              </button>
            );
          })}
        </div>

        {/* Center: 3D Earth Canvas Area */}
        <div
          ref={mountRef}
          style={{
            flex: 1,
            height: "100%",
            position: "relative",
            cursor: "grab",
          }}
        />

        {/* FLOATING LOCATION INTELLIGENCE CARD (DUBAI, UAE) */}
        {showLocationDetails && currentLoc && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              width: "210px",
              background: "rgba(8, 23, 45, 0.94)",
              border: "1px solid #123F70",
              borderRadius: "8px",
              padding: "10px 12px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5), 0 0 14px rgba(0, 217, 255, 0.2)",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Header: Title & Close */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00D9FF" }} />
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#EAF4FF" }}>
                  {currentLoc.city || "Dubai"}, {currentLoc.country || "UAE"}
                </span>
              </div>
              <button
                onClick={() => setShowLocationDetails(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#7187A5",
                  fontSize: "12px",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Weather & Coordinates */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#FFB020", fontWeight: 600 }}>
                {currentLoc.weather?.temperature || "32°C"} {currentLoc.weather?.condition || "Partly Cloudy"}
              </span>
              <span style={{ fontSize: "9px", color: "#435873" }}>
                {currentLoc.latitude.toFixed(2)}°N {currentLoc.longitude.toFixed(2)}°E
              </span>
            </div>

            {/* Local Insights */}
            <div
              style={{
                borderTop: "1px solid #0B2A50",
                paddingTop: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "3px",
              }}
            >
              {(currentLoc.insights || [
                "UAE AI Investment up 42%",
                "New data center announced",
                "Regional tech summit next week",
              ]).map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "4px" }}>
                  <span style={{ color: "#00D9FF", fontSize: "10px", lineHeight: 1 }}>•</span>
                  <span style={{ fontSize: "9.5px", color: "#C8D8EA", lineHeight: 1.3 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Camera Source Status (Directive Section 12) */}
            <div
              style={{
                borderTop: "1px solid #0B2A50",
                paddingTop: "5px",
                fontSize: "8.5px",
                color: "#7187A5",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              CAMERAS: NO AUTHORIZED SOURCES AVAILABLE
            </div>

            {/* View Details Link */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2px" }}>
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 600,
                  color: "#00D9FF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                View Details →
              </span>
            </div>
          </div>
        )}

        {/* BOTTOM EARTH TOOLBAR */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "110px",
            right: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          {/* Controls icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", pointerEvents: "auto" }}>
            <div
              style={{
                background: "rgba(6, 19, 41, 0.8)",
                border: "1px solid #0B2A50",
                borderRadius: "5px",
                padding: "2px 6px",
                display: "flex",
                gap: "6px",
                color: "#7187A5",
                fontSize: "10px",
              }}
            >
              <span>🗂</span>
              <span>🔄</span>
              <span>🔍</span>
            </div>

            <div
              style={{
                background: "rgba(0, 230, 168, 0.12)",
                border: "1px solid rgba(0, 230, 168, 0.4)",
                borderRadius: "5px",
                padding: "2px 7px",
                color: "#00E6A8",
                fontSize: "9.5px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>+</span> Live
            </div>
          </div>

          {/* 3D Mode & Compass */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", pointerEvents: "auto" }}>
            <span
              style={{
                background: "rgba(6, 19, 41, 0.8)",
                border: "1px solid #0B2A50",
                borderRadius: "5px",
                padding: "2px 6px",
                color: "#00D9FF",
                fontSize: "9.5px",
                fontWeight: 600,
              }}
            >
              3D
            </span>
            <span
              style={{
                background: "rgba(6, 19, 41, 0.8)",
                border: "1px solid #0B2A50",
                borderRadius: "5px",
                padding: "2px 6px",
                color: "#7187A5",
                fontSize: "10px",
              }}
            >
              ◎
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
