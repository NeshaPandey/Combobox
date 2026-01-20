import type { TreeNode, TreeNodeId } from "./treeTypes"

export async function loadChildren(
  parentId: TreeNodeId | null
): Promise<TreeNode[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // simulate error for testing
      if (parentId === "error") {
        reject(new Error("Failed to load children"))
        return
      }

      const count = 5
      const nodes: TreeNode[] = Array.from({ length: count }).map((_, i) => {
        const id = parentId ? `${parentId}-${i}` : `root-${i}`

        return {
          id,
          label: `Node ${id}`,
          parentId,
          hasChildren: Math.random() > 0.5
        }
      })

      resolve(nodes)
    }, 800)
  })
}
