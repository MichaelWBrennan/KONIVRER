import React, {
  memo,
  Suspense,
  lazy,
  useState,
  useCallback,
  useEffect,
} from 'react';
import './App.css';

// Lazy load components for better performance
const PhysicalMatchmaking = lazy(
  () => import('./components/PhysicalMatchmaking'),
);
const AICardVerification = lazy(
  () => import('./components/AICardVerification'),
);
const BlockchainVerification = lazy(
  () => import('./components/BlockchainVerification'),
);
const MLDeckAnalysis = lazy(() => import('./components/MLDeckAnalysis'));
const AugmentedRealityViewer = lazy(
  () => import('./components/AugmentedRealityViewer'),
);
const WebGPUCardRenderer = lazy(
  () => import('./components/WebGPUCardRenderer'),
);
const WasmCardProcessor = lazy(() => import('./components/WasmCardProcessor'));
const WebRTCMatch = lazy(() => import('./components/WebRTCMatch'));
const ARCardScanner = lazy(() => import('./components/ARCardScanner'));
const TournamentBracket = lazy(() => import('./components/TournamentBracket'));
const DeckArchetypeAnalysis = lazy(
  () => import('./components/DeckArchetypeAnalysis'),
);

// Memoized header component
const Header = memo(() => (
  <header className="app-header">
    <h1>KONIVRER Next-Gen Platform</h1>
    <p className="app-subtitle">
      State-of-the-art TCG platform with AI, blockchain, WebGPU, WebXR, and edge
      computing
    </p>
  </header>
));

// Memoized navigation component
const Navigation = memo(({ activeTab, onTabChange }) => {
  return (
    <nav className="app-navigation">
      <button
        className={`nav-button ${activeTab === 'matchmaking' ? 'active' : ''}`}
        onClick={() => onTabChange('matchmaking')}
      >
        Physical Matchmaking
      </button>
      <button
        className={`nav-button ${activeTab === 'ai-verification' ? 'active' : ''}`}
        onClick={() => onTabChange('ai-verification')}
      >
        AI Card Verification
      </button>
      <button
        className={`nav-button ${activeTab === 'blockchain' ? 'active' : ''}`}
        onClick={() => onTabChange('blockchain')}
      >
        Blockchain Verification
      </button>
      <button
        className={`nav-button ${activeTab === 'ml-analysis' ? 'active' : ''}`}
        onClick={() => onTabChange('ml-analysis')}
      >
        ML Deck Analysis
      </button>
      <button
        className={`nav-button ${activeTab === 'ar-viewer' ? 'active' : ''}`}
        onClick={() => onTabChange('ar-viewer')}
      >
        AR Card Viewer
      </button>
      <button
        className={`nav-button ${activeTab === 'webgpu-renderer' ? 'active' : ''}`}
        onClick={() => onTabChange('webgpu-renderer')}
      >
        WebGPU Renderer
      </button>
      <button
        className={`nav-button ${activeTab === 'wasm-processor' ? 'active' : ''}`}
        onClick={() => onTabChange('wasm-processor')}
      >
        WASM Card Processor
      </button>
      <button
        className={`nav-button ${activeTab === 'webrtc-match' ? 'active' : ''}`}
        onClick={() => onTabChange('webrtc-match')}
      >
        WebRTC Match
      </button>
      <button
        className={`nav-button ${activeTab === 'ar-scanner' ? 'active' : ''}`}
        onClick={() => onTabChange('ar-scanner')}
      >
        AR Card Scanner
      </button>
      <button
        className={`nav-button ${activeTab === 'tournament' ? 'active' : ''}`}
        onClick={() => onTabChange('tournament')}
      >
        Tournament Bracket
      </button>
      <button
        className={`nav-button ${activeTab === 'archetype-analysis' ? 'active' : ''}`}
        onClick={() => onTabChange('archetype-analysis')}
      >
        Deck Archetype Analysis
      </button>
    </nav>
  );
});

// Memoized footer component
const Footer = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <p>© {currentYear} KONIVRER Deck Database</p>
      <div className="footer-links">
        <a href="#" className="footer-link">
          Terms
        </a>
        <a href="#" className="footer-link">
          Privacy
        </a>
        <a href="#" className="footer-link">
          Help
        </a>
      </div>
      <div className="tech-stack">
        <p>
          Powered by: React 19 • TypeScript • WebGPU • WebXR • TensorFlow.js •
          Ethers.js • Three.js • WebAssembly • WebRTC • WebCodecs • WebWorkers
        </p>
      </div>
    </footer>
  );
});

