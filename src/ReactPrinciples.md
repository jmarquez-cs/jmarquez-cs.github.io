# Combined React Architecture Principles

Check these again as you go:

Interface contracts (what components expect)  
Implementation reality (what's actually provided)  
Method signatures (how functions are called vs defined)

This guide consolidates core React architecture principles and hook-specific best practices for React v18.x, organized from higher-order concerns (architecture, state management, and rendering) to lower-order concerns (specific hook usage and optimizations).

In conjunction to following React's declarative paradigm, ensure a loose coupling software design principle.

## High-Level Architecture Principles

These foundational principles ensure scalable and maintainable React applications.

### Adhere to Component Architecture Guidelines

Assign each component a single responsibility to promote clarity and reusability.  
Minimize dependencies to ensure loose coupling between components.  
Communicate via props for parent-child relationships; use Context only when prop drilling hinders readability.  
Confine event logic to event handlers, avoiding Effects for event-driven logic.

### Avoid Excessive Context Usage

**Anti-Pattern**: Treating React Context as a global state management solution.  
This creates performance bottlenecks, infinite re-renders, tight coupling, and testing challenges.

**Solution**: Limit Context to dependency injection and prop drilling avoidance. Reserve it for truly shared concerns across distant components, such as theme or authentication data.

### Prioritize Performance Considerations

Split large contexts into smaller, targeted ones to reduce unnecessary re-renders.  
Apply `React.memo` to expensive components to prevent re-renders when props are unchanged.  
Maintain stable references for context values to avoid cascading re-renders.  
Monitor and optimize re-renders through composition and memoization techniques.

## State Management Principles

Effective state management ensures predictable updates and minimizes bugs.

### Follow State Management Best Practices

Transform data at the component's top level to ensure automatic re-execution on changes.  
Handle user events in dedicated event handlers for precise control.  
Avoid `setState` in `useEffect` without accurate dependency arrays to prevent infinite loops.  
Stabilize context values and dependencies to avoid unintended re-renders.

### Use useReducer for Complex State Logic

**Principle**: Employ `useReducer` for managing complex state transitions or when state updates depend on previous state and actions.

**When to Use useReducer**:

- For state machines or multi-step workflows (e.g., form wizards, game states).
- When state updates involve multiple sub-values or conditional logic.
- To centralize state logic for better testability and predictability.

**Anti-Pattern**: Using `useReducer` for simple state.

- Overcomplicates basic toggles or counters, adding unnecessary boilerplate.

**Solution**: Reserve `useReducer` for scenarios with structured actions or reusable logic. Memoize the reducer function to prevent re-creation.

### Use useState for Simple, Independent State

**Principle**: Use `useState` for managing simple, component-scoped state that does not require complex updates.

**When to Use useState**:

- For independent state like toggles, counters, or form inputs.
- When state updates are straightforward without deep logic.

**Anti-Pattern**: Overusing `useState` for complex state logic.

- Managing multiple related state variables can lead to fragmented updates and bugs.

**Solution**: Consolidate related state into a single object with `useState` or use `useReducer` for complex logic.

## Rendering Optimization Principles

Optimize rendering to enhance performance and prevent unnecessary updates.

### Prevent Re-Renders with Composition

Leverage composition to isolate state and minimize re-renders in heavy components.

#### Move State Down

Encapsulate state in smaller components when it affects only isolated render tree portions.  
Example: Manage dialog state and its trigger in a dedicated component to prevent parent re-renders.

#### Use Children as Props

Wrap state around children to isolate changes.  
Extract state management into a smaller component and pass slow-rendering sections as `children`.  
Treat `children` as stable props to avoid re-renders on state shifts.

#### Pass Components as Props

Encapsulate state in a smaller component and pass independent heavy components as props.  
Props remain stable during state changes, reducing re-renders.

#### Anti-Pattern: Create Components in Render Functions

**Anti-Pattern**: Defining components inside another component's render function.  
React re-mounts these on every re-render, causing:

- Content flashes.
- State resets.
- Unintended `useEffect` triggers.
- Focus loss.

**Solution**: Declare components outside render functions or as standalone entities.

### Prevent Re-Renders with React.memo and Memoization

Wrap components in `React.memo` to block upstream re-render propagation unless props change.

#### Apply React.memo to Components with Props

Memoize all non-primitive props for `React.memo` effectiveness.  
Apply `React.memo` to passed elements for props or children.  
Avoid memoizing parents alone, as objects change per render.

#### Use Memoization Necessarily

Memoize non-primitive values for `React.memo`-wrapped children.  
Memoize dependencies in hooks like `useEffect`, `useMemo`, or `useCallback`.  
Reserve `useMemo` for expensive calculations, such as React elements in render trees.  
Ignore minor operations like sorting.

#### Anti-Pattern: Unnecessary Memoization on Props

**Anti-Pattern**: Memoizing props without `React.memo` on children.  
Parent re-renders still trigger children regardless.

**Solution**: Memoize only when essential, ensuring `React.memo` is applied to relevant components.

### Improve Re-Render Performance of Lists

Wrap list items in `React.memo` to prevent re-renders.  
Provide consistent string keys, such as item IDs.  
Use array indices only for static lists.

#### Anti-Pattern: Use Random Values as Keys

**Anti-Pattern**: Assigning random keys.  
This forces re-mounts on every re-render, degrading performance.

**Solution**: Ensure keys remain stable across renders.

#### Optimize Hook Usage in Lists

Ensure each list item’s hooks are isolated to prevent state bleed.  
Use `React.memo` on list item components to avoid re-renders.  
Assign stable, unique keys to maintain hook state correctly.  
Avoid `useState` or `useReducer` in list items if state can be managed at a higher level.

### Prevent Re-Renders Caused by Context

Group context optimizations to enhance scalability.

#### Memoize Provider Values

Memoize values if Providers might re-render from ancestors to prevent unnecessary consumer updates.

#### Split Data and API

Separate data and API into distinct Providers.  
API consumers skip re-renders on data updates.

#### Split Data into Chunks

Divide independent data into smaller Providers.  
Only affected consumers re-render.

#### Implement Context Selectors

Simulate selectors with higher-order components and `React.memo` to fake partial updates.

## External System Integration Principles

These principles address synchronization with external systems and non-blocking updates.

### Use Effects as an Escape Hatch

**Principle**: Employ `useEffect` solely to synchronize with external systems, stepping outside React’s flow.

**When Not to Use Effects**:

- Transform data for rendering (use component top-level logic).
- Handle user events (use dedicated event handlers).

**When to Use Effects**:

- Integrate with external systems like jQuery widgets, networks, or DOM elements.
- Fetch data, preferring framework-built mechanisms where available.

### Use useSyncExternalStore for External Store Integration

**Principle**: Use `useSyncExternalStore` to safely subscribe to external stores while ensuring compatibility with React’s concurrent rendering.

**When to Use useSyncExternalStore**:

- To integrate with external state sources like Redux or browser APIs (e.g., `window.localStorage`).
- When building custom hooks that synchronize with external systems.

**Anti-Pattern**: Using `useState` or `useEffect` for external store subscriptions.

- Risks stale data or race conditions in concurrent rendering.

**Solution**: Implement `useSyncExternalStore` with a stable `getSnapshot` function and proper subscription cleanup.

### Use useRef for Persistent, Non-Rendering References

**Principle**: Use `useRef` to store mutable values that persist across renders without triggering re-renders.

**When to Use useRef**:

- To access or manipulate DOM elements (e.g., focusing an input).
- To store values like timers or previous state without affecting rendering.

**Anti-Pattern**: Using `useRef` as a substitute for state.

- Modifying `ref.current` to drive rendering bypasses React’s model, causing bugs.

**Solution**: Use `useState` or `useReducer` for rendering-related state. Stabilize `useRef` values in dependency arrays.

### Use useTransition for Non-Blocking UI Updates

**Principle**: Leverage `useTransition` to mark state updates as non-urgent, keeping the UI responsive during heavy computations.

**When to Use useTransition**:

- For deferring expensive updates like filtering large lists.
- To prioritize critical updates (e.g., input typing) over secondary ones.

**Anti-Pattern**: Overusing `useTransition` for all updates.

- Can obscure critical updates and degrade performance.

**Solution**: Use selectively for non-critical updates. Combine with `React.memo` for affected components.

## Hook-Specific Optimization Principles

### Stabilize Hook Dependencies

Ensure dependencies for hooks like `useEffect`, `useMemo`, or `useCallback` are stable to prevent infinite loops or re-renders.

- Memoize callbacks with `useCallback` for `React.memo`-wrapped components.
- Memoize complex objects with `useMemo` in dependency arrays.
- Avoid inline objects or functions in dependency arrays.

### Anti-Pattern: Mixing Hook Responsibilities

**Anti-Pattern**: Combining multiple hooks for tasks better suited to one.

- Example: Using `useState` and `useEffect` to mimic `useReducer` for complex state.

**Solution**: Choose the appropriate hook: `useReducer` for complex state, `useRef` for persistence, `useTransition` for performance-critical updates.

## React vs Vanilla JavaScript Complexity

### Avoid Over-Engineering Simple Animations

**Principle**: When debugging performance issues with animations, compare React implementation complexity against vanilla JavaScript equivalents.

**Anti-Pattern**: Over-engineering simple, stable animations with complex React patterns.

- Using complex dependency arrays and useCallback/useEffect chains for simple animation loops.
- Implementing canvas sizing with potential constant re-sizing instead of one-time setup.
- Managing animation frames through multiple refs instead of direct requestAnimationFrame calls.
- Adding React lifecycle complexity where vanilla JavaScript patterns were stable and sufficient.

**Debugging Strategy**:

1. **Compare implementation complexity** - Check if the vanilla version was simpler and more stable
2. **Identify React over-engineering** - Look for unnecessary useCallback, useEffect dependency management
3. **Examine canvas/DOM manipulation** - React's lifecycle might interfere with direct DOM/canvas operations
4. **Consider hybrid approaches** - Some animations work better with direct JavaScript inside useEffect with empty dependencies

**Solution**: When React's lifecycle management interferes with stable animations, prefer simpler patterns that mirror the original vanilla implementation, even if it means bypassing some React conventions for performance-critical animations.
