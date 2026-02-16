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
  let isDragging = false;

  const updateTransform = (el: HTMLElement) => {
    el.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
  };

  const createModal = () => {
    if (document.getElementById("image-zoom-modal")) return;

    const modal = document.createElement("div");
    modal.id = "image-zoom-modal";
    Object.assign(modal.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      zIndex: "10000",
      display: "none",
      opacity: "0",
      transition: "opacity 0.3s ease",
      overflow: "hidden",
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      backdropFilter: "blur(10px)",
    });

    const contentContainer = document.createElement("div");
    contentContainer.id = "image-zoom-content";
    Object.assign(contentContainer.style, {
      transformOrigin: "center center",
      cursor: "grab",
      transition: "transform 0.1s ease-out",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
    });

    const controls = document.createElement("div");
    Object.assign(controls.style, {
      position: "fixed",
      bottom: "40px",
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

    const iconMinus = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    const iconPlus = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
    const iconReset = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`;
    const iconClose = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    const handleZoom = (delta: number) => {
      const step = 0.25;
      const nextScale = scale + delta * step;
      if (nextScale > 0.1 && nextScale < 5) {
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
    Object.assign(separator.style, {
      width: "1px",
      height: "20px",
      backgroundColor: "rgba(255,255,255,0.2)",
      margin: "0 4px",
    });
    controls.appendChild(separator);

    controls.appendChild(createBtn(iconClose, "Close", () => closeModal()));

    modal.appendChild(contentContainer);
    modal.appendChild(controls);
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target === contentContainer) {
        closeModal();
      }
    });

    modal.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const xs = (e.clientX - pointX) / scale;
        const ys = (e.clientY - pointY) / scale;
        const delta = -Math.sign(e.deltaY);
        const step = 0.15;
        const nextScale = scale + delta * step * scale;

        if (nextScale > 0.1 && nextScale < 5) {
          pointX = e.clientX - xs * nextScale;
          pointY = e.clientY - ys * nextScale;
          scale = nextScale;
          updateTransform(contentContainer);
        }
      },
      { passive: false },
    );

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      e.preventDefault();
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
      if (dist > 5) isDragging = true;
      pointX = e.clientX - startX;
      pointY = e.clientY - startY;
      updateTransform(contentContainer);
    };

    const onMouseUp = () => {
      if (panning) {
        panning = false;
        contentContainer.style.cursor = "grab";
        if (isDragging) {
          const suppressClick = (e: MouseEvent) => {
            e.stopPropagation();
            window.removeEventListener("click", suppressClick, true);
          };
          window.addEventListener("click", suppressClick, true);
          setTimeout(
            () => window.removeEventListener("click", suppressClick, true),
            100,
          );
        }
        contentContainer.style.transition = "transform 0.1s ease-out";
      }
    };

    modal.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const openModal = (imgSrc: string) => {
    const modal = document.getElementById("image-zoom-modal");
    const content = document.getElementById("image-zoom-content");
    if (!modal || !content) return;

    scale = 1;
    pointX = 0;
    pointY = 0;
    updateTransform(content);

    content.innerHTML = "";
    const img = document.createElement("img");
    img.src = imgSrc;
    Object.assign(img.style, {
      maxWidth: "90vw",
      maxHeight: "90vh",
      objectFit: "contain",
      userSelect: "none",
      pointerEvents: "none",
    });
    content.appendChild(img);

    modal.style.display = "block";
    requestAnimationFrame(() => {
      modal.style.opacity = "1";
    });
  };

  const closeModal = () => {
    const modal = document.getElementById("image-zoom-modal");
    if (!modal) return;
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  };

  const attachImageZoom = () => {
    // Target all images EXCEPT navbar logos or images already having zoom
    const images = document.querySelectorAll(
      "img:not(.navbar__logo):not([data-zoom-active])",
    );
    images.forEach((img) => {
      if (img.closest(".navbar") || img.closest(".footer")) return;

      img.setAttribute("data-zoom-active", "true");
      (img as HTMLElement).style.cursor = "zoom-in";
      img.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal((img as HTMLImageElement).src);
      });
    });
  };

  const setupObserver = () => {
    const observer = new MutationObserver(() => {
      attachImageZoom();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    attachImageZoom();
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