// Loading fallback component
const LoadingFallback = memo(() => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading KONIVRER components...</p>
  </div>
));

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>
            The application encountered an error. Please try refreshing the
            page.
          </p>
          <p className="error-details">{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Refresh Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// System requirements checker component
const SystemRequirementsChecker = memo(() => {
  const [requirements, setRequirements] = useState({
    webgpu: { supported: false, checking: true },
    webgl2: { supported: false, checking: true },
    webxr: { supported: false, checking: true },
    webassembly: { supported: false, checking: true },
    webworkers: { supported: false, checking: true },
    webrtc: { supported: false, checking: true },
    webcodecs: { supported: false, checking: true },
    webgpuCompute: { supported: false, checking: true },
  });

  useEffect(() => {
    // Check WebGPU support
    const checkWebGPU = async () => {
      try {
        const supported = !!(
          navigator.gpu && (await navigator.gpu.requestAdapter())
        );
        setRequirements(prev => ({
          ...prev,
          webgpu: { supported, checking: false },
        }));
      } catch (e) {
        setRequirements(prev => ({
          ...prev,
          webgpu: { supported: false, checking: false },
        }));
      }
    };

    // Check WebGL2 support
    const checkWebGL2 = () => {
      try {
        const canvas = document.createElement('canvas');
        const supported = !!(
          window.WebGL2RenderingContext && canvas.getContext('webgl2')
        );
        setRequirements(prev => ({
          ...prev,
          webgl2: { supported, checking: false },
        }));
      } catch (e) {
        setRequirements(prev => ({
          ...prev,
          webgl2: { supported: false, checking: false },
        }));
      }
    };

    // Check WebXR support
    const checkWebXR = () => {
      const supported = 'xr' in navigator;
      setRequirements(prev => ({
        ...prev,
        webxr: { supported, checking: false },
      }));
    };

    // Check WebAssembly support
    const checkWebAssembly = () => {
      const supported = typeof WebAssembly === 'object';
      setRequirements(prev => ({
        ...prev,
        webassembly: { supported, checking: false },
      }));
    };

    // Check Web Workers support
    const checkWebWorkers = () => {
      const supported = typeof Worker === 'function';
      setRequirements(prev => ({
        ...prev,
        webworkers: { supported, checking: false },
      }));
    };

    // Check WebRTC support
    const checkWebRTC = () => {
      const supported = 'RTCPeerConnection' in window;
      setRequirements(prev => ({
        ...prev,
        webrtc: { supported, checking: false },
      }));
    };

    // Check WebCodecs support
    const checkWebCodecs = () => {
      const supported = 'VideoEncoder' in window;
      setRequirements(prev => ({
        ...prev,
        webcodecs: { supported, checking: false },
      }));
    };

    // Check WebGPU Compute support
    const checkWebGPUCompute = async () => {
      try {
        if (!navigator.gpu) {
          setRequirements(prev => ({
            ...prev,
            webgpuCompute: { supported: false, checking: false },
          }));
          return;
        }

        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter) {
          setRequirements(prev => ({
            ...prev,
            webgpuCompute: { supported: false, checking: false },
          }));
          return;
        }

        const supported = adapter.features.has('shader-f16');
        setRequirements(prev => ({
          ...prev,
          webgpuCompute: { supported, checking: false },
        }));
      } catch (e) {
        setRequirements(prev => ({
          ...prev,
          webgpuCompute: { supported: false, checking: false },
        }));
      }
    };

    // Run all checks
    checkWebGPU();
    checkWebGL2();
    checkWebXR();
    checkWebAssembly();
    checkWebWorkers();
    checkWebRTC();
    checkWebCodecs();
    checkWebGPUCompute();
  }, []);

  // Check if all checks are complete
  const allChecksComplete = Object.values(requirements).every(
    req => !req.checking,
  );

  // Count supported features
  const supportedCount = Object.values(requirements).filter(
    req => req.supported,
  ).length;
  const totalCount = Object.keys(requirements).length;

  if (!allChecksComplete) {
    return (
      <div className="system-requirements-checker checking">
        <div className="loading-spinner small"></div>
        <p>Checking system capabilities...</p>
      </div>
    );
  }

  return (
    <div className="system-requirements-checker">
      <h3>System Capabilities</h3>
      <p className="support-summary">
        Your browser supports {supportedCount} out of {totalCount} required
        technologies.
      </p>
      <div className="requirements-grid">
        {Object.entries(requirements).map(([key, { supported }]) => (
          <div
            key={key}
            className={`requirement ${supported ? 'supported' : 'not-supported'}`}
          >
            <span className="requirement-name">{key}</span>
            <span className="requirement-status">{supported ? '✓' : '✗'}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// Main App component
const App = () => {
  const [activeTab, setActiveTab] = useState('matchmaking');
  const [showRequirements, setShowRequirements] = useState(true);

  const handleTabChange = useCallback(tab => {
    setActiveTab(tab);

    // Hide requirements checker when changing tabs
    setShowRequirements(false);
  }, []);

  // Render the active component based on the selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'matchmaking':
        return <PhysicalMatchmaking />;
      case 'ai-verification':
        return <AICardVerification />;
      case 'blockchain':
        return <BlockchainVerification />;
      case 'ml-analysis':
        return <MLDeckAnalysis />;
      case 'ar-viewer':
        return <AugmentedRealityViewer />;
      case 'webgpu-renderer':
        return (
          <WebGPUCardRenderer
            cardId="KON001"
            holographic={true}
            foil={false}
            animation="rotate"
            quality="high"
          />
        );
      case 'wasm-processor':
        return (
          <WasmCardProcessor
            initialFilters={{}}
            initialSortBy="name"
            initialSortDirection="asc"
            processingMode="standard"
          />
        );
      case 'webrtc-match':
        return <WebRTCMatch isHost={true} playerName="Player_1" />;
      case 'ar-scanner':
        return (
          <ARCardScanner enableAR={true} showDebugInfo={true} scanMode="auto" />
        );
      case 'tournament':
        return (
          <TournamentBracket
            layout="horizontal"
            showScores={true}
            showPlayerStats={true}
            animateProgress={true}
            bracketType="single"
            theme="default"
          />
        );
      case 'archetype-analysis':
        return (
          <DeckArchetypeAnalysis
            timeRange="30d"
            format="standard"
            showWinrates={true}
            showTrends={true}
            showCardBreakdown={true}
            showMetaPercentages={true}
          />
        );
      default:
        return <PhysicalMatchmaking />;
    }
  };

  return (
    <div className="app">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
      {showRequirements && <SystemRequirementsChecker />}
      <main className="app-content">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            {renderActiveComponent()}
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default memo(App);
