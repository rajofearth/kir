"use client"

import * as React from "react"

export function CodeBlockWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  const enhanceCodeBlocks = React.useCallback(() => {
    if (!containerRef.current) return
    
    const codeBlocks = containerRef.current.querySelectorAll('[data-streamdown="code-block"]')
    
    codeBlocks.forEach((codeBlock) => {
      // Skip if already processed
      if (codeBlock.hasAttribute('data-enhanced')) return
      codeBlock.setAttribute('data-enhanced', 'true')
      
      const header = codeBlock.querySelector('[data-streamdown="code-block-header"]')
      if (!header) return
      
      const pre = codeBlock.querySelector('pre')
      if (!pre) return
      
      // Reorganize header: language label on left, buttons on right
      const languageLabel = Array.from(header.childNodes)
        .find((node) => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !(node as Element).querySelector('button')))
        ?.textContent?.trim() || ''
      
      const existingButtons = Array.from(header.querySelectorAll('button'))
      
      // Clear header and rebuild structure
      header.innerHTML = ''
      header.className = 'flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs'
      
      // Left side: language label
      const labelSpan = document.createElement('span')
      labelSpan.className = 'text-muted-foreground font-mono'
      labelSpan.textContent = languageLabel
      header.appendChild(labelSpan)
      
      // Right side: button group
      const buttonGroup = document.createElement('div')
      buttonGroup.className = 'flex items-center gap-1 ml-auto'
      
      // Create wrap toggle button
      const wrapButton = document.createElement('button')
      wrapButton.className = 'code-wrap-toggle text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-muted/50 flex items-center'
      wrapButton.setAttribute('aria-label', 'Toggle wrap')
      wrapButton.setAttribute('data-tooltip', 'Toggle wrap')
      wrapButton.setAttribute('type', 'button')
      
      const updateWrapIcon = (isWrapped: boolean) => {
        wrapButton.innerHTML = isWrapped 
          ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2h12M1 7h12M1 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M10 4l2 2-2 2M10 9l2 2-2 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2h12M1 7h12M1 12h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
      }
      
      updateWrapIcon(false)
      
      wrapButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        const isWrapped = codeBlock.getAttribute('data-wrapped') === 'true'
        const newWrapped = !isWrapped
        
        codeBlock.setAttribute('data-wrapped', String(newWrapped))
        updateWrapIcon(newWrapped)
      })
      
      // Create collapse toggle button
      const collapseButton = document.createElement('button')
      collapseButton.className = 'code-collapse-toggle text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-muted/50 flex items-center'
      collapseButton.setAttribute('aria-label', 'Toggle collapse')
      collapseButton.setAttribute('data-tooltip', 'Collapse')
      collapseButton.setAttribute('type', 'button')
      
      const updateCollapseIcon = (isCollapsed: boolean) => {
        // Show minus when expanded (can collapse), plus when collapsed (can expand)
        collapseButton.innerHTML = isCollapsed
          ? '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
        collapseButton.setAttribute('data-tooltip', isCollapsed ? 'Expand' : 'Collapse')
        collapseButton.setAttribute('aria-label', isCollapsed ? 'Expand' : 'Collapse')
        collapseButton.setAttribute('title', isCollapsed ? 'Expand' : 'Collapse')
      }
      
      updateCollapseIcon(false)
      
      collapseButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        const isCollapsed = codeBlock.getAttribute('data-collapsed') === 'true'
        const newCollapsed = !isCollapsed
        
        codeBlock.setAttribute('data-collapsed', String(newCollapsed))
        updateCollapseIcon(newCollapsed)
        
        // Toggle visibility of pre element
        if (pre) {
          if (newCollapsed) {
            pre.style.display = 'none'
          } else {
            pre.style.display = ''
          }
        }
      })
      
      // Add buttons in order: collapse, wrap, then existing copy/download buttons
      buttonGroup.appendChild(collapseButton)
      buttonGroup.appendChild(wrapButton)
      
      // Re-add copy/download buttons if they exist (preserve their functionality)
      existingButtons.forEach((btn) => {
        // Add tooltips to existing buttons
        const buttonType = btn.getAttribute('aria-label') || btn.textContent || ''
        if (buttonType.toLowerCase().includes('copy')) {
          btn.setAttribute('data-tooltip', 'Copy code')
          btn.className = 'code-action-btn text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-muted/50 flex items-center'
        } else if (buttonType.toLowerCase().includes('download')) {
          btn.setAttribute('data-tooltip', 'Download')
          btn.className = 'code-action-btn text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-muted/50 flex items-center'
        } else {
          // Preserve existing button styling if not copy/download
          btn.className = 'code-action-btn text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-muted/50 flex items-center'
        }
        buttonGroup.appendChild(btn)
      })
      
      header.appendChild(buttonGroup)
      
      // Initialize tooltips for all buttons
      const allButtons = buttonGroup.querySelectorAll('button')
      allButtons.forEach((btn) => {
        const tooltipText = btn.getAttribute('data-tooltip') || btn.getAttribute('aria-label')
        if (tooltipText && !btn.hasAttribute('data-tooltip-init')) {
          btn.setAttribute('data-tooltip-init', 'true')
          btn.setAttribute('title', tooltipText)
        }
      })
    })
  }, [])

  React.useEffect(() => {
    // Initial setup
    enhanceCodeBlocks()
    
    // Watch for dynamically added code blocks
    if (!containerRef.current) return
    
    const observer = new MutationObserver(() => {
      enhanceCodeBlocks()
    })
    
    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
    })
    
    return () => {
      observer.disconnect()
    }
  }, [enhanceCodeBlocks])
  
  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

