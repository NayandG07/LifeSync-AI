// This file re-exports radix icons to make them compatible with our build process
// Import from the main package and re-export individually
import * as RadixIcons from "@radix-ui/react-icons";

// Re-export with the same names as the original package
export const ExclamationTriangleIcon = RadixIcons.ExclamationTriangleIcon;
export const CheckCircledIcon = RadixIcons.CheckCircledIcon;
export const QuestionMarkCircledIcon = RadixIcons.QuestionMarkCircledIcon;
export const ReloadIcon = RadixIcons.ReloadIcon;
export const Cross1Icon = RadixIcons.Cross1Icon;

// Add more icons as needed following the same pattern 