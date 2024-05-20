import React from "react";

function PageContainer({ children }) {
    return (
        <div className="flex flex-col max-h-screen h-full gap-4 overflow-hidden">
            {children}
        </div>
    );
}

// Header subcomponent
PageContainer.Header = function Header({ children }) {
    return (
        <div className="w-full flex flex-col gap-4 px-4">
            {children}
        </div>
    );
};

// Content subcomponent
PageContainer.Content = function Content({ children }) {
    return (
        // 'overflow-auto' allows this div to scroll independently of the Header
        <div className="grow overflow-auto px-4 pb-[150px]">
            {children}
        </div>
    );
};

export default PageContainer;
