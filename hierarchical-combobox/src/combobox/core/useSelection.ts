import { TreeMap, TreeNodeId } from "./treeTypes"

export interface SelectionState {
  selectedIds: Set<TreeNodeId>
  indeterminateIds: Set<TreeNodeId>
}

export function computeSelectionState(
  tree: TreeMap,
  selectedIds: Set<TreeNodeId>
): SelectionState {
  const indeterminateIds = new Set<TreeNodeId>()

  const childrenMap = new Map<TreeNodeId | null, TreeNodeId[]>()

  for (const node of Object.values(tree)) {
    const parent = node.parentId
    if (!childrenMap.has(parent)) {
      childrenMap.set(parent, [])
    }
    childrenMap.get(parent)!.push(node.id)
  }

  function visit(nodeId: TreeNodeId): boolean {
    const children = childrenMap.get(nodeId)
    if (!children || children.length === 0) {
      return selectedIds.has(nodeId)
    }

    let selectedCount = 0

    for (const childId of children) {
      if (visit(childId)) {
        selectedCount++
      }
    }

    if (selectedCount === 0) {
      return false
    }

    if (selectedCount === children.length) {
      selectedIds.add(nodeId)
      return true
    }

    indeterminateIds.add(nodeId)
    selectedIds.delete(nodeId)
    return false
  }

  for (const node of Object.values(tree)) {
    if (node.parentId === null) {
      visit(node.id)
    }
  }

  return { selectedIds, indeterminateIds }
}
