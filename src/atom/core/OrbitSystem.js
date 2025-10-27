// OrbitSystem - Manages electron orbital motion around static shells
import { gsap } from 'gsap/all';

export class OrbitSystem {
  constructor(config) {
    this.config = config;
    this.electrons = [];
    this.timelines = new Map();
    this.isRunning = false;
    this.centerX = config.viewport.centerX;
    this.centerY = config.viewport.centerY;
    this.frameThrottled = false;
    this.pendingUpdates = new Map();
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.safariOptimizations = this.isSafari;
  }

  init() {
    try {
      const electronElements = document.querySelectorAll('.electron:not(.nucleus)');
      
      if (electronElements.length === 0) {
        console.warn('No electron elements found - using static fallback');
        this.useStaticFallback();
        return;
      }
      
      electronElements.forEach((electron) => {
        this.initializeElectron(electron);
      });
      
    } catch (error) {
      console.error('OrbitSystem initialization failed:', error);
      this.useStaticFallback();
    }
  }

  initializeElectron(electron) {
    try {
      const shellIndex = parseInt(electron.dataset.shellIndex);
      const initialAngle = parseFloat(electron.dataset.angle);
      const shellConfig = this.config.shells[shellIndex];
      
      if (!shellConfig) {
        console.warn('No shell config found for electron', shellIndex);
        return;
      }
      
      const electronData = {
        element: electron,
        shellIndex: shellIndex,
        shellRadius: shellConfig.radius,
        initialAngle: initialAngle,
        currentAngle: initialAngle, // Use the carefully calculated angle from positioning algorithm
        direction: shellConfig.direction,
        speed: shellConfig.speed
      };
      
      // Create timeline for this electron with error handling
      const timeline = gsap.timeline({ 
        repeat: -1,
        ease: "none",
        onComplete: () => {
          console.warn('Timeline completed unexpectedly for electron', shellIndex);
        }
      });
      
      // Create smooth animation using CSS transforms but for circular motion
      // We'll animate a dummy object and update positions smoothly
      const rotationAmount = shellConfig.direction * 360;
      const duration = 360 / Math.abs(shellConfig.speed);
      
      timeline.to(electronData, {
        currentAngle: `+=${rotationAmount}`,
        duration: duration,
        ease: "none",
        onUpdate: () => {
          // Use frame-throttled update system for better performance
          this.scheduleElectronUpdate(electronData);
        }
      });
      
      // Set initial position with Safari optimizations
      const radians = (electronData.currentAngle * Math.PI) / 180;
      const x = this.centerX + electronData.shellRadius * Math.cos(radians);
      const y = this.centerY + electronData.shellRadius * Math.sin(radians);
      
      const initialSettings = { 
        attr: { cx: x, cy: y },
        x: 0,
        y: 0
      };
      
      // Safari-specific optimizations: force hardware acceleration
      if (this.safariOptimizations) {
        initialSettings.force3D = true;
        initialSettings.z = 0.01; // Minimal z-transform to trigger 3D acceleration
      }
      
      gsap.set(electronData.element, initialSettings);
      
      // Store electron and timeline
      this.electrons.push(electronData);
      this.timelines.set(electronData.element, {
        timeline,
        electronData
      });
      
    } catch (error) {
      console.error('Failed to initialize electron:', error);
      // Continue with other electrons even if one fails
    }
  }

  /**
   * Frame-throttled electron position update system
   */
  scheduleElectronUpdate(electronData) {
    // Store the update for this electron
    this.pendingUpdates.set(electronData.element, electronData);
    
    // If we're not already waiting for the next frame, schedule an update
    if (!this.frameThrottled) {
      this.frameThrottled = true;
      
      requestAnimationFrame(() => {
        try {
          // Process all pending updates in a single frame
          this.pendingUpdates.forEach((data) => {
            this.updateElectronPosition(data);
          });
          
          // Clear pending updates and reset throttle
          this.pendingUpdates.clear();
          this.frameThrottled = false;
          
        } catch (error) {
          console.error('Frame update failed:', error);
          this.frameThrottled = false;
        }
      });
    }
  }

