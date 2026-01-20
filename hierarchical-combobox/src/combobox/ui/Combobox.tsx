import { computeSelectionState } from "../core/useSelection"
import { searchTree } from "../core/useSearch"

import { useEffect, useId, useState } from "react"
import { TreeNode } from "../core/treeTypes"
import { loadChildren } from "../core/treeLoader"
import { TreeRow } from "./TreeRow"

interface ComboboxProps {
  label: string
}

export function Combobox({ label }: ComboboxProps) {

  const inputId = useId()
  const listboxId = useId()

  const [isOpen, setIsOpen] = useState(false)
  const [tree, setTree] = useState<Record<string, TreeNode>>({})
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState("")


  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  useEffect(() => {
    loadChildren(null).then(nodes => {
      setTree(prev => {
        const next = { ...prev }
        nodes.forEach(n => (next[n.id] = n))
        return next
      })
    })
  }, [])

  function toggleNode(id: string) {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        const node = tree[id]
        if (node?.hasChildren) {
          loadChildren(id).then(children => {
            setTree(t => {
              const updated = { ...t }
              children.forEach(c => (updated[c.id] = c))
              return updated
            })
          })
        }
      }
      return next
    })
  }

  const { visibleIds, expandedIds: searchExpandedIds } = searchTree(tree, search)

  const effectiveExpandedIds = search
    ? new Set([...expandedIds, ...searchExpandedIds])
    : expandedIds

  const visibleNodes = Object.values(tree).filter(
    node =>
      visibleIds.has(node.id) &&
      (node.parentId === null || effectiveExpandedIds.has(node.parentId))
  )


  const { indeterminateIds } = computeSelectionState(
    tree,
    new Set(selectedIds)
)


  const visibleIds = visibleNodes.map(n => n.id)

  function moveFocus(delta: number) {
    if (!focusedId) {
      setFocusedId(visibleIds[0] ?? null)
      return
    }

    const index = visibleIds.indexOf(focusedId)
    if (index === -1) return

    const nextIndex = index + delta
    if (nextIndex >= 0 && nextIndex < visibleIds.length) {
      setFocusedId(visibleIds[nextIndex])
    }
  }


  return (
    <div className="relative w-80">
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>

      <input
        id={inputId}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-haspopup="tree"
        className="mt-1 w-full rounded border px-2 py-1"
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          id={listboxId}
          role="tree"
          tabIndex={0}
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white"
          onKeyDown={e => {
            switch (e.key) {
              case "ArrowDown":
                e.preventDefault()
                moveFocus(1)
                break
              case "ArrowUp":
                e.preventDefault()
                moveFocus(-1)
                break
              case "ArrowRight":
                if (focusedId) toggleNode(focusedId)
                break
              case "ArrowLeft":
                if (focusedId) {
                  setExpandedIds(prev => {
                    const next = new Set(prev)
                    next.delete(focusedId)
                    return next
                  })
                }
                break
              case "Enter":
              case " ":
                if (focusedId) toggleNode(focusedId)
                break
              case "Escape":
                setIsOpen(false)
                break
            }
          }}
        >

          <div className="p-1 border-b">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded border px-2 py-1 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>


          {visibleNodes.map(node => (
            <TreeRow
              key={node.id}
              node={node}
              level={node.parentId ? 2 : 1}
              isExpanded={effectiveExpandedIds.has(node.id)}
              isFocused={focusedId === node.id}
              isSelected={selectedIds.has(node.id)}
              isIndeterminate={indeterminateIds.has(node.id)}
              onToggle={toggleNode}
              onSelect={toggleSelect}
            />
          ))}

        </div>
      )}
    </div>
  )
}
