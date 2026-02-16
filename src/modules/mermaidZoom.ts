import ExecutionEnvironment from "@docusaurus/ExecutionEnvironment";

if (ExecutionEnvironment.canUseDOM) {
  // State for Pan/Zoom
  let scale = 1;
  let pointX = 0;
  let pointY = 0;
  let panning = false;
  let startX = 0;
  let startY = 0;

  // Drag Detection State
  let dragStartX = 0;
  let dragStartY = 0;
  let isDragging = false; // Tracks if a drag occurred during current interaction

  // Helper to apply transform
  const updateTransform = (el: HTMLElement) => {
    el.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
  };

  const createModal = () => {
    if (document.getElementById("mermaid-modal")) return;

    const modal = document.createElement("div");
    modal.id = "mermaid-modal";
    Object.assign(modal.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "9999",
      display: "none",
      opacity: "0",
      transition: "opacity 0.3s ease",
      overflow: "hidden",
    });

    const contentContainer = document.createElement("div");
    contentContainer.id = "mermaid-modal-content";
    Object.assign(contentContainer.style, {
      transformOrigin: "center center",
      cursor: "grab",
      transition: "transform 0.1s ease-out",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      maxWidth: "100%",
      maxHeight: "100%",
      width: "100%",
      height: "100%",
    });

    // --- Controls UI ---
    const controls = document.createElement("div");
    Object.assign(controls.style, {
      position: "fixed",
      bottom: "120px",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "12px",
      padding: "12px 18px",
      backgroundColor: "rgba(30, 30, 35, 0.8)",
      backdropFilter: "blur(10px)",
      borderRadius: "24px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      zIndex: "10001",
    });

    const createBtn = (icon: string, title: string, onClick: () => void) => {
      const btn = document.createElement("button");
      btn.innerHTML = icon;
      btn.title = title;
      Object.assign(btn.style, {
        background: "transparent",
        border: "none",
        color: "#e0e0e0",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s ease",
      });
      btn.onmouseenter = () => {
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        btn.style.transform = "scale(1.1)";
      };
      btn.onmouseleave = () => {
        btn.style.backgroundColor = "transparent";
        btn.style.transform = "scale(1)";
      };
      btn.onclick = (e) => {
        e.stopPropagation();
        onClick();
      };
      return btn;
    };

    // Icons
    const iconMinus = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    const iconPlus = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    const iconReset = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`;
    const iconClose = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    // Handlers
    const handleZoom = (delta: number) => {
      const step = 0.25;
      const nextScale = scale + delta * step;
      if (nextScale > 0.1 && nextScale < 10) {
        scale = nextScale;
        updateTransform(contentContainer);
      }
    };

    const handleReset = () => {
      scale = 1;
      pointX = 0;
      pointY = 0;
      updateTransform(contentContainer);
    };

    controls.appendChild(
      createBtn(iconMinus, "Zoom Out", () => handleZoom(-1)),
    );
    controls.appendChild(createBtn(iconReset, "Reset View", handleReset));
    controls.appendChild(createBtn(iconPlus, "Zoom In", () => handleZoom(1)));

    const separator = document.createElement("div");
    separator.style.width = "1px";
    separator.style.height = "20px";
    separator.style.backgroundColor = "rgba(255,255,255,0.2)";
    separator.style.margin = "0 4px";
    controls.appendChild(separator);

    controls.appendChild(createBtn(iconClose, "Close", () => closeModal()));

    modal.appendChild(contentContainer);
    modal.appendChild(controls);
    document.body.appendChild(modal);

    // --- Modal Logic ---

    // Click logic separated: We attach listener on 'click' to handle normal clicks (close)
    // But if dragging occurred, we suppress it.
    modal.addEventListener("click", (e) => {
      // Logic handled via capture listener suppression below.
      // If we reach here, it's a valid click.
      if (e.target === modal || e.target === contentContainer) {
        closeModal();
      }
    });

    // --- Pan & Zoom Logic ---

    modal.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const xs = (e.clientX - pointX) / scale;
        const ys = (e.clientY - pointY) / scale;
        const delta = -Math.sign(e.deltaY);

        const step = 0.15;
        const nextScale = scale + delta * step * scale;

        if (nextScale > 0.1 && nextScale < 10) {
          pointX = e.clientX - xs * nextScale;
          pointY = e.clientY - ys * nextScale;
          scale = nextScale;
          updateTransform(contentContainer);
        }
      },
      { passive: false },
    );

    const onMouseDown = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest("button") ||
        (e.target as HTMLElement).closest(".controls")
      )
        return;

      e.preventDefault(); // Stop native drag
      startX = e.clientX - pointX;
      startY = e.clientY - pointY;

      dragStartX = e.clientX;
      dragStartY = e.clientY;
      isDragging = false;

      panning = true;
      contentContainer.style.cursor = "grabbing";
      contentContainer.style.transition = "none";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!panning) return;
      e.preventDefault();

      const dist = Math.sqrt(
        Math.pow(e.clientX - dragStartX, 2) +
          Math.pow(e.clientY - dragStartY, 2),
      );
      if (dist > 5) {
        isDragging = true;
      }

      pointX = e.clientX - startX;
      pointY = e.clientY - startY;
      updateTransform(contentContainer);
    };

    const onMouseUp = (e: MouseEvent) => {
      if (panning) {
        panning = false;
        contentContainer.style.cursor = "grab";

        if (isDragging) {
          // User dragged significantly.
          // We must suppress the subsequent 'click' event to prevent closing or conflict.
          const suppressClick = (clickEvent: MouseEvent) => {
            clickEvent.stopPropagation();
            clickEvent.stopImmediatePropagation();
            clickEvent.preventDefault(); // Just in case
            window.removeEventListener("click", suppressClick, true);
          };
          // Add listener in CAPTURE phase to intercept click before it bubbles
          window.addEventListener("click", suppressClick, true);

          // Remove listener shortly after if no click happens (safety cleanup)
          setTimeout(() => {
            window.removeEventListener("click", suppressClick, true);
          }, 100);
        }

        // Re-enable transition smoothly
        contentContainer.style.transition = "transform 0.1s ease-out";
      }
    };

    // Attach listeners
    contentContainer.addEventListener("mousedown", onMouseDown);
    modal.addEventListener("mousedown", onMouseDown);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const openModal = (clonedSvg: SVGElement, originalClasses: string[] = []) => {
    const modal = document.getElementById("mermaid-modal");
    const content = document.getElementById("mermaid-modal-content");
    if (!modal || !content) return;

    // Sync theme attributes from html tag
    const html = document.documentElement;
    modal.setAttribute("data-theme", html.getAttribute("data-theme") || "dark");
    modal.className = html.className; // Sync classes like 'theme-dark' or 'theme-light'
    modal.classList.add("mermaid-zoom-active");

    // Reset State
    scale = 1;
    pointX = 0;
    pointY = 0;
    panning = false;
    isDragging = false;
    content.style.transform = `translate(0px, 0px) scale(1)`;

    // Inject Content
    content.innerHTML = "";

    // Create wrapper to preserve CSS context
    const outerWrapper = document.createElement("div");
    outerWrapper.className = "blog-post-page-wrapper";
    outerWrapper.style.width = "100%";
    outerWrapper.style.height = "100%";
    outerWrapper.style.display = "flex";
    outerWrapper.style.justifyContent = "center";
    outerWrapper.style.alignItems = "center";

    const innerWrapper = document.createElement("div");
    innerWrapper.className = "markdown";
    innerWrapper.style.width = "100%";
    innerWrapper.style.height = "100%";
    innerWrapper.style.display = "flex";
    innerWrapper.style.justifyContent = "center";
    innerWrapper.style.alignItems = "center";

    const containerWrapper = document.createElement("div");
    containerWrapper.className = "docusaurus-mermaid-container";
    // Inherit classes from original container for parity (e.g. CSS Modules classes)
    originalClasses.forEach((cls) => {
      if (cls && cls !== "docusaurus-mermaid-container") {
        containerWrapper.classList.add(cls);
      }
    });
    containerWrapper.style.width = "100%";
    containerWrapper.style.height = "100%";
    containerWrapper.style.display = "flex";
    containerWrapper.style.justifyContent = "center";
    containerWrapper.style.alignItems = "center";

    // Disable native dragging
    containerWrapper.ondragstart = () => false;

    // SVG Layout & Theme Sync
    clonedSvg.style.maxWidth = "95vw";
    clonedSvg.style.maxHeight = "95vh";
    clonedSvg.style.height = "auto";
    clonedSvg.style.width = "auto";
    clonedSvg.style.background = "transparent";
    clonedSvg.style.pointerEvents = "auto";
    clonedSvg.setAttribute("draggable", "false");
    clonedSvg.ondragstart = () => false;

    containerWrapper.appendChild(clonedSvg);
    innerWrapper.appendChild(containerWrapper);
    outerWrapper.appendChild(innerWrapper);
    content.appendChild(outerWrapper);

    // Show
    modal.style.display = "block";
    requestAnimationFrame(() => {
      modal.style.opacity = "1";
    });
  };

  const closeModal = () => {
    const modal = document.getElementById("mermaid-modal");
    if (!modal) return;
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
      const content = document.getElementById("mermaid-modal-content");
      if (content) content.innerHTML = "";
    }, 300);
  };

  // Performance Optimized Viewer Attachment
  const attachLightbox = () => {
    const containers = document.querySelectorAll(
      ".docusaurus-mermaid-container",
    );
    containers.forEach((container) => {
      if (container.getAttribute("data-lightbox-active")) return;

      const svg = container.querySelector("svg");
      if (!svg) return;

      container.setAttribute("data-lightbox-active", "true");
      container.style.cursor = "zoom-in";

      container.addEventListener("click", async (e) => {
        e.preventDefault();

        // 1. Attempt to get raw source code from React fiber
        // Docusaurus theme-mermaid stores the source in the 'value' prop
        let mermaidSource: string | null = null;
        try {
          const fiberKey = Object.keys(container).find((k) =>
            k.startsWith("__reactFiber"),
          );
          if (fiberKey) {
            const fiber = (container as any)[fiberKey];
            // Walk up fiber tree to find the Mermaid component props
            let curr = fiber;
            while (curr && !mermaidSource) {
              if (curr.memoizedProps?.value) {
                mermaidSource = curr.memoizedProps.value;
              }
              curr = curr.return;
            }
          }
        } catch (err) {
          console.error("Failed to extract Mermaid source from fiber", err);
        }

        if (!mermaidSource) {
          console.warn("Mermaid source not found, falling back to clone node");
          const clonedSvg = svg.cloneNode(true) as SVGElement;
          openModal(clonedSvg, Array.from(container.classList));
          return;
        }

        // 2. Load mermaid and render fresh SVG
        try {
          const { default: mermaid } = await import("mermaid");
          const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

          // Use a neutral theme for re-rendering to let our CSS handle the rest
          mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? ("dark" as any) : ("neutral" as any),
            securityLevel: "loose",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
          });

          const id = `mermaid-zoom-${Date.now()}`;
          const renderResult = await mermaid.render(id, mermaidSource);
          const svgCode = renderResult.svg;

          // 3. Convert SVG string to element
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = svgCode;
          const newSvg = tempDiv.querySelector("svg");

          if (newSvg) {
            openModal(newSvg, Array.from(container.classList));
          } else {
            throw new Error("Failed to parse rendered SVG");
          }
        } catch (err) {
          console.error("Mermaid re-render failed", err);
          const clonedSvg = svg.cloneNode(true) as SVGElement;
          openModal(clonedSvg, Array.from(container.classList));
        }
      });
    });
  };

  // Debounce helper
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Setup Observer avoiding polling
  const setupObserver = () => {
    const observer = new MutationObserver(
      debounce(() => {
        attachLightbox();
      }, 500),
    );

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial Run
    attachLightbox();
  };

  if (document.readyState === "loading") {
    window.addEventListener("load", () => {
      createModal();
      setupObserver();
    });
  } else {
    createModal();
    setupObserver();
  }
}
