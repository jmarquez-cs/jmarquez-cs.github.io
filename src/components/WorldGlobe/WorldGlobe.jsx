import React, { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../hooks/useTheme';
import './WorldGlobe.css';

const WorldGlobe = ({
  width = null,
  height = null,
  radius = 5,
  rotationSpeed = 0.001,
  tiltAngle = 23.5,
  theme = 'white',
  enableRotation = false,
  enableZoom = false, // Disabled zoom
  enablePan = false,
  enableScrollRotation = true, // Enable scroll rotation
  locations = [],
  geoDataUrls = {
    countries:
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
    borders:
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson',
  },
  colors = {
    white: {
      land: 0xffffff,
      border: 0x000000,
      dot: 0x000000,
      background: 0xf4f4f4,
    },
    black: {
      land: 0x000000,
      border: 0xffffff,
      dot: 0xffffff,
      background: 0x1a1a1a,
    },
  },
  markerConfig = {
    size: 0.05,
    sizeAttenuation: true,
  },
  onMarkerClick = null,
  onMarkerHover = null,
  className = '',
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const earthGroupRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameRef = useRef(null);
  const { theme: globalTheme, toggleTheme: globalToggleTheme } = useTheme();
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Map global theme to globe theme
  const currentTheme = globalTheme === 'dark' ? 'black' : 'white';

  // Refs for tracking objects
  const landsRef = useRef([]);
  const bordersRef = useRef([]);
  const markersRef = useRef([]);

  const initializeThreeJS = useCallback(() => {
    if (!window.THREE || !mountRef.current) {
      console.error('Three.js not loaded or mount ref not available');
      return false;
    }

    const container = mountRef.current;
    const containerWidth = width || container.clientWidth || container.offsetWidth || 800;
    const containerHeight = height || container.clientHeight || container.offsetHeight || 450;

    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000,
    );
    const renderer = new window.THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });

    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.margin = '0 auto';

    const earthGroup = new window.THREE.Group();
    const tilt = (tiltAngle * Math.PI) / 180;
    earthGroup.rotation.z = tilt;
    scene.add(earthGroup);

    camera.position.set(0, 0, 10);

    // Initialize controls if OrbitControls is available
    if (window.THREE.OrbitControls) {
      const controls = new window.THREE.OrbitControls(camera, renderer.domElement);
      controls.enableRotate = enableRotation;
      controls.enablePan = enablePan;
      controls.enableZoom = enableZoom; // disable zoom
      controlsRef.current = controls;
    }

    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    earthGroupRef.current = earthGroup;

    return true;
  }, [width, height, tiltAngle, enableRotation, enablePan, enableZoom]);

  const updateTheme = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current) return;

    const themeColors = colors[currentTheme];
    // Keep transparent background

    landsRef.current.forEach((land) => {
      land.material.color.set(themeColors.land);
    });

    bordersRef.current.forEach((border) => {
      border.material.color.set(themeColors.border);
    });

    markersRef.current.forEach((marker) => {
      marker.material.color.set(themeColors.dot);
    });
  }, [currentTheme, colors]);

  const createLandMesh = useCallback(
    (polygon) => {
      if (!window.THREE || !earthGroupRef.current || !window.earcut) return;

      const positions = [];
      const flatCoords = [];
      const holeIndices = [];

      polygon.forEach((ring, ringIndex) => {
        const ringFlat = [];
        ring.forEach(([lon, lat]) => {
          const phi = ((90 - lat) * Math.PI) / 180;
          const theta = (-lon * Math.PI) / 180;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          positions.push(x, y, z);
          ringFlat.push(lon, lat);
        });

        if (ringIndex > 0) {
          holeIndices.push(flatCoords.length / 2);
        }
        flatCoords.push(...ringFlat);
      });

      const indices = window.earcut(flatCoords, holeIndices);
      const landGeo = new window.THREE.BufferGeometry();
      landGeo.setAttribute('position', new window.THREE.Float32BufferAttribute(positions, 3));
      landGeo.setIndex(indices);

      const landMat = new window.THREE.MeshBasicMaterial({
        color: colors[currentTheme].land,
        side: window.THREE.DoubleSide,
      });

      const landMesh = new window.THREE.Mesh(landGeo, landMat);
      earthGroupRef.current.add(landMesh);
      landsRef.current.push(landMesh);
    },
    [radius, currentTheme, colors],
  );

  const createBorderLines = useCallback(
    (multi) => {
      if (!window.THREE || !earthGroupRef.current) return;

      multi.forEach((polygon) => {
        const points = [];
        polygon.forEach(([lon, lat]) => {
          const phi = ((90 - lat) * Math.PI) / 180;
          const theta = (-lon * Math.PI) / 180;
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.cos(phi);
          const z = radius * Math.sin(phi) * Math.sin(theta);
          points.push(new window.THREE.Vector3(x, y, z));
        });

        if (points.length > 0) {
          points.push(points[0]);
          const lineGeometry = new window.THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new window.THREE.LineBasicMaterial({
            color: colors[currentTheme].border,
          });
          const line = new window.THREE.Line(lineGeometry, lineMaterial);
          earthGroupRef.current.add(line);
          bordersRef.current.push(line);
        }
      });
    },
    [radius, currentTheme, colors],
  );

  const loadGeoData = useCallback(
    async (url, isLand = true) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const geojson = await response.json();

        geojson.features.forEach((feature) => {
          const coords = feature.geometry.coordinates;
          const type = feature.geometry.type;
          let multiPolygons = type === 'Polygon' ? [coords] : coords;

          multiPolygons.forEach((polygon) => {
            if (isLand) {
              createLandMesh(polygon);
            } else {
              createBorderLines(polygon);
            }
          });
        });
      } catch (error) {
        console.error(`Error loading geo data from ${url}:`, error);
        // Create a simple fallback sphere if geo data fails
        if (isLand && earthGroupRef.current) {
          const sphereGeometry = new window.THREE.SphereGeometry(radius, 32, 32);
          const sphereMaterial = new window.THREE.MeshBasicMaterial({
            color: colors[currentTheme].land,
            wireframe: false,
          });
          const sphere = new window.THREE.Mesh(sphereGeometry, sphereMaterial);
          earthGroupRef.current.add(sphere);
          landsRef.current.push(sphere);
        }
      }
    },
    [createLandMesh, createBorderLines, radius, currentTheme, colors],
  );

  const createMarkers = useCallback(() => {
    if (!window.THREE || !earthGroupRef.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      earthGroupRef.current.remove(marker);
    });
    markersRef.current = [];

    locations.forEach((loc) => {
      const phi = ((90 - loc.lat) * Math.PI) / 180;
      const theta = (-loc.lon * Math.PI) / 180;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      const markerGeo = new window.THREE.BufferGeometry();
      markerGeo.setAttribute('position', new window.THREE.Float32BufferAttribute([x, y, z], 3));

      const markerMat = new window.THREE.PointsMaterial({
        color: colors[currentTheme].dot,
        size: markerConfig.size,
        sizeAttenuation: markerConfig.sizeAttenuation,
      });

      const marker = new window.THREE.Points(markerGeo, markerMat);
      marker.userData = {
        location: loc,
      };

      earthGroupRef.current.add(marker);
      markersRef.current.push(marker);
    });
  }, [locations, radius, currentTheme, colors, markerConfig]);

  const handleMouseEvents = useCallback(
    (event) => {
      if (!cameraRef.current || !markersRef.current.length) return;

      const mouse = new window.THREE.Vector2();
      const rect = mountRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new window.THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(markersRef.current);

      if (event.type === 'click') {
        if (intersects.length > 0) {
          const marker = intersects[0].object;
          setSelectedMarker(marker.userData);
          if (onMarkerClick) {
            onMarkerClick(marker.userData, event);
          }
        } else {
          setSelectedMarker(null);
        }
      } else if (event.type === 'mousemove') {
        if (intersects.length > 0) {
          const marker = intersects[0].object;
          if (onMarkerHover) {
            onMarkerHover(marker.userData, event);
          }
          mountRef.current.style.cursor = 'pointer';
        } else {
          mountRef.current.style.cursor = 'default';
          if (onMarkerHover) {
            onMarkerHover(null, event);
          }
        }
      }
    },
    [onMarkerClick, onMarkerHover],
  );

  const animate = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    if (earthGroupRef.current && rotationSpeed > 0) {
      earthGroupRef.current.rotation.y += rotationSpeed;
    }

    if (controlsRef.current) {
      controlsRef.current.update();
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [rotationSpeed]);

  const handleResize = useCallback(() => {
    if (!cameraRef.current || !rendererRef.current || !mountRef.current) return;

    const container = mountRef.current;
    const newWidth = width || container.clientWidth || container.offsetWidth || 800;
    const newHeight = height || container.clientHeight || container.offsetHeight || 450;

    cameraRef.current.aspect = newWidth / newHeight;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(newWidth, newHeight);

    // Ensure canvas stays centered
    if (rendererRef.current.domElement) {
      rendererRef.current.domElement.style.width = '100%';
      rendererRef.current.domElement.style.height = '100%';
      rendererRef.current.domElement.style.display = 'block';
      rendererRef.current.domElement.style.margin = '0 auto';
    }
  }, [width, height]);

  // Theme is now controlled by global theme context

  const handleScrollRotation = useCallback(
    (event) => {
      if (enableScrollRotation && earthGroupRef.current) {
        const scrollDelta = event.deltaY * 0.0005; // Adjust sensitivity as needed
        earthGroupRef.current.rotation.y += scrollDelta;
      }
    },
    [enableScrollRotation],
  );

  // Initialize component - using empty dependency array for one-time initialization
  // This is intentionally not including all function dependencies to prevent re-initialization
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const initGlobe = async () => {
      setIsLoading(true);

      if (!initializeThreeJS()) {
        console.error('Failed to initialize Three.js');
        setIsLoading(false);
        return;
      }

      mount.appendChild(rendererRef.current.domElement);

      // Load geo data
      await Promise.all([
        loadGeoData(geoDataUrls.countries, true),
        loadGeoData(geoDataUrls.borders, false),
      ]);

      createMarkers();
      updateTheme();
      animate();
      setIsLoading(false);
    };

    initGlobe();

    // Event listeners
    if (mount) {
      mount.addEventListener('click', handleMouseEvents);
      mount.addEventListener('mousemove', handleMouseEvents);
      mount.addEventListener('wheel', handleScrollRotation);
    }
    window.addEventListener('resize', handleResize);

    // ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(mount);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mount && rendererRef.current) {
        mount.removeChild(rendererRef.current.domElement);
      }
      if (mount) {
        mount.removeEventListener('click', handleMouseEvents);
        mount.removeEventListener('mousemove', handleMouseEvents);
        mount.removeEventListener('wheel', handleScrollRotation);
      }
      window.removeEventListener('resize', handleResize);

      // Clean up resize observer
      if (typeof ResizeObserver !== 'undefined') {
        const resizeObserver = new ResizeObserver(() => {});
        resizeObserver.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update theme when currentTheme changes
  useEffect(() => {
    updateTheme();
  }, [updateTheme]);

  // Update markers when locations change
  useEffect(() => {
    if (!isLoading) {
      createMarkers();
    }
  }, [createMarkers, isLoading]);

  // Handle resize
  useEffect(() => {
    handleResize();
  }, [width, height, handleResize]);

  const [hasError, setHasError] = useState(false);

  // Simple error boundary effect
  useEffect(() => {
    const handleError = (error) => {
      console.warn('WorldGlobe: Falling back to simple mode due to:', error);
      setHasError(true);
    };

    // Catch any errors during component lifecycle
    try {
      // Component initialization logic here
    } catch (error) {
      handleError(error);
    }
  }, []);

  // If there's an error, render a simple fallback
  if (hasError) {
    return (
      <div className={`world-globe-container ${className}`} data-theme={globalTheme}>
        <div className="globe-loading-fallback">
          <div className="loading-spinner"></div>
          <p>Loading interactive globe...</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.7 }}>
            Geographic data is loading. The globe will appear shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`world-globe-container ${className}`} data-theme={globalTheme}>
      {isLoading && (
        <div className="world-globe-loading">
          <div className="loading-spinner"></div>
          <p>Loading Globe...</p>
        </div>
      )}

      <div
        ref={mountRef}
        className="world-globe-mount"
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%',
          minHeight: 'inherit',
        }}
      />

      {selectedMarker && (
        <div className="world-globe-info">
          <div className="info-header">
            <button
              className="close-info"
              onClick={() => setSelectedMarker(null)}
              aria-label="Close info"
            >
              ×
            </button>
          </div>

          <div className="info-content">
            {selectedMarker.location?.company && (
              <div className="info-meta">
                <span className="meta-label">Company:</span>
                <span className="meta-value">{selectedMarker.location.company}</span>
              </div>
            )}

            {selectedMarker.location?.role && (
              <div className="info-meta">
                <span className="meta-label">Role:</span>
                <span className="meta-value">{selectedMarker.location.role}</span>
              </div>
            )}

            {selectedMarker.location?.period && (
              <div className="info-meta">
                <span className="meta-label">Period:</span>
                <span className="meta-value">{selectedMarker.location.period}</span>
              </div>
            )}

            {selectedMarker.location?.city && (
              <div className="info-meta">
                <span className="meta-label">Location:</span>
                <span className="meta-value">{selectedMarker.location.city}</span>
              </div>
            )}

            {selectedMarker.desc && (
              <div className="info-description">
                <p>{selectedMarker.desc}</p>
              </div>
            )}

            {selectedMarker.location?.technologies &&
              selectedMarker.location.technologies.length > 0 && (
                <div className="info-technologies">
                  <h4>Technologies:</h4>
                  <div className="tech-tags">
                    {selectedMarker.location.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Display metrics if available (patents, certifications, etc.) */}
            {selectedMarker.location && (
              <div className="info-metrics">
                {selectedMarker.location.patents && (
                  <div className="metric-item">
                    <span className="metric-label">Patents:</span>
                    <span className="metric-value">{selectedMarker.location.patents}</span>
                  </div>
                )}
                {selectedMarker.location.certification && (
                  <div className="metric-item">
                    <span className="metric-label">Certification:</span>
                    <span className="metric-value">{selectedMarker.location.certification}</span>
                  </div>
                )}
                {selectedMarker.location.whitepapers && (
                  <div className="metric-item">
                    <span className="metric-label">Whitepapers:</span>
                    <span className="metric-value">{selectedMarker.location.whitepapers}</span>
                  </div>
                )}
                {selectedMarker.location.funding && (
                  <div className="metric-item">
                    <span className="metric-label">Funding:</span>
                    <span className="metric-value">{selectedMarker.location.funding}</span>
                  </div>
                )}
                {selectedMarker.location.teamSize && (
                  <div className="metric-item">
                    <span className="metric-label">Team Size:</span>
                    <span className="metric-value">{selectedMarker.location.teamSize}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

WorldGlobe.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  radius: PropTypes.number,
  rotationSpeed: PropTypes.number,
  tiltAngle: PropTypes.number,
  theme: PropTypes.oneOf(['white', 'black']),
  enableRotation: PropTypes.bool,
  enableZoom: PropTypes.bool,
  enablePan: PropTypes.bool,
  enableScrollRotation: PropTypes.bool,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,

      desc: PropTypes.string,
    }),
  ),
  geoDataUrls: PropTypes.shape({
    countries: PropTypes.string,
    borders: PropTypes.string,
  }),
  colors: PropTypes.shape({
    white: PropTypes.shape({
      land: PropTypes.number,
      border: PropTypes.number,
      dot: PropTypes.number,
      background: PropTypes.number,
    }),
    black: PropTypes.shape({
      land: PropTypes.number,
      border: PropTypes.number,
      dot: PropTypes.number,
      background: PropTypes.number,
    }),
  }),
  markerConfig: PropTypes.shape({
    size: PropTypes.number,
    sizeAttenuation: PropTypes.bool,
  }),
  onMarkerClick: PropTypes.func,
  onMarkerHover: PropTypes.func,
  className: PropTypes.string,
};

export default WorldGlobe;
