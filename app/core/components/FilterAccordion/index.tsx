import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import FilterAccordionItem from "../FilterAccordionItem";
import type { FilterAccordionItemProps } from "../FilterAccordionItem";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface Props {
  filter: string;
  title: string;
  items: FilterAccordionItemProps[];
}
const FilterAccordion = ({ filter, title, items }: Props) => {
  return (
    <Accordion disableGutters>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel3a-controls"
        id="panel3a-header"
      >
        <strong>{title}</strong>
      </AccordionSummary>
      <AccordionDetails>
        <ul>
          {items.map((item) => (
            <FilterAccordionItem
              key={item.name}
              name={item.name}
              count={item.count}
              filter={filter}
            />
          ))}
        </ul>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterAccordion;
