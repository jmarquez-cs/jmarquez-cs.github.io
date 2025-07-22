
# Phase 1: Foundation & Performance Infrastructure

**Target**: 1,500-2,500 words | **Focus**: Copy-paste ready prompts | **Duration**: 2 days

---

## Prompt 1A: Mermaid Dynamic Loading

```
Implement dynamic loading for Mermaid components to reduce initial bundle size from 1.4MB flowchart-elk-definition chunk.

Current: src/components/Mermaid/Mermaid.jsx imports mermaid directly
Target: Dynamic import with loading skeleton

Implementation:
- Replace direct mermaid imports with React.lazy() and dynamic import()
- Add loading skeleton matching diagram dimensions
- Implement preloading with intersection observer
- Preserve existing error boundary integration

Success Criteria:
- Mermaid chunks load only on demand
- Loading skeleton displays during import
- No performance degradation for WaveBackground (maintain 58fps)
- Error boundaries handle loading failures gracefully
```

---

## Prompt 1B: FlappyBird Game Splitting

```
Split kaplay library (189KB) from main bundle and implement progressive loading for FlappyBird component.

Current: src/components/Games/FlappyBird.jsx includes kaplay in main bundle
Target: Separate chunk loaded on user interaction

Implementation:
- Split kaplay library into separate chunk using dynamic import
- Initialize game only on first user click/interaction
- Add loading state during kaplay initialization
- Implement progressive asset loading for game sprites

Success Criteria:
- Kaplay library loads only when game is activated
- Game initialization < 2s after user interaction
- Loading state provides user feedback
- No impact on existing game functionality
```

---

## Prompt 1C: Bundle Analysis Enhancement

```
Enhance BundleAnalyzer component to display real-time chunk optimization metrics and recommendations.

Current: src/components/BundleAnalyzer/ shows basic bundle info
Target: Real-time optimization insights with chunk-specific metrics

Implementation:
- Add chunk-specific loading performance tracking
- Display optimization recommendations based on chunk sizes
- Track and display code splitting effectiveness
- Add real-time monitoring for split chunks

Technical Context:
- Existing BundleAnalyzer.jsx has metrics grid and tab system
- usePerformanceMonitor hook available for integration
- Console logging format: "[Performance] Component - event: {data}"

Success Criteria:
- Real-time chunk metrics displayed in analyzer
- Optimization recommendations update automatically
- Performance tracking for split chunks operational
- Integration with usePerformanceMonitor maintained
```

---

## Prompt 1D: Performance Monitor Hook Enhancement

```
Expand usePerformanceMonitor hook to track bundle loading, route-specific metrics, and user interaction response times.

Current: src/hooks/usePerformanceMonitor.js tracks FPS (~58fps) and basic memory
Target: Comprehensive performance tracking with budget alerts

Implementation:
- Add bundle load time tracking using Performance Timing API
- Implement route-specific performance metrics collection
- Create performance budget alerts (>2s load = warning)
- Track user interaction response times (<100ms target)

Technical Requirements:
- Maintain existing console logging format
- Keep performance overhead < 1% CPU usage
- Preserve PerformanceDashboard integration
- Ensure mobile compatibility

Success Criteria:
- Bundle load times tracked and reported
- Performance alerts trigger at defined thresholds
- Route-specific metrics available
- User interaction response times monitored
```

---

## Prompt 1E: Performance Dashboard Upgrade

```
Upgrade PerformanceDashboard component with real-time visualizations and performance scoring.

Current: src/components/PerformanceDashboard/ shows console logs with toggle
Target: Real-time dashboard with visual metrics and scoring

Implementation:
- Add real-time bundle size visualization charts
- Create performance trend graphs (last 10 measurements)
- Implement performance score calculation (0-100 scale)
- Add mobile vs desktop performance comparison

Integration Points:
- Connect with WaveBackground FPS monitoring
- Track Mermaid diagram rendering performance
- Monitor FlappyBird initialization timing
- Display LazySection loading metrics

Success Criteria:
- Real-time metrics update every 5 seconds
- Performance trends visible with 10-point rolling average
- Performance score accurately reflects optimization state
- Dashboard responsive across all devices
```

---

## Prompt 1F: Enhanced LazySection Component

```
Enhance LazySection component with skeleton screens and progressive loading strategies.

Current: src/components/LazySection/LazySection.jsx has intersection observer
Target: Skeleton screens with smooth progressive loading

Implementation:
- Add skeleton screen templates for each section type
- Implement progressive image loading with blur-up technique
- Create smooth transition animations (300ms ease-in-out)
- Add priority loading for above-the-fold content

Technical Requirements:
- Maintain existing intersection observer functionality
- Preserve 60fps during all transitions
- Keep accessibility features functional (ARIA labels)
- Ensure error boundary compatibility

Success Criteria:
- Skeleton screens provide accurate content previews
- Progressive image loading eliminates layout shift
- Smooth transitions maintain 60fps performance
- Above-fold content prioritized for immediate load
```

