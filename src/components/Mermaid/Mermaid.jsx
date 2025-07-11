import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import './mermaid.css';
import { useTheme } from '../../hooks/useTheme';

export const Mermaid = () => {
  const { theme } = useTheme();

  const lightThemeConfig = {
    // General
    fontFamily: 'Inter Tight, sans-serif',
    fontSize: '16px',
    textColor: '#0a0d1a', // --text-primary
    darkMode: false,
    background: '#f7f7f7', // --rican-white

    // Nodes
    primaryColor: '#eafcfa', // --mint-500
    primaryTextColor: '#0c0f1d', // --rican-black
    primaryBorderColor: '#97f0e5', // --rican-mint
    secondaryColor: '#f6ce9e', // --pears
    secondaryTextColor: '#0c0f1d', // Derived from --rican-black
    secondaryBorderColor: '#f97946', // Derived from --mandarin
    tertiaryColor: '#8cf28a', // --lime
    tertiaryTextColor: '#0c0f1d', // Derived from --rican-black
    tertiaryBorderColor: '#6bcc69', // Derived from --lime

    // Lines/Edges
    lineColor: '#37c5b3', // --mint-800
    arrowheadColor: '#37c5b3', // --mint-800
    edgeColor: '#37c5b3', // --mint-800
    defaultLinkColor: '#37c5b3', // --mint-800

    // Clusters
    clusterBkg: '#e9ccff', // --grape-500
    clusterBorder: '#c584f6', // --grape-700

    // Notes
    noteBkgColor: '#f9d546', // --banana
    noteTextColor: '#0c0f1d', // --rican-black
    noteBorderColor: '#f97946', // --mandarin

    // Error
    errorBkgColor: '#f87171', // --text-error
    errorTextColor: '#b91c1c', // --text-error

    // Flowchart specific
    nodeBorder: '#97f0e5', // --rican-mint
    nodeTextColor: '#0c0f1d', // --rican-black
    edgeLabelBackground: '#eafcfa', // --mint-500
    titleColor: '#0a0d1a', // --text-primary

    // Sequence Diagram specific
    actorBkg: '#f7f7f7', // --rican-white
    actorBorder: '#97f0e5', // --rican-mint
    actorTextColor: '#0c0f1d', // --rican-black
    actorLineColor: '#37c5b3', // --mint-800
    signalColor: '#0a0d1a', // --text-primary
    signalTextColor: '#0a0d1a', // --text-primary
    labelBoxBkgColor: '#f7f7f7', // --rican-white
    labelBoxBorderColor: '#97f0e5', // --rican-mint
    labelTextColor: '#0c0f1d', // --rican-black
    loopTextColor: '#0c0f1d', // --rican-black
    activationBorderColor: '#f6ce9e', // --pears
    activationBkgColor: '#f6ce9e', // --pears
    sequenceNumberColor: '#0a0d1a', // --text-primary

    // Gantt specific
    sectionBkgColor: '#eafcfa', // --mint-500
    altSectionBkgColor: '#f7f7f7', // --rican-white
    sectionBkgColor2: '#eafcfa', // --mint-500
    taskBorderColor: '#97f0e5', // --rican-mint
    taskBkgColor: '#eafcfa', // --mint-500
    activeTaskBorderColor: '#0c0f1d', // --rican-black
    activeTaskBkgColor: '#37c5b3', // --mint-800
    gridColor: '#e5e5e5', // Light grey
    doneTaskBkgColor: '#cbfaf4', // --mint-600
    doneTaskBorderColor: '#97f0e5', // --rican-mint
    critBorderColor: '#b91c1c', // --text-error
    critBkgColor: '#f87171', // --text-error
    todayLineColor: '#b91c1c', // --text-error
    taskTextColor: '#0c0f1d', // --rican-black
    taskTextOutsideColor: '#0c0f1d', // --rican-black
    activeTaskBorderColor: '#0c0f1d', // --rican-black
    activeTaskBkgColor: '#37c5b3', // --mint-800
    gridColor: '#e5e5e5', // Light grey
    doneTaskBkgColor: '#cbfaf4', // --mint-600
    doneTaskBorderColor: '#97f0e5', // --rican-mint
    critBorderColor: '#b91c1c', // --text-error
    critBkgColor: '#f87171', // --text-error
    todayLineColor: '#b91c1c', // --text-error
    taskTextColor: '#0c0f1d', // --rican-black
    taskTextOutsideColor: '#0c0f1d', // --rican-black
    taskTextLightColor: '#0c0f1d', // --rican-black
    taskTextDarkColor: '#0c0f1d', // --rican-black
    taskTextClickableColor: '#2563eb', // --focus-ring

    // State Diagram specific
    transitionColor: '#37c5b3', // --mint-800
    transitionLabelColor: '#0a0d1a', // --text-primary
    stateLabelColor: '#0a0d1a', // --text-primary
    stateBkg: '#eafcfa', // --mint-500
    labelBackgroundColor: '#f7f7f7', // --rican-white
    compositeBackground: '#f7f7f7', // --rican-white
    altBackground: '#e9ccff', // --grape-500
    compositeTitleBackground: '#f7f7f7', // --rican-white
    compositeBorder: '#97f0e5', // --rican-mint
    innerEndBackground: '#97f0e5', // --rican-mint
    specialStateColor: '#0a0d1a', // --text-primary

    // Class Diagram specific
    classText: '#0a0d1a', // --text-primary
    attributeBackgroundColorOdd: '#f7f7f7', // --rican-white
    attributeBackgroundColorEven: '#eafcfa', // --mint-500

    // User Journey specific
    fillType0: '#eafcfa', // --mint-500
    fillType1: '#f6ce9e', // --pears
    fillType2: '#8cf28a', // --lime
    compositeTitleBackground: '#f7f7f7', // --rican-white
    compositeBorder: '#97f0e5', // --rican-mint
    innerEndBackground: '#97f0e5', // --rican-mint
    specialStateColor: '#0a0d1a', // --text-primary

    // Class Diagram specific
    classText: '#0a0d1a', // --text-primary
    attributeBackgroundColorOdd: '#f7f7f7', // --rican-white
    attributeBackgroundColorEven: '#eafcfa', // --mint-500

    // User Journey specific
    fillType0: '#eafcfa', // --mint-500
    fillType1: '#f6ce9e', // --pears
    fillType2: '#8cf28a', // --lime
    fillType3: '#f946ac', // --guava
    fillType4: '#f97946', // --mandarin
    fillType5: '#613dff', // --blueberry
    fillType6: '#f9d546', // --banana
    fillType7: '#4a3b2b', // --almond

    // Pie Chart specific
    pie1: '#eafcfa', // --mint-500
    pie2: '#f6ce9e', // --pears
    pie3: '#8cf28a', // --lime
    pie4: '#f946ac', // --guava
    pie5: '#f97946', // --mandarin
    pie6: '#613dff', // --blueberry
    pie7: '#f9d546', // --banana
    pie8: '#4a3b2b', // --almond
    pie9: '#089280', // --mint-900
    pie10: '#37c5b3', // --mint-800
    pie11: '#97f0e5', // --rican-mint
    pie12: '#cbfaf4', // --mint-600
    pieTitleTextSize: '25px',
    pieTitleTextColor: '#0c0f1d', // --rican-black
    pieSectionTextSize: '17px',
    pieSectionTextColor: '#0c0f1d', // --rican-black
    pieLegendTextSize: '17px',
    pieLegendTextColor: '#0c0f1d', // --rican-black
    pieStrokeColor: '#0c0f1d', // --rican-black
    pieStrokeWidth: '2px',
    pieOuterStrokeWidth: '2px',
    pieOuterStrokeColor: '#0c0f1d', // --rican-black
    pieOpacity: '0.7',

    // Quadrant Chart specific
    quadrant1Fill: '#eafcfa', // --mint-500
    quadrant2Fill: '#f6ce9e', // --pears
    quadrant3Fill: '#8cf28a', // --lime
    quadrant4Fill: '#f946ac', // --guava
    quadrant1TextFill: '#0c0f1d', // --rican-black
    quadrant2TextFill: '#0c0f1d', // --rican-black
    quadrant3TextFill: '#0c0f1d', // --rican-black
    quadrant4TextFill: '#0c0f1d', // --rican-black
    quadrantPointFill: '#0c0f1d', // --rican-black
    quadrantPointTextFill: '#0c0f1d', // --rican-black
    quadrantXAxisTextFill: '#0c0f1d', // --rican-black
    quadrantYAxisTextFill: '#0c0f1d', // --rican-black
    quadrantInternalBorderStrokeFill: '#97f0e5', // --rican-mint
    quadrantExternalBorderStrokeFill: '#97f0e5', // --rican-mint
    quadrantTitleFill: '#0c0f1d', // --rican-black

    // XY Chart specific
    xyChart: {
      backgroundColor: '#f7f7f7', // --rican-white
      titleColor: '#0c0f1d', // --rican-black
      xAxisTitleColor: '#0c0f1d', // --rican-black
      xAxisLabelColor: '#0c0f1d', // --rican-black
      xAxisTickColor: '#0c0f1d', // --rican-black
      xAxisLineColor: '#0c0f1d', // --rican-black
      yAxisTitleColor: '#0c0f1d', // --rican-black
      yAxisLabelColor: '#0c0f1d', // --rican-black
      yAxisTickColor: '#0c0f1d', // --rican-black
      yAxisLineColor: '#0c0f1d', // --rican-black
      plotColorPalette: '#eafcfa,#f6ce9e,#8cf28a,#f946ac,#f97946,#613dff,#f9d546,#4a3b2b,#089280,#37c5b3', // Your palette
    },

    // Git Graph specific
    git0: '#eafcfa', // --mint-500
    git1: '#f6ce9e', // --pears
    git2: '#8cf28a', // --lime
    git3: '#f946ac', // --guava
    git4: '#f97946', // --mandarin
    git5: '#613dff', // --blueberry
    git6: '#f9d546', // --banana
    git7: '#4a3b2b', // --almond
    gitInv0: '#0c0f1d', // --rican-black
    gitInv1: '#0c0f1d', // --rican-black
    gitInv2: '#0c0f1d', // --rican-black
    gitInv3: '#0c0f1d', // --rican-black
    gitInv4: '#0c0f1d', // --rican-black
    gitInv5: '#0c0f1d', // --rican-black
    gitInv6: '#0c0f1d', // --rican-black
    gitInv7: '#0c0f1d', // --rican-black
    branchLabelColor: '#0c0f1d', // --rican-black
    gitBranchLabel0: '#0c0f1d', // --rican-black
    gitBranchLabel1: '#0c0f1d', // --rican-black
    gitBranchLabel2: '#0c0f1d', // --rican-black
    gitBranchLabel3: '#0c0f1d', // --rican-black
    gitBranchLabel4: '#0c0f1d', // --rican-black
    gitBranchLabel5: '#0c0f1d', // --rican-black
    gitBranchLabel6: '#0c0f1d', // --rican-black
    gitBranchLabel7: '#0c0f1d', // --rican-black
    tagLabelColor: '#0c0f1d', // --rican-black
    tagLabelBackground: '#eafcfa', // --mint-500
    tagLabelBorder: '#97f0e5', // --rican-mint
    tagLabelFontSize: '10px',
    commitLabelColor: '#0c0f1d', // --rican-black
    commitLabelBackground: '#f6ce9e', // --pears
    commitLabelFontSize: '10px',

    // Class Diagram specific
    classText: '#0a0d1a', // --text-primary
    attributeBackgroundColorOdd: '#f7f7f7', // --rican-white
    attributeBackgroundColorEven: '#eafcfa', // --mint-500
  };

  const darkThemeConfig = {
    // General
    fontFamily: 'Inter Tight, sans-serif',
    fontSize: '16px',
    textColor: '#fafafa', // --text-primary
    darkMode: true,
    background: '#0c0f1d', // --rican-black

    // Nodes
    primaryColor: '#1a1d2e', // --bg-secondary
    primaryTextColor: '#fafafa', // --text-primary
    primaryBorderColor: '#37c5b3', // --mint-800
    secondaryColor: '#613dff', // --blueberry
    secondaryTextColor: '#fafafa', // Derived from --text-primary
    secondaryBorderColor: '#97f0e5', // Derived from --text-accent
    tertiaryColor: '#f946ac', // --guava
    tertiaryTextColor: '#fafafa', // Derived from --text-primary
    tertiaryBorderColor: '#f759b7', // Derived from --guava

    // Lines/Edges (High Contrast for Dark Theme)
    lineColor: '#f7f7f7', // --rican-white
    arrowheadColor: '#f7f7f7', // --rican-white
    edgeColor: '#f7f7f7', // --rican-white
    defaultLinkColor: '#f7f7f7', // --rican-white

    // Clusters
    clusterBkg: '#252842', // --bg-alt
    clusterBorder: '#a56ff1', // --grape-800

    // Notes
    noteBkgColor: '#f9d546', // --banana
    noteTextColor: '#0c0f1d', // --rican-black
    noteBorderColor: '#f97946', // --mandarin

    // Error
    errorBkgColor: '#b91c1c', // --text-error
    errorTextColor: '#f87171', // --text-error

    // Flowchart specific
    nodeBorder: '#37c5b3', // --mint-800
    nodeTextColor: '#fafafa', // --text-primary
    edgeLabelBackground: '#1a1d2e', // --bg-secondary
    titleColor: '#fafafa', // --text-primary

    // Sequence Diagram specific
    actorBkg: '#0c0f1d', // --rican-black
    actorBorder: '#37c5b3', // --mint-800
    actorTextColor: '#fafafa', // --text-primary
    actorLineColor: '#f7f7f7', // --rican-white
    signalColor: '#fafafa', // --text-primary
    signalTextColor: '#fafafa', // --text-primary
    labelBoxBkgColor: '#0c0f1d', // --rican-black
    labelBoxBorderColor: '#37c5b3', // --mint-800
    labelTextColor: '#fafafa', // --text-primary
    loopTextColor: '#fafafa', // --text-primary
    activationBorderColor: '#613dff', // --blueberry
    activationBkgColor: '#613dff', // --blueberry
    sequenceNumberColor: '#fafafa', // --text-primary

    // Gantt specific
    sectionBkgColor: '#1a1d2e', // --bg-secondary
    altSectionBkgColor: '#0c0f1d', // --rican-black
    sectionBkgColor2: '#1a1d2e', // --bg-secondary
    taskBorderColor: '#37c5b3', // --mint-800
    taskBkgColor: '#1a1d2e', // --bg-secondary
    activeTaskBorderColor: '#fafafa', // --text-primary
    activeTaskBkgColor: '#97f0e5', // --text-accent
    gridColor: '#4a4a4a', // Dark grey
    doneTaskBkgColor: '#252842', // --bg-alt
    doneTaskBorderColor: '#37c5b3', // --mint-800
    critBorderColor: '#f87171', // --text-error
    critBkgColor: '#b91c1c', // --text-error
    todayLineColor: '#f87171', // --text-error
    taskTextColor: '#fafafa', // --text-primary
    taskTextOutsideColor: '#fafafa', // --text-primary
    activeTaskBorderColor: '#fafafa', // --text-primary
    activeTaskBkgColor: '#97f0e5', // --text-accent
    gridColor: '#4a4a4a', // Dark grey
    doneTaskBkgColor: '#252842', // --bg-alt
    doneTaskBorderColor: '#37c5b3', // --mint-800
    critBorderColor: '#f87171', // --text-error
    critBkgColor: '#b91c1c', // --text-error
    todayLineColor: '#f87171', // --text-error
    taskTextColor: '#fafafa', // --text-primary
    taskTextOutsideColor: '#fafafa', // --text-primary
    taskTextLightColor: '#fafafa', // --text-primary
    taskTextDarkColor: '#fafafa', // --text-primary
    taskTextClickableColor: '#60a5fa', // --focus-ring

    // State Diagram specific
    transitionColor: '#f7f7f7', // --rican-white
    transitionLabelColor: '#fafafa', // --text-primary
    stateLabelColor: '#fafafa', // --text-primary
    stateBkg: '#1a1d2e', // --bg-secondary
    labelBackgroundColor: '#0c0f1d', // --rican-black
    compositeBackground: '#0c0f1d', // --rican-black
    altBackground: '#252842', // --bg-alt
    compositeTitleBackground: '#0c0f1d', // --rican-black
    compositeBorder: '#37c5b3', // --mint-800
    innerEndBackground: '#37c5b3', // --mint-800
    specialStateColor: '#fafafa', // --text-primary

    // Class Diagram specific
    classText: '#fafafa', // --text-primary
    attributeBackgroundColorOdd: '#0c0f1d', // --rican-black
    attributeBackgroundColorEven: '#1a1d2e', // --bg-secondary

    // User Journey specific
    fillType0: '#1a1d2e', // --bg-secondary
    fillType1: '#613dff', // --blueberry
    fillType2: '#f946ac', // --guava
    compositeTitleBackground: '#0c0f1d', // --rican-black
    compositeBorder: '#37c5b3', // --mint-800
    innerEndBackground: '#37c5b3', // --mint-800
    specialStateColor: '#fafafa', // --text-primary

    // Class Diagram specific
    classText: '#fafafa', // --text-primary
    attributeBackgroundColorOdd: '#0c0f1d', // --rican-black
    attributeBackgroundColorEven: '#1a1d2e', // --bg-secondary

    // User Journey specific
    fillType0: '#1a1d2e', // --bg-secondary
    fillType1: '#613dff', // --blueberry
    fillType2: '#f946ac', // --guava
    fillType3: '#f97946', // --mandarin
    fillType4: '#f9d546', // --banana
    fillType5: '#4a3b2b', // --almond
    fillType6: '#97f0e5', // --text-accent
    fillType7: '#37c5b3', // --mint-800

    // Pie Chart specific
    pie1: '#1a1d2e', // --bg-secondary
    pie2: '#613dff', // --blueberry
    pie3: '#f946ac', // --guava
    pie4: '#f97946', // --mandarin
    pie5: '#f9d546', // --banana
    pie6: '#4a3b2b', // --almond
    pie7: '#97f0e5', // --text-accent
    pie8: '#37c5b3', // --mint-800
    pie9: '#089280', // --mint-900
    pie10: '#cbfaf4', // --mint-600
    pie11: '#eafcfa', // --mint-500
    pie12: '#f7f7f7', // --rican-white
    pieTitleTextSize: '25px',
    pieTitleTextColor: '#fafafa', // --text-primary
    pieSectionTextSize: '17px',
    pieSectionTextColor: '#fafafa', // --text-primary
    pieLegendTextSize: '17px',
    pieLegendTextColor: '#fafafa', // --text-primary
    pieStrokeColor: '#fafafa', // --text-primary
    pieStrokeWidth: '2px',
    pieOuterStrokeWidth: '2px',
    pieOuterStrokeColor: '#fafafa', // --text-primary
    pieOpacity: '0.7',

    // Quadrant Chart specific
    quadrant1Fill: '#1a1d2e', // --bg-secondary
    quadrant2Fill: '#613dff', // --blueberry
    quadrant3Fill: '#f946ac', // --guava
    quadrant4Fill: '#f97946', // --mandarin
    quadrant1TextFill: '#fafafa', // --text-primary
    quadrant2TextFill: '#fafafa', // --text-primary
    quadrant3TextFill: '#fafafa', // --text-primary
    quadrant4TextFill: '#fafafa', // --text-primary
    quadrantPointFill: '#fafafa', // --text-primary
    quadrantPointTextFill: '#fafafa', // --text-primary
    quadrantXAxisTextFill: '#fafafa', // --text-primary
    quadrantYAxisTextFill: '#fafafa', // --text-primary
    quadrantInternalBorderStrokeFill: '#37c5b3', // --mint-800
    quadrantExternalBorderStrokeFill: '#37c5b3', // --mint-800
    quadrantTitleFill: '#fafafa', // --text-primary

    // XY Chart specific
    xyChart: {
      backgroundColor: '#0c0f1d', // --rican-black
      titleColor: '#fafafa', // --text-primary
      xAxisTitleColor: '#fafafa', // --text-primary
      xAxisLabelColor: '#fafafa', // --text-primary
      xAxisTickColor: '#fafafa', // --text-primary
      xAxisLineColor: '#fafafa', // --text-primary
      yAxisTitleColor: '#fafafa', // --text-primary
      yAxisLabelColor: '#fafafa', // --text-primary
      yAxisTickColor: '#fafafa', // --text-primary
      yAxisLineColor: '#fafafa', // --text-primary
      plotColorPalette: '#1a1d2e,#613dff,#f946ac,#f97946,#f9d546,#4a3b2b,#97f0e5,#37c5b3,#089280,#cbfaf4', // Your palette
    },

    // Git Graph specific
    git0: '#1a1d2e', // --bg-secondary
    git1: '#613dff', // --blueberry
    git2: '#f946ac', // --guava
    git3: '#f97946', // --mandarin
    git4: '#f9d546', // --banana
    git5: '#4a3b2b', // --almond
    git6: '#97f0e5', // --text-accent
    git7: '#37c5b3', // --mint-800
    gitInv0: '#fafafa', // --text-primary
    gitInv1: '#fafafa', // --text-primary
    gitInv2: '#fafafa', // --text-primary
    gitInv3: '#fafafa', // --text-primary
    gitInv4: '#fafafa', // --text-primary
    gitInv5: '#fafafa', // --text-primary
    gitInv6: '#fafafa', // --text-primary
    gitInv7: '#fafafa', // --text-primary
    branchLabelColor: '#fafafa', // --text-primary
    gitBranchLabel0: '#fafafa', // --text-primary
    gitBranchLabel1: '#fafafa', // --text-primary
    gitBranchLabel2: '#fafafa', // --text-primary
    gitBranchLabel3: '#fafafa', // --text-primary
    gitBranchLabel4: '#fafafa', // --text-primary
    gitBranchLabel5: '#fafafa', // --text-primary
    gitBranchLabel6: '#fafafa', // --text-primary
    gitBranchLabel7: '#fafafa', // --text-primary
    tagLabelColor: '#fafafa', // --text-primary
    tagLabelBackground: '#1a1d2e', // --bg-secondary
    tagLabelBorder: '#37c5b3', // --mint-800
    tagLabelFontSize: '10px',
    commitLabelColor: '#fafafa', // --text-primary
    commitLabelBackground: '#613dff', // --blueberry
    commitLabelFontSize: '10px',

    // Class Diagram specific
    classText: '#fafafa', // --text-primary
    attributeBackgroundColorOdd: '#0c0f1d', // --rican-black
    attributeBackgroundColorEven: '#1a1d2e', // --bg-secondary
  };

  const [syntax, setSyntax] = useState(`sequenceDiagram
    participant User
    participant Renderer as React UI (Renderer)
    participant IPCR as IPC Renderer
    participant IPCM as IPC Main
    participant Main as Main Process
    participant CP as Child Process
    participant Store as Redux Store

    User->>Renderer: Click "Create Address"
    Renderer->>IPCR: invoke('execute-cli', 'dwallet client new-address --json')
    IPCR->>IPCM: handle('execute-cli')
    IPCM->>Main: Execute command
    Main->>CP: exec('dwallet client new-address --json')
    CP->>Main: stdout (JSON: address, keypair), stderr, exitCode
    Main->>Main: Parse and validate JSON
    alt Valid JSON
        Main->>IPCM: Return parsed JSON
        IPCM->>IPCR: Resolve promise
        IPCR->>Renderer: Receive JSON
        Renderer->>Store: Dispatch updateAddresses(json)
        Store->>Renderer: Update state
        Renderer->>User: Display address/keypair in table
        Renderer->>IPCR: invoke('execute-cli', 'dwallet client gas --json')
        IPCR->>IPCM: handle('execute-cli')
        IPCM->>Main: Execute command
        Main->>CP: exec('dwallet client gas --json')
        CP->>Main: stdout (JSON: gas objects), stderr, exitCode
        Main->>Main: Parse and validate JSON
        alt Valid JSON
            Main->>IPCM: Return parsed JSON
            IPCM->>IPCR: Resolve promise
            IPCR->>Renderer: Receive JSON
            Renderer->>Store: Dispatch updateBalances(json)
            Store->>Renderer: Update state
            Renderer->>User: Display balance in table
        else Error
            Main->>IPCM: Return error
            IPCM->>IPCR: Reject promise
            IPCR->>Renderer: Show error
            Renderer->>User: Display error message
        end
    else Error
        Main->>IPCM: Return error
        IPCM->>IPCR: Reject promise
        IPCR->>Renderer: Show error
        Renderer->>User: Display error message
    end
    note right of Renderer: 'dwallet client objects' follows similar flow`);
  const [diagram, setDiagram] = useState('');
  const rightRef = useRef(null);

  useEffect(() => {
    const currentThemeConfig = {
      theme: 'base',
      themeVariables: theme === 'light' ? lightThemeConfig : darkThemeConfig,
    };
    console.log('Mermaid Initialize Config:', currentThemeConfig);
    mermaid.initialize(currentThemeConfig);

    const renderDiagram = async () => {
      try {
        // Clear previous diagram to force re-render with new theme
        if (rightRef.current) {
          rightRef.current.innerHTML = '';
        }
        const { svg } = await mermaid.render('mermaid-graph', syntax);
        setDiagram(svg);
      } catch (error) {
        setDiagram(`<p>Error rendering diagram: ${error.message}</p>`);
      }
    };

    renderDiagram();
  }, [syntax, theme]);

  const downloadSVG = () => {
    if (!diagram) return;
    const blob = new Blob([diagram], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svgElement = rightRef.current?.querySelector('svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const bbox = svgElement.getBBox();
    canvas.width = bbox.width * 2; // Higher resolution
    canvas.height = bbox.height * 2;
    const ctx = canvas.getContext('2d');
    ctx.scale(2, 2);

    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const pngUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = 'diagram.png';
          a.click();
          URL.revokeObjectURL(pngUrl);
        }
      }, 'image/png');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">Mermaid Diagram</h2>
        <div className="mermaid-container">
          <div className="mermaid-editor">
            <textarea
              value={syntax}
              onChange={(e) => setSyntax(e.target.value)}
            />
            <div className="mermaid-buttons">
              <button className="btn btn-primary" onClick={downloadSVG}>Download SVG</button>
              <button className="btn btn-secondary" onClick={downloadPNG}>Download PNG</button>
            </div>
          </div>
          <div
            className="mermaid-diagram"
            ref={rightRef}
            dangerouslySetInnerHTML={{ __html: diagram }}
          />
        </div>
      </div>
    </section>
  );
};