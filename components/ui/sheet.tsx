"use client"

import * as React from "react"
import { Drawer } from "vaul"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Sheet = ({ children, ...props }: React.ComponentProps<typeof Drawer.Root>) => (
  <Drawer.Root {...props}>{children}</Drawer.Root>
)

const SheetTrigger = Drawer.Trigger
const SheetClose = Drawer.Close
const SheetPortal = Drawer.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Drawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof Drawer.Overlay>
>(({ className, ...props }, ref) => (
  <Drawer.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
))
SheetOverlay.displayName = "SheetOverlay"

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof Drawer.Content> {
  side?: "top" | "right" | "bottom" | "left"
}

const SheetContent = React.forwardRef<React.ElementRef<typeof Drawer.Content>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <Drawer.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-background shadow-lg",
          side === "bottom" && "bottom-0 left-0 right-0 rounded-t-2xl",
          side === "right" && "right-0 top-0 h-full w-3/4 max-w-sm",
          side === "left" && "left-0 top-0 h-full w-3/4 max-w-sm",
          side === "top" && "top-0 left-0 right-0",
          className
        )}
        {...props}
      >
        {children}
        <Drawer.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </Drawer.Close>
      </Drawer.Content>
    </SheetPortal>
  )
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 p-4", className)} {...props} />
)

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
  )
)
SheetTitle.displayName = "SheetTitle"

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle }
