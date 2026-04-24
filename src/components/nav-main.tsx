import { useState } from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useI18n } from "@/features/i18n"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"

export function NavMain({
  items,
  activeLeafId,
  onSelectLeaf,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      leafId: string
    }[]
  }[]
  activeLeafId: string
  onSelectLeaf: (leafId: string) => void
}) {
  const { t } = useI18n()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t("common.platform")}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={openGroups[item.title] ?? Boolean(item.isActive)}
            onOpenChange={(nextOpen) =>
              setOpenGroups((current) => ({ ...current, [item.title]: nextOpen }))
            }
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon}
                  <span>{item.title}</span>
                  <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" fontSize="inherit" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild isActive={subItem.leafId === activeLeafId}>
                        <button type="button" onClick={() => onSelectLeaf(subItem.leafId)}>
                          <span>{subItem.title}</span>
                        </button>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
