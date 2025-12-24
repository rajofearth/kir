"use client"

import * as React from "react"

export function CodeBlockWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Helper function to count lines in code block
  const countLines = (preElement: HTMLPreElement): number => {
    const codeElement = preElement.querySelector('code')
    if (!codeElement) return 0
    
    // Count line spans (if using line numbers) or split by newlines
    const lineSpans = codeElement.querySelectorAll('span[class*="block"]')
    if (lineSpans.length > 0) {
      return lineSpans.length
    }
    
    // Fallback: count newlines in text content
    const text = codeElement.textContent || ''
    return Math.max(1, text.split('\n').length)
  }

  // Lucide chevron icons for collapse/expand
  const getChevronsDownUpSVG = (): string => {
    // chevrons-down-up - when expanded (can collapse)
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 20 5-5 5 5"></path><path d="m7 4 5 5 5-5"></path></svg>'
  }

  const getChevronsUpDownSVG = (): string => {
    // chevrons-up-down - when collapsed (can expand)
    return '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"></path><path d="m7 9 5-5 5 5"></path></svg>'
  }

  const enhanceCodeBlocks = React.useCallback(() => {
    if (!containerRef.current) return
    
    const codeBlocks = containerRef.current.querySelectorAll('[data-streamdown="code-block"]')
    
    codeBlocks.forEach((codeBlock) => {
      // Skip only if fully processed (we may mark streaming fallback as "fallback")
      if (codeBlock.getAttribute('data-enhanced') === 'true') return

      // Always enforce safe sizing/scrolling (streaming can render a non-<pre> fallback temporarily)
      const el = codeBlock as HTMLElement
      el.style.maxWidth = '100%'
      el.style.minWidth = '0'
      el.style.overflowX = 'auto'
      ;(el.style as unknown as Record<string, string>).webkitOverflowScrolling = 'touch'
      
      const header = codeBlock.querySelector('[data-streamdown="code-block-header"]')
      if (!header) {
        // Mark as fallback so we can still enhance later once the header is present.
        codeBlock.setAttribute('data-enhanced', 'fallback')
        return
      }
      
      const pre = codeBlock.querySelector('pre')
      if (!pre) {
        // Streaming fallback: no <pre> yet. Keep it scrollable and retry later.
        // Preserve newlines and avoid layout expansion while content is still plain text.
        el.style.whiteSpace = 'pre'
        codeBlock.setAttribute('data-enhanced', 'fallback')
        return
      }

      // From here on, we have a stable structure and can fully enhance.
      codeBlock.setAttribute('data-enhanced', 'true')
      
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
      
      const updateWrapIcon = () => {
        // Use Lucide text icon for wrap toggle
        wrapButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.1H3"></path><path d="M21 12.1H3"></path><path d="M15.1 18H3"></path></svg>'
      }
      
      updateWrapIcon()
      
      wrapButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        const isWrapped = codeBlock.getAttribute('data-wrapped') === 'true'
        const newWrapped = !isWrapped
        
        codeBlock.setAttribute('data-wrapped', String(newWrapped))
        updateWrapIcon()
      })
      
      // Count lines in the code block
      const lineCount = countLines(pre)
      
      // Create collapse toggle button
      const collapseButton = document.createElement('button')
      collapseButton.className = 'code-collapse-toggle text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded hover:bg-muted/50 flex items-center gap-1.5'
      collapseButton.setAttribute('aria-label', 'Toggle collapse')
      collapseButton.setAttribute('data-tooltip', 'Collapse')
      collapseButton.setAttribute('type', 'button')
      
      // Create container for line count and icon
      const buttonContent = document.createElement('div')
      buttonContent.className = 'flex items-center gap-1.5'
      
      // Create line count span
      const lineCountSpan = document.createElement('span')
      lineCountSpan.className = 'text-xs font-mono text-muted-foreground/70'
      lineCountSpan.textContent = String(lineCount)
      
      // Create icon container
      const iconContainer = document.createElement('span')
      iconContainer.className = 'flex items-center'
      
      const updateCollapseIcon = (isCollapsed: boolean) => {
        // Show chevrons-up-down when collapsed (can expand), chevrons-down-up when expanded (can collapse)
        iconContainer.innerHTML = isCollapsed
          ? getChevronsUpDownSVG()  // Collapsed: show chevrons up-down (can expand)
          : getChevronsDownUpSVG()  // Expanded: show chevrons down-up (can collapse)
        collapseButton.setAttribute('data-tooltip', isCollapsed ? 'Expand' : 'Collapse')
        collapseButton.setAttribute('aria-label', isCollapsed ? 'Expand' : 'Collapse')
        collapseButton.setAttribute('title', isCollapsed ? 'Expand' : 'Collapse')
      }
      
      // Assemble button content: line count on left, icon on right
      buttonContent.appendChild(lineCountSpan)
      buttonContent.appendChild(iconContainer)
      collapseButton.appendChild(buttonContent)
      
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

