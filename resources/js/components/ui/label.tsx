import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
    required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean; }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
          required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : '',
      )}
      {...props}
    />
  )
}

export { Label }
