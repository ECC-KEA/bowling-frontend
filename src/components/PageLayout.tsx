import {ReactNode} from "react";

function PageLayout({children}:{children: ReactNode}) {
	return (
		<main className="p-4 relative">
			{children}
		</main>
	);
}

export default PageLayout;