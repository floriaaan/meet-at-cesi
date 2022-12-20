import { LoaderIcon } from "react-hot-toast";
import toastStyle from "@/resources/toast.config";

export const Spinner = () => (
	<LoaderIcon
		primary={toastStyle.iconTheme.primary}
		secondary={toastStyle.iconTheme.secondary}
	/>
);