---

## Prompt 1G: Portfolio Section Optimization

```
Optimize Portfolio component with lazy loading and staggered animations for project grid.

Current: src/components/Portfolio/Portfolio.jsx loads all projects immediately
Target: Progressive loading with staggered animations

Implementation:
- Create project card skeletons matching real content dimensions
- Implement lazy loading for project images/thumbnails
- Add staggered loading animations (100ms intervals)
- Optimize portfolioData.js loading with data chunking

Integration Context:
- usePortfolio hook available with filtering/sorting
- portfolioData.js contains structured project data
- LazySection component can be leveraged
- Performance monitoring integration required

Success Criteria:
- Project cards load progressively with staggered timing
- Image thumbnails lazy load on scroll
- Skeleton screens match actual project card dimensions
- No performance impact on existing portfolio filtering
```

---

## Prompt 1H: Critical Path Optimization

```
Implement critical path optimization with resource hints and intelligent component prioritization.

Current: All components load with equal priority
Target: Prioritized loading based on user experience criticality

Implementation:
- Prioritize Hero section and Navigation (immediate load)
- Defer non-critical components (Games, Mermaid diagrams)
- Add resource hints: <link rel="preconnect"> for external resources
- Implement intersection observer for next-section preloading

Technical Requirements:
- Preserve existing component APIs and structure
- Maintain smooth scrolling performance
- Ensure accessibility features remain functional
- Keep WaveBackground performance at 58fps+

Success Criteria:
- Above-fold content loads < 1s
- Non-critical components defer until needed
- Resource hints improve external resource loading
- Next-section preloading improves perceived performance
```

---

## Prompt 1I: Accessibility Foundation

```
Implement accessibility infrastructure with multi-language support and user preference controls.

Current: Basic ARIA labels, ThemeContext for dark/light mode
Target: Comprehensive accessibility with language switching

Implementation:
- Extend ThemeContext with language state (English/Spanish)
- Create AccessibilityToolbar component with user preferences
- Add font size scaling (12px-24px range) and contrast adjustments
- Enhance ARIA labels throughout component tree
- Implement keyboard navigation foundations

Integration Requirements:
- Preserve existing ThemeContext functionality
- Maintain theme switching performance
- Ensure preferences persist with localStorage
- Keep component APIs unchanged

Success Criteria:
- Multi-language switching operational (English/Spanish)
- Accessibility toolbar functional with persistent preferences
- WCAG 2.1 AA baseline compliance achieved
- Font scaling and contrast controls working
```

---

## Prompt 1J: Parallax Foundation

```
Build parallax scrolling foundation with GPU acceleration and motion preference detection.

Current: WaveBackground provides 58fps performance baseline
Target: Multi-layer parallax with performance monitoring

Implementation:
- Enhance WaveBackground with scroll-based depth layers (3 layers)
- Create useScrollTrigger hook with intersection observer
- Implement smooth scroll detection with throttling (16ms intervals)
- Add GPU-accelerated transform calculations (transform3d)
- Create responsive parallax scaling for mobile devices

Performance Requirements:
- Maintain WaveBackground 58fps+ baseline
- Implement prefers-reduced-motion detection
- Add performance budgets for parallax features
- Ensure mobile compatibility with touch scrolling

Success Criteria:
- Parallax foundation providing smooth 60fps scrolling
- prefers-reduced-motion integration working correctly
- GPU acceleration operational with transform3d
- Mobile parallax scaling responsive and performant
```

---

## Phase 1 Validation Commands

```bash
# Bundle size validation
npm run build && ls -la dist/assets/ | grep -E "\.(js|css)$"

# Performance validation  
# Check console for: "[WaveBackground] Animation health: XX fps"
# Verify: "[Performance] Component - event: {data}" logs

# Accessibility validation
# Test keyboard navigation: Tab through all interactive elements
# Verify ARIA labels: Inspect elements for aria-label attributes
# Check color contrast: Use browser dev tools accessibility panel

# Success metrics to verify:
# - Initial bundle < 500KB (currently ~240KB main + heavy chunks)
# - Heavy components load < 2s  
# - FPS maintained at 58fps+
# - Accessibility toolbar operational
# - Multi-language toggle working
```

**Phase 1 → Phase 2 Prerequisites**: All infrastructure operational with performance targets achieved.
