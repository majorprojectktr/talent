"use client";
import Appbar from "@/components/appbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();
  const breadcrumbs = pathname.split("/");
  return (
    <main className="w-full h-full max-w-7xl mx-auto">
      <Appbar />
      <Breadcrumb className="p-4">
        <BreadcrumbList>
          {breadcrumbs.slice(0, breadcrumbs.length).map((item, index) => {
            if (index === 0) return null;
            return (
              <div key={index} className="flex items-center gap-3">
                <BreadcrumbItem
                  key={index}
                  className="text-black text-sm font-normal capitalize"
                >
                  {item.length > 15 ? item.slice(0, 15) + "..." : item}
                </BreadcrumbItem>
                {index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </main>
  );
};

export default DashboardLayout;
