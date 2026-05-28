// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";

// type ConfirmDialogProps = {
//   open: boolean;
//   title: string;
//   description: string;
//   confirmText?: string;
//   cancelText?: string;
//   loading?: boolean;
//   variant?: "default" | "destructive";
//   onConfirm: () => void;
//   onCancel: () => void;
// };

// export const ConfirmDialog = ({
//   open,
//   title,
//   description,
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   loading = false,
//   variant = "destructive",
//   onConfirm,
//   onCancel,
// }: ConfirmDialogProps) => {
//   return (
//     <Dialog open={open} onOpenChange={onCancel}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>{title}</DialogTitle>
//         </DialogHeader>

//         <div className="py-4 text-sm text-muted-foreground">
//           {description}
//         </div>

//         <div className="flex gap-2 justify-end">
//           <Button
//             variant="outline"
//             onClick={onCancel}
//             disabled={loading}
//           >
//             {cancelText}
//           </Button>

//           <Button
//             variant={variant}
//             onClick={onConfirm}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : confirmText}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };



import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

type DialogButton = {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean;
};

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  buttons?: DialogButton[];
  onCancel: () => void;
};

export const ConfirmDialog = ({
  open,
  title,
  description,
  buttons = [],
  onCancel,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4 text-sm text-muted-foreground">
          {description}
        </div>

        <div className="flex gap-2 justify-end">
          {buttons.map((button, index) => (
            <Button
              key={index}
              variant={button.variant || "default"}
              onClick={button.onClick}
              disabled={button.disabled || button.loading}
            >
              {button.loading ? "Processing..." : button.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};