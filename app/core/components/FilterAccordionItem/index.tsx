import { useSearchParams } from "@remix-run/react";
import Link from "~/core/components/Link";

export interface FilterAccordionItemProps {
  name: string;
  count: number;
  filter?: string;
}
const FilterAccordionItem = ({
  name,
  count,
  filter,
}: FilterAccordionItemProps) => {
  const [searchParams] = useSearchParams();
  return (
    <li>
      <Link
        color="#AF2E33"
        to={`?${searchParams.toString()}&${filter}=${name}`}
      >
        {name} ({count ?? "0"})
      </Link>
    </li>
  );
};

export default FilterAccordionItem;
