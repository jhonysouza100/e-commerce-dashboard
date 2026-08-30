import { ReactNode } from "react";

interface MainContainerProps {
	headerContent?: ReactNode;
	mainContent?: ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ headerContent, mainContent }) => {
	return (
		<div className="main_container flex justify-center items-center rounded-xl">
      <div className="section_container w-full shadow-md rounded-md overflow-hidden min-h-[calc(100vh_-_(var(--header-height)_+_2.25rem))] lg:min-h-[calc(100vh_-_(var(--header-height)_+_5rem))]">
        <section className="header_container gap-4 h-max flex justify-between items-center bg-background px-4 py-2">
          {/* Header content */}
          <>{headerContent}</>
        </section>
        <section className="table_container grid py-3 px-4 rounded-md max-h-[calc(100vh_-_(var(--header-height)_+_8.75rem))] min-h-[calc(100vh_-_(var(--header-height)_+_8.75rem))] lg:max-h-[calc(100vh_-_(var(--header-height)_+_9.5rem))] lg:min-h-[calc(100vh_-_(var(--header-height)_+_9.5rem))] [overflow:auto_overlay]">
					{/* Main content */}
          <>{mainContent}</>
        </section>
      </div>
    </div>
	);
}

export default MainContainer;