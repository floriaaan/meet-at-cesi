import classNames from "classnames";
import Image from "next/image";

export const CESILogo = ({ className }: { className: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={500}
			height={500}
			viewBox="0 0 500 500"
			className={className}
		>
			<title>Logo CESI, École d’Ingénieurs</title>
			<path className="square" fill="transparent" d="M0 0h500v500H0z" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M311.934 276.575V174.424h17.991v102.151h-17.991zm-16.158-28.358c0 19.211-12.198 30.188-30.646 30.188-18.905 0-31.408-11.434-31.408-28.967v-4.117h17.839v4.117c0 7.47 5.184 12.349 13.416 12.349 7.776 0 12.808-4.727 12.808-12.349 0-21.041-43.301-12.199-43.301-47.874 0-18.448 11.894-28.969 29.731-28.969 18.296 0 30.035 10.977 30.035 27.138v3.964h-17.532v-3.659c0-6.556-4.88-10.824-12.352-10.824-7.165 0-11.892 4.116-11.892 11.128.002 20.737 43.302 10.979 43.302 47.875zm-128.677-73.793h52.753v16.619H185.09v25.917h29.883v16.162H185.09v26.834h34.762v16.618h-52.753v-102.15zm-49.548 103.981c-19.516 0-32.476-11.893-32.476-30.036V202.63c0-18.143 12.96-30.035 32.476-30.035 19.363 0 32.169 11.892 32.169 30.035v8.386h-17.991v-7.928c0-8.538-5.793-13.874-14.178-13.874-8.691 0-14.333 5.335-14.333 13.874v44.825c0 8.537 5.642 13.874 14.333 13.874 8.385 0 14.178-5.337 14.178-13.874v-7.929h17.991v8.385c0 18.144-12.806 30.036-32.169 30.036z"
			/>
			<path fill="currentColor" d="M348.226 258.606h66.279v17.99h-66.279z" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M409.707 308.822c0-1.564-1.166-2.586-2.951-2.586-1.711 0-2.841.984-2.841 2.66 0 4.951 10.345 2.621 10.345 11.436 0 4.59-2.915 7.213-7.32 7.213-4.518 0-7.504-2.732-7.504-6.92v-.984h4.262v.984c0 1.783 1.238 2.949 3.206 2.949 1.855 0 3.058-1.129 3.058-2.949 0-5.027-10.344-2.916-10.344-11.439 0-4.405 2.841-6.92 7.102-6.92 4.372 0 7.178 2.623 7.178 6.484v.947h-4.189v-.875zm-20.033 18.285l-3.425-8.852h-2.841v8.852h-4.298v-24.404h7.54c4.88 0 7.686 2.842 7.686 7.759 0 3.532-1.385 5.937-3.934 7.066l4.334 9.579h-5.062zm-3.46-20.433h-2.806v7.758h2.806c2.403 0 3.786-1.42 3.786-3.896 0-2.442-1.383-3.862-3.786-3.862zm-21.383 20.871c-4.553 0-7.576-2.77-7.576-6.994v-17.848h4.299v17.738c0 1.895 1.274 3.133 3.277 3.133 1.931 0 3.241-1.201 3.241-3.133v-17.738h4.299v17.848c0 4.224-2.986 6.994-7.54 6.994zm-26.371-24.842h12.603v3.971h-8.305v6.191h7.139v3.859h-7.139v6.412h8.305v3.971H338.46v-24.404zm-11.292 0h4.298v24.404h-4.298v-24.404zm-18.066 8.051h-.328l.182 1.674v14.68h-4.298v-24.404h5.063l6.011 16.354h.328l-.22-1.674v-14.68h4.335v24.404h-5.1l-5.973-16.354zm-23.495-8.051h12.604v3.969h-8.305v6.193h7.138v3.861h-7.138v6.41h8.305v3.971h-12.604v-24.404zm4.225-1.967l2.404-5.281h4.734v.619l-3.934 4.662h-3.204zm-18.285 26.809c-4.662 0-7.758-2.842-7.758-7.176v-10.928c0-4.334 3.096-7.176 7.758-7.176 4.625 0 7.686 2.805 7.686 7.176v1.057h-4.299v-.947c0-2.004-1.346-3.314-3.387-3.314-2.076 0-3.424 1.275-3.424 3.314v10.928c0 1.967 1.348 3.313 3.424 3.313 2.003 0 3.387-1.311 3.387-3.313v-2.842h-3.096v-3.643h7.395v6.375c-.001 4.371-3.061 7.176-7.686 7.176zm-25.168-16.791h-.328l.182 1.674v14.68h-4.298v-24.404h5.063l6.01 16.354h.328l-.218-1.674v-14.68h4.334v24.404h-5.1l-5.973-16.354zm-15.736-8.051h4.298v24.404h-4.298v-24.404zm-11.838 8.342l1.421-8.342h4.516v.582l-2.914 7.76h-3.023zm-13.223 16.062h-7.432v-24.404h7.432c4.626 0 7.722 2.878 7.722 7.32v9.762c0 4.445-3.096 7.322-7.722 7.322zm3.424-16.937c0-2.148-1.349-3.496-3.57-3.496h-2.986v16.463h2.986c2.222 0 3.57-1.348 3.57-3.496v-9.471zm-43.895-7.467h12.603v3.971h-8.305v6.191h7.139v3.859h-7.139v6.412h8.305v3.971h-12.603v-24.404zm-17.885 0h4.299v20.434h7.722v3.971h-12.021v-24.405zm-14.206 24.842c-4.771 0-7.903-2.915-7.903-7.357v-10.564c0-4.443 3.132-7.357 7.903-7.357 4.735 0 7.831 2.914 7.831 7.357v10.564c0 4.442-3.096 7.357-7.831 7.357zm3.533-17.813c0-2.113-1.421-3.496-3.533-3.496-2.186 0-3.569 1.383-3.569 3.496v10.346c0 2.111 1.384 3.496 3.569 3.496 2.112 0 3.533-1.385 3.533-3.496v-10.346zm-24.734 17.813c-4.662 0-7.758-2.842-7.758-7.176v-10.928c0-4.334 3.096-7.176 7.758-7.176 4.626 0 7.687 2.842 7.687 7.176v2.003h-4.298v-1.894c0-2.039-1.385-3.314-3.389-3.314-2.075 0-3.423 1.275-3.423 3.314v10.709c0 2.039 1.348 3.314 3.423 3.314 2.004 0 3.389-1.275 3.389-3.314v-1.896h4.298v2.005c0 4.335-3.061 7.177-7.687 7.177zM85.74 302.703h12.603v3.969h-8.305v6.193h7.139v3.861h-7.139v6.41h8.305v3.971H85.74v-24.404zm4.225-1.967l2.404-5.281h4.734v.619l-3.934 4.662h-3.204z"
			/>
		</svg>
	);
};

const getSrc = () => {
	if (process.env.NEXT_PUBLIC_APP_ENV === "production") return "/favicon.png";
	if (process.env.NEXT_PUBLIC_APP_ENV === "development")
		return "/favicon-dev.png";
	if (process.env.NEXT_PUBLIC_APP_ENV === "local") return "/favicon-local.png";
	return "/favicon.png";
};

export const Logo = ({ className }: { className?: string }) => {
	return (
		<Image
			src={"/logo.svg"}
			alt="Meet at CESI"
			className={classNames("", className)}
			width={128}
			height={128}
		/>
	);
};
