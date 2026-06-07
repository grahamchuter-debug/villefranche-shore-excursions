import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ShipScheduleBreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
};

export function ShipScheduleBreadcrumbs({
  items,
}: ShipScheduleBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-gray-200 bg-gray-50">
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-3 text-sm text-gray-600 sm:px-6">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-gray-400">
                  →
                </span>
              ) : null}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-gray-900" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-medium text-blue-700 underline-offset-2 transition hover:text-blue-800 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
