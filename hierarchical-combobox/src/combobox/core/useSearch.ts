import { TreeMap, TreeNodeId } from "./treeTypes"

export interface SearchResult {
  visibleIds: Set<TreeNodeId>
  expandedIds: Set<TreeNodeId>
}

export function searchTree(
  tree: TreeMap,
  query: string
): SearchResult {
  const visibleIds = new Set<TreeNodeId>()
  const expandedIds = new Set<TreeNodeId>()

  if (!query.trim()) {
    // no search → everything visible
    Object.keys(tree).forEach(id => visibleIds.add(id))
    return { visibleIds, expandedIds }
  }

  const lowerQuery = query.toLowerCase()

  function includeWithAncestors(nodeId: TreeNodeId) {
    let currentId: TreeNodeId | null = nodeId

    while (currentId) {
      visibleIds.add(currentId)
      const parentId = tree[currentId]?.parentId ?? null
      if (parentId) {
        expandedIds.add(parentId)
      }
      currentId = parentId
    }
  }

  for (const node of Object.values(tree)) {
    if (node.label.toLowerCase().includes(lowerQuery)) {
      includeWithAncestors(node.id)
    }
  }

  return { visibleIds, expandedIds }
}
