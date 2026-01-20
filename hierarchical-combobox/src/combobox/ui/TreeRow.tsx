import { TreeNode } from "../core/treeTypes"

interface TreeRowProps {
  node: TreeNode
  level: number
  isExpanded: boolean
  isFocused: boolean
  isSelected: boolean
  isIndeterminate: boolean
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}


export function TreeRow({
  node,
  level,
  isExpanded,
  onToggle
}: TreeRowProps) {
  return (
    <div
      role="treeitem"
      aria-expanded={node.hasChildren ? isExpanded : undefined}
      aria-level={level}
      className={`flex cursor-pointer items-center gap-1 px-2 py-1 text-sm
          ${isFocused ? "bg-blue-100 outline-none" : "hover:bg-gray-100"}`}

      style={{ paddingLeft: `${level * 16}px` }}
      onClick={() => onToggle(node.id)}
    >
    <input
      type="checkbox"
      checked={isSelected}
      ref={el => {
        if (el) el.indeterminate = isIndeterminate
      }}
      onChange={() => onSelect(node.id)}
      onClick={e => e.stopPropagation()}
    />

    {node.hasChildren && (
      <span className="inline-block w-3">
        {isExpanded ? "▾" : "▸"}
      </span>
    )}

    <span>{node.label}</span>

    </div>
  )
}
