import type { Meta, StoryObj } from "@storybook/react"
import { Combobox } from "./Combobox"

const meta: Meta<typeof Combobox> = {
  title: "Components/HierarchicalCombobox",
  component: Combobox,
  parameters: {
    layout: "centered"
  }
}

export default meta

type Story = StoryObj<typeof Combobox>

export const Default: Story = {
  args: {
    label: "Select items"
  }
}

export const Loading: Story = {
  args: {
    label: "Loading items"
  },
  parameters: {
    docs: {
      description: {
        story: "Shows the combobox while tree data is still loading."
      }
    }
  }
}

export const KeyboardOnly: Story = {
  args: {
    label: "Keyboard only"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use Tab to focus, Arrow keys to navigate, Enter to select, and Escape to close."
      }
    }
  }
}


export const LargeDataset: Story = {
  args: {
    label: "Large dataset"
  },
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates virtualization behavior with a large hierarchical dataset."
      }
    }
  }
}