  /**
   * Update a single electron's position
   */
  updateElectronPosition(electronData) {
    try {
      // Calculate new position based on current angle
      const radians = (electronData.currentAngle * Math.PI) / 180;
      const x = this.centerX + electronData.shellRadius * Math.cos(radians);
      const y = this.centerY + electronData.shellRadius * Math.sin(radians);
      
      const originalCx = parseFloat(electronData.element.getAttribute('cx') || 0);
      const originalCy = parseFloat(electronData.element.getAttribute('cy') || 0);
      
      const transform = {
        x: x - originalCx,
        y: y - originalCy
      };
      
      // Safari-specific optimizations for smoother animations
      if (this.safariOptimizations) {
        transform.force3D = true;
        transform.z = 0.01;
        // Use rounded values to reduce sub-pixel rendering issues
        transform.x = Math.round(transform.x * 10) / 10;
        transform.y = Math.round(transform.y * 10) / 10;
      }
      
      gsap.set(electronData.element, transform);
      
      // Also update the corresponding checkmark if it exists
      const electronSlug = electronData.element.dataset.project;
      if (electronSlug) {
        const checkmark = document.querySelector(`.visited-indicator[data-project="${electronSlug}"]`);
        if (checkmark) {
          gsap.set(checkmark, transform);
        }
      }
      
    } catch (updateError) {
      console.error('Electron position update failed:', updateError);
      // Don't kill timeline here - let the system continue with other electrons
    }
  }

  /**
   * Start all electron animations
   */
  start() {
    if (this.isRunning) return;
    
    try {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Respect reduced motion accessibility preference
      if (prefersReducedMotion && this.config.motion.respectReducedMotion) {
        this.useStaticFallback();
        return;
      }
      
      // Start all electron timelines with error handling
      this.timelines.forEach((electronInfo) => {
        try {
          if (electronInfo.timeline && !electronInfo.timeline.isActive()) {
            electronInfo.timeline.play();
          }
        } catch (timelineError) {
          console.error('Failed to start timeline:', timelineError);
        }
      });
      
      this.isRunning = true;
      
    } catch (error) {
      console.error('OrbitSystem start failed:', error);
      this.useStaticFallback();
    }
  }

  /**
   * Stop all electron animations
   */
  stop() {
    if (!this.isRunning) return;
    
    this.timelines.forEach((electronInfo) => {
      electronInfo.timeline.pause();
    });
    
    this.isRunning = false;
  }

  /**
   * Pause animation of electrons on a specific shell (for hover effects)
   */
  pauseShell(shellIndex) {
    this.timelines.forEach((electronInfo) => {
      if (electronInfo.electronData.shellIndex === shellIndex) {
        electronInfo.timeline.pause();
      }
    });
  }

  /**
   * Resume animation of electrons on a specific shell
   */
  resumeShell(shellIndex) {
    if (!this.isRunning) return;
    
    this.timelines.forEach((electronInfo) => {
      if (electronInfo.electronData.shellIndex === shellIndex) {
        electronInfo.timeline.play();
      }
    });
  }

  /**
   * Pause a specific electron (for individual hover effects)
   */
  pauseElectron(electronElement) {
    const electronInfo = this.timelines.get(electronElement);
    if (electronInfo) {
      electronInfo.timeline.pause();
    }
  }

  /**
   * Resume a specific electron
   */
  resumeElectron(electronElement) {
    if (!this.isRunning) return;
    
    const electronInfo = this.timelines.get(electronElement);
    if (electronInfo) {
      electronInfo.timeline.play();
    }
  }

  /**
   * Cleanup - stop all animations and clear references
   */
  destroy() {
    this.stop();
    
    // Enhanced cleanup with explicit memory management
    this.timelines.forEach((electronInfo) => {
      // Kill timeline and clear all references
      electronInfo.timeline.kill();
      electronInfo.timeline = null;
      
      // Clear element references and GSAP data
      if (electronInfo.electronData.element) {
        gsap.killTweensOf(electronInfo.electronData.element);
        gsap.set(electronInfo.electronData.element, { clearProps: "all" });
        electronInfo.electronData.element = null;
      }
      
      // Clear electron data references
      electronInfo.electronData = null;
    });
    
    this.timelines.clear();
    
    // Kill any remaining tweens on electron array and clear it
    gsap.killTweensOf(this.electrons);
    this.electrons.length = 0;
    
    // Clear any global GSAP references
    gsap.killTweensOf(this);
    
    // Clear frame throttling state
    this.frameThrottled = false;
    this.pendingUpdates.clear();
    
  }

  /**
   * Static fallback when animations fail or are not supported
   */
  useStaticFallback() {
    
    // Find all electrons and ensure they're visible but static
    const electronElements = document.querySelectorAll('.electron');
    electronElements.forEach((electron) => {
      try {
        // Ensure electron is visible and in its initial position
        gsap.set(electron, { 
          opacity: 1,
          scale: 1,
          clearProps: "transform"
        });
        
        // Add a subtle pulse effect as fallback interaction
        electron.addEventListener('mouseenter', () => {
          gsap.to(electron, { scale: 1.1, duration: 0.2, ease: "power2.out" });
        });
        
        electron.addEventListener('mouseleave', () => {
          gsap.to(electron, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
        
      } catch (error) {
        console.error('Static fallback failed for electron:', error);
        // Ensure electron is at least visible
        electron.style.opacity = '1';
      }
    });
    
    this.isRunning = false;
    this.staticMode = true;
  }
}