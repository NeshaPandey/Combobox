export type TreeNodeId = string

export interface TreeNode {
  id: TreeNodeId
  label: string
  parentId: TreeNodeId | null
  hasChildren: boolean
  isLoading?: boolean
  isError?: boolean
}

export type TreeMap = Record<TreeNodeId, TreeNode>
