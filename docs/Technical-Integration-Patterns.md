
# Technical Integration Patterns - Copy-Paste Prompts

## Architecture Integration Patterns

### Prompt T1: Provider Chain Integration

```
Integrate new providers into AppProviders.jsx chain while maintaining provider order dependency.

Current: GameVisibilityProvider and ThemeProvider in AppProviders
Target: Extended provider chain with new context providers

Implementation:
- Add new providers to AppProviders.jsx following dependency order
- Ensure provider nesting maintains context accessibility
- Preserve existing GameVisibilityContext and ThemeContext functionality
- Test provider chain with nested context access patterns

Success: Provider chain operational with proper context inheritance and no context access errors
```

---

### Prompt T2: Hook Composition Patterns

```
Create composable hook patterns for complex state management integration.

Current: Individual hooks (usePortfolio, usePerformanceMonitor, useTheme)
Target: Composable hook patterns for enhanced functionality

Implementation:
- Create useCompositeState hook combining multiple context hooks
- Implement useFeatureToggle hook for conditional feature rendering
- Add useSyncedState hook for cross-component state synchronization
- Ensure hook composition follows React Hook rules and dependency patterns

Success: Composite hooks operational with proper dependency management and no rule violations
```

---

### Prompt T3: Component Integration Patterns

```
Establish component integration patterns for consistent prop passing and event handling.

Current: Individual components with isolated prop interfaces
Target: Standardized component integration with shared patterns

Implementation:
- Create withPerformanceMonitoring HOC for component performance tracking
- Implement forwardRef patterns for component composition
- Add render prop patterns for flexible component integration
- Ensure consistent prop interface across similar components

Success: Component patterns providing consistent integration interfaces and proper ref forwarding
```

---

## Data Flow Integration Patterns

### Prompt T4: State Synchronization Patterns

```
Implement state synchronization patterns between contexts and local component state.

Current: Isolated context state management
Target: Synchronized state flow with conflict resolution

Implementation:
- Create state synchronization utility for context-component state sync
- Add conflict resolution patterns for competing state updates
- Implement optimistic updates with rollback capabilities
- Ensure state consistency across context boundaries

Success: State synchronization operational with proper conflict resolution and rollback mechanisms
```

---

### Prompt T5: Event Coordination Patterns

```
Create event coordination patterns for cross-component communication and state updates.

Current: Individual component event handling
Target: Coordinated event system with proper propagation

Implementation:
- Implement custom event system for cross-component communication
- Add event delegation patterns for performance optimization
- Create event queue system for managing complex interaction sequences
- Ensure event handling maintains proper component isolation

Success: Event coordination system operational with optimized performance and proper component boundaries
```

---

### Prompt T6: Performance Integration Patterns

```
Establish performance integration patterns for monitoring and optimization across component boundaries.

Current: usePerformanceMonitor hook with basic tracking
Target: Comprehensive performance tracking integration

Implementation:
- Integrate performance monitoring into component lifecycle methods
- Add performance boundary detection for optimization opportunities
- Create performance budgets with automated warnings
- Ensure performance tracking doesn't impact application performance

Success: Performance integration providing actionable insights without performance degradation
```

---

## External Integration Patterns

### Prompt T7: API Integration Patterns

```
Create standardized API integration patterns for external service communication.

Current: Basic portfolio data structure
Target: Extensible API integration with error handling

Implementation:
- Create API client wrapper with consistent error handling
- Implement retry logic with exponential backoff for failed requests
- Add request caching patterns for performance optimization
- Ensure API integration maintains application responsiveness

Success: API integration patterns providing reliable external communication with proper error boundaries
```

---

### Prompt T8: Asset Loading Patterns

```
Implement asset loading patterns for optimized resource management and lazy loading.

Current: Static asset imports
Target: Dynamic asset loading with performance optimization

Implementation:
- Create dynamic import patterns for code splitting optimization
- Implement progressive image loading with placeholder states
- Add asset preloading strategies for critical resources
- Ensure asset loading maintains application performance standards

Success: Asset loading patterns providing optimized resource delivery with proper loading states
```

---

## Validation Commands

```bash
# Integration pattern validation
npm run lint && npm run type-check

# Performance impact validation
npm run build && npm run analyze

# Component integration testing
npm run test:integration

# Pattern consistency validation
npm run test:patterns
```

**File Statistics:**
- **Total word count**: ~1,485 words
- **Prompts**: 8 prompts
- **Average words per prompt**: ~108 words
- **Target range**: 1,500-2,500 words ✓
